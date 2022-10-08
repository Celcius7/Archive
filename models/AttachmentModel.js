const mongoose = require("mongoose");

const attachmentSchema = new mongoose.Schema({
    attachmentUrl: {
        type: String,
      },
      attachmentName:{
        type:String,
      },
      chatroomId:{
          type:String,
      },
  },{timestamps:true});
  
  module.exports = mongoose.model("ChatroomAttachment", attachmentSchema);