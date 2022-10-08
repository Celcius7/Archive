const mongoose = require("mongoose");
const Chatroom = mongoose.model("Chatroom");
const SaveContent=require("../models/AttachmentModel");
const Payments = require("../models/payments");
// const SaveContent=mongoose.model("ChatroomAttachment");
exports.createChatroom = async (req, res) => {
  const { userId,} = req.body;
  console.log("I am in Chat room:",)
  // const nameRegex = /^[A-Za-z\s]+$/;

  // if (!nameRegex.test(name)) throw "Chatroom name can contain only alphabets.";

  // const chatroomExists = await Chatroom.findOne({ name });

  // if (chatroomExists) throw "Chatroom with that name already exists!";

  const chatroom = new Chatroom({
    userId,
  });

  await chatroom.save();

  res.json({
    chatroom
  });
};

exports.getAllChatrooms = async (req, res) => {
  const chatrooms = await Chatroom.find({});
  res.json(chatrooms);
};

exports.getAllChatroomByName = async (req, res) => {
  try{
    console.log("Here is your Id:",req.params.Id)
    const userId=req.params.Id
    const chatrooms = await Chatroom.find({userId:{$in:userId}});
    res.json(chatrooms);
  }
  catch(err){
    res.status(200).send({ message:err.message });
  }
};

exports.getChatroomById = async (req, res) => {
  try{
    console.log("Here is your Id:",req.params.id)
    const id=req.params.id
    const chatrooms = await Chatroom.findById(id);
    res.json(chatrooms);
  }
  catch(err){
    res.status(200).send({ message:err.message });
  }
};

exports.updateChatroomById=async(req,res)=>{
  try{
    const{id,attachments,proposalDetails,deliveryDate,documentation,deliverables,deliverableFiles,jobAccepted,cost,paymentStatus,deliverablesStatus,Review}=req.body
    const updateChatroom=await Chatroom.findOneAndUpdate({_id:id},{attachments,proposalDetails,deliveryDate,documentation,deliverables,deliverableFiles,jobAccepted,cost,paymentStatus,deliverablesStatus,Review}).exec()
    res.status(200).send({updateChatroom});
  }
  catch(err){
    res.status(500).send({message:err.message})
  }
},

exports.createAttachment=async(req,res)=>{
  try{
    const{attachmentUrl,attachmentName,chatroomId}=req.body
    const attachment=new SaveContent({
      attachmentUrl,
      attachmentName,
      chatroomId,
    });
    await attachment.save();
    res.status(200).send({message:"Attachement Saved Sucessfully"})
  }
  catch(err){
    res.status(400).send({message:err.message})
  }
};

exports.getChatroomAttachments=async(req,res)=>{
  try{
    const{chatroomId}=req.body
    const attachments=await SaveContent.find({chatroomId:{$eq:chatroomId}}).sort({'createdAt':-1}).exec()
    res.status(200).send(attachments)
  }
  catch(err){
    res.status(400).send({message:err.message})
  }
}

exports.getPaymentByChatroom=async(req,res)=>{
  try{
    const {chatroomId}=req.body
    const payments=await Payments.find({chatroomId:{$eq:chatroomId}}).exec()
    res.status(200).send(payments)
  }
  catch(err){
    res.status(500).send({message:err.message})
  }
}