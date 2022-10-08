const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    userName:{
        type:String
    },
    name:{
        type:String,
        required:[true,'Please enter your name!'],
        trim:true
    },
    avatar:{
        type:String,
        default:"https://res.cloudinary.com/dda7rejqi/image/upload/v1640185054/unnamed_t8i2or.jpg"
    },
    email:{
        type:String,
        required:[true,"Please enter Your email!"],
        trim:true,
        unique:true
    },
    password:{
        type:String,
        required:[true,"Please enter your Password!"]
    },
    role:{
        type:Number,
        default:0
    },
    isMusician:{
        type:String,
    },
    city:{
        type:String,
    }, 
    mobile:{
        type:Number
    },
    state:{
        type:String,
    },
    country:{
        type:String,
    },
    description:{
        type:String,
    },
    genres:{
        type:Array,
    },
    services:{
        type:Array,
    },
    gearHighLights:{
        type:Array,
    },
    review:{
        type:Array,
    },
    tag:{},
    terms:{
        type:Array
    },
    postedJobs:{

    },
    startingPrice:{
        type:Array
    },
    workSample:{},
    isProfileCompleted:{
        type:Boolean,
        default:false
    },
    jobsCompleted:{
        type:Number,
        default:0
    },
    totalEarn:{
        type:Number,
        default:0
    },
    repeatedBuyer:{
        type:Number,
        default:0
    },
    profileUrl:{
        type:String,
    },
    Rating:{
        type:Number,
    },
    socialMedia:{
        type:Array,
    }
},{timestamps:true })

module.exports=mongoose.model("Users",userSchema)