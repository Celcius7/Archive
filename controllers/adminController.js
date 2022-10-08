const mongoose =require("mongoose")
const Users=require("../models/userModel")
const Jobs=require("../models/jobModel")
const contactsModel = require("../models/contactsModel")
const Payment = require("../models/payments")


const AdminController={


    //Get All Users

    allUsers:async(req,res)=>{
        try{
            const user=await Users.find().exec()
            res.status(200).send({user})
        }
        catch(err){
            res.status(500).send({message:err.message})
        }
    },

    //Get All Jobs
    allJobs:async(req,res)=>{
        try{
            const jobs=await Jobs.find().exec()
            res.status(200).send({jobs})
        }
        catch(err){
            res.status(500).send({message:err.message})
        }
    },
    //Get All Queries
    allqueries:async(req,res)=>{
        try{
            const queries=await contactsModel.find().exec()
            res.status(200).send({queries})
        }
        catch(err){
            res.status(500).send({message:err.message})
        }
    },
    //Get All Payments
    allPayments:async(req,res)=>{
        try{
            const payment=await Payment.find().exec()
            res.status(200).send({payment})
        }
        catch(err){
            res.status(500).send({message:err.message})
        }
    },

    //Delete User By ID
    deleteUser: async (req, res) => {
        try {
            await Users.findByIdAndDelete(req.params.id)

            res.json({message: "Deleted Success!"})
        } catch (err) {
            return res.status(500).json({message: err.message})
        }
    }, 

    //Delete JobById
    deleteJobById:async (req, res) => {
        try{
        const job=await Jobs.findByIdAndDelete(req.params._id)
        res.status(200).json(job)
        }
        catch(err) {
            return res.status(500).json({msg:err.message})
        }
    },

    //Update Job

    updateJob:async(req,res)=>{
        try{
            const status=req.body.status
            const job =await Jobs.findOneAndUpdate({id:req.params.id},{status:status}).exec()
            res.status(200).send({job})
        }
        catch(err){
            res.status(200).send({message:err.message})
        }
    },

    updatePaymentIntent:async(req,res)=>{
        try{
            const {status}=req.body
            const job =await Payment.findOneAndUpdate({id:req.params.id},{paymentStatus:status}).exec()
            res.status(200).send({job})
        }
        catch(err){
            res.status(200).send({message:err.message})
        }
    }
}

module.exports=AdminController;