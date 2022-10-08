const mongoose = require("mongoose");
const Messages = mongoose.model("Message");

const messageController = {

    getMessages:async(req, res, next) =>{
        try{
            const chatroomId=req.params._id;
            const messages=await Messages.find({chatroom:{$eq:chatroomId}});
            console.log(messages);
            res.status(200).send({messages})
        }
        catch(err){
            res.status(500).send({message:err.message})
        }
    }
}

module.exports=messageController;