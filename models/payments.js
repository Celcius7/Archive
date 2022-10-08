const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    paymentStatus:{
        type:String,
        default:"Unpaid",
    },
    chatroomId:{
        type:String,
    },
    userId:{
        type:String,
    },
    paymentIntent:{
        type:Array,
    },
},{timestamps:true});

module.exports = mongoose.model("Payment", paymentSchema);
