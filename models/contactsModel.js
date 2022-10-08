const mongoose=require('mongoose')

const contactsSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please enter your name!'],
        trim:true
    },
    email:{
        type:String,
        required:[true,"Please enter your email!"],
    },
    title:{
        type:String,
        required:[true,"Please enter title!"]
    },
    message:{
        type:String,
        required:[true,"Please enter message!"]
    },
},{timestamps:true })

module.exports=mongoose.model("Contacts",contactsSchema)