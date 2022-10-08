const mongoose=require('mongoose')

const jobResponseSchema=new mongoose.Schema({
    status:{
        type:String,
        default:"active",
    },
    jobId:{
        type: String,
    },
    youProvide:{
        type:String,
        required:[true,'Please enter job title!'],
        trim:true
    },
    description:{
        type:String,
        required:[true,"Please enter your description!"]
    },
    quotation:{
        type:Number,
        required:[true,"Please enter your budget amount!"]
    },
    responseBy:
        {type:mongoose.Schema.Types.ObjectId,ref:"Users"}
},{timestamps:true })

module.exports=mongoose.model("JobsResponse",jobResponseSchema)