const mongoose = require("mongoose");

const chatroomSchema = new mongoose.Schema({
  userId: {
    type: Array,
  },
  attachments:{
    type:Array,
  },
  proposalDetails:{
    type:String,
  },
  deliveryDate:{
    type:String,
  },
  documentation:{
    type:String,
  },
  deliverables:{
    type:Array,
  },
  deliverableFiles:{
    type:String,
  },
  deliverablesStatus:{
    type:Boolean,
    default:false,
  },
  jobAccepted:{
    type:String,
  },
  cost:{
    type:Number
  },
  paymentStatus:{
    type:Boolean,
    default:false
  },
  Review:{
    type:Array
  },
});

module.exports = mongoose.model("Chatroom", chatroomSchema);
