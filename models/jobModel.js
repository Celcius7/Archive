const mongoose=require('mongoose')

const jobSchema=new mongoose.Schema({
    status:{
        type:String,
    },
    jobTitle:{
        type:String,
        required:[true,'Please enter job title!'],
        trim:true
    },
    category:{},
    subCategory:{},
    deadLine:{
        type:String,
        required:[true,"Please enter deadline"]
    },
    genres:{
        type:Array,
        required:[true,"Please enter genre type!"],
    },
    description:{
        type:String,
        required:[true,"Please enter your description!"]
    },
    referenceLinks:{
        type:String,
    },
    budget:{
        type:Array,
    },
    uploadMp3:{
        type:String,
    },
    paymentIntent:{
    
    },
    jobPostedBy:{}
},{timestamps:true })

module.exports=mongoose.model("Jobs",jobSchema)