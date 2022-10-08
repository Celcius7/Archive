const Razorpay = require('razorpay'); 
const Jobs = require('../models/jobModel');
const Payment =require("../models/payments")

// This razorpayInstance will be used to
// access any resource from razorpay

const razorpayInstance = new Razorpay({

    // Replace with your key_id
    key_id: "rzp_live_5olF9jC5a7vicu",
  
    // Replace with your key_secret
    key_secret: "IhdhueiahoP1DRXRqrHWl0l6"
});

    //Payment Controller

 const paymentController={

    //Create Order Id

        createOrder:async(req,res)=>{
            try{
                const {amount,currency,receipt, notes}  = req.body;      
                razorpayInstance.orders.create({amount, currency, receipt, notes}, 
                    async(err, order)=>{
                    
                    //STEP 3 & 4: 
                    if(!err){
                        res.json(order)
                    }
                    else
                        res.send(err);
                    })
            }
            catch(err){
                res.status(500).send({message:err.message})
            }
        },

    //Save Order Id

        saveOrder:async(req,res)=>{
                try{
                const {userId,chatroomId,paymentIntent,jobId} = req.body;     
                const payment=new Payment({
                    userId,chatroomId,paymentIntent
                });
                await payment.save();
                const updateJob=await Jobs.findOneAndUpdate({id:{$eq:jobId}},{
                    paymentIntent:paymentIntent
                })
                res.status(200).send(payment)
                }
                catch(err){
                    res.status(500).send({message:err.message});
                }
        },
    
    //Get Chtroom Order By Id

        getOrderByChatroomId:async(req,res)=>{
            try{
                const {chatroomId}=req.body
                const order=await Payment.find({chatroomId:{$eq:chatroomId}}).exec()
                res.status(200).send(order);
            }
            catch(err){
                res.status(500).send({message:err.message})
            }
        }

 }

 module.exports=paymentController
