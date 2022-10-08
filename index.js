require('dotenv').config()
const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')
const cookieParser=require('cookie-parser')
const fileUpload=require('express-fileupload')
const Message=require('./models/Message')
const User=require('./models/userModel')
const Chatroom=require('./models/Chatroom')
const app=express()
app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use(fileUpload({
    useTempFiles:true
}))

//Routes
app.use('/user',require('./routes/userRoute'))
app.use('/api',require('./routes/upload'))
app.use('/jobs',require('./routes/JobRoute'))
app.use("/chatroom", require("./routes/messageRoute"));
app.use("/payment",require('./routes/paymentRoute'))
app.use("/admin",require('./routes/adminRoute'))


//Connect to mongo Db
const mongoUri=process.env.DB_URI
mongoose.connect(mongoUri,{
    useNewUrlParser:true,
    useUnifiedTopology:true
},err=>{
    if(err) throw err;
    console.log("Connected to MongoDB")
})

mongoose.connection.on("error", (err) => {
    console.log("Mongoose Connection ERROR: " + err.message);
  });
  
  mongoose.connection.once("open", () => {
    console.log("MongoDB Connected!");
  });

app.use('/',(req,res,next)=>{
    res.json({message:"Hello EveryOne"})
})

const PORT=process.env.PORT ||8080
const server =app.listen(PORT,()=>{
    console.log(`Server is Runnig at Port Number:${PORT}`)
})
const io = require("socket.io")(server, {
    allowEIO3: true,
    cors: {
      origin: true,
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.use(async (socket, next) => {
    try {  
      const token = socket.handshake.query.userId;
      console.log("Here is your userId<",token)
      const payload = await token;
      socket.userId = payload;
      next();
    } catch (err) {}
  });

  io.on("connection", (socket) => {
    console.log("Connected: " + socket.userId);
  
    socket.on("disconnect", () => {
      console.log("Disconnected: " + socket.userId);
    });
  
    socket.on("joinRoom", ({ chatroomId }) => {
      socket.join(chatroomId);
      console.log("A user joined chatroom: " + chatroomId);
    });
  
    socket.on("leaveRoom", ({ chatroomId }) => {
      socket.leave(chatroomId);
      console.log("A user left chatroom: " + chatroomId);
    });
  
    socket.on("chatroomMessage", async ({ chatroomId, message }) => {
      if (message.trim().length > 0) {
        const user = await User.findOne({ _id: socket.userId });
        console.log(user)
        var today = new Date();
var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var dateTime = date+' '+time;
        const newMessage = new Message({
          chatroom: chatroomId,
          user: socket.userId,
          message,
          avatar:user.avatar,
          name:user.name,
          createdAt:dateTime
        });
        io.to(chatroomId).emit("newMessage", {
          message,
          name: user.name,
          userId: socket.userId,
          avatar:user.avatar,
          createdAt:dateTime
        });
        await newMessage.save();
      }
    });
  });