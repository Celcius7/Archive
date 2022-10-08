//Dependencies
const JobsResponse=require('../models/jobResponse')
const Jobs = require('../models/jobModel')
const jwt=require('jsonwebtoken')
const Users=require('../models/userModel')
const mongoose=require('mongoose')
const jobResponse = require('../models/jobResponse')

//INTIALIZES EMPTY DATA ARRAY

    let Data=[]; 

 // Get users by rating

    const handleRating = async(req,res,category)=>{
        try{
            const users= await Users.find({rating:{$eq:rating}}).exec()
            Data.push(users)
        }
        catch(err){
            res.status(500).send({message:err.message})
        }
    }   
//Get jobs by category name

    const handleCategory = async (category) => {
        try{
            console.log("Here is the category",category)
            const jobs = await Jobs.find({category:{$elemMatch:{service:category}}}).exec();
            for(i=0;i<jobs.length;i++){
                if(Data.indexOf(jobs[i]._id)!==-1){
                    return
                }
                else{
                    Data.push(jobs)
                }
            }
            return;
        } 
        catch (err) {
            res.json({message: err.message})
        }
    };

//Get Jobs by deadline

    const handleDeadLine= async (deadLine) => {
    console.log(deadLine)
    try{
        let jobs = await Jobs.find({deadLine:{$eq:deadLine}})
        for(i=0;i<jobs.length;i++){
            if(Data.indexOf(jobs[i]._id)!==-1){
                return
            }
            else{
                Data.push(jobs)
            }
        }
        return;
    }
    catch (err) {
        res.status(400).send({message: err.message})
    }
    }

//Get Jobs by budget    

    const handlePrice = async (budget) => {
        try {
            console.log("I am in budget:",budget[1])
        let jobs = await Jobs.find({
            budget: { $elemMatch: { $gte:budget[0], $lte:budget[1] } }
        }).exec();
        for(i=0;i<jobs.length;i++){
            if(Data.indexOf(jobs[i]._id)!==-1){
                return
            }
            else{
                Data.push(jobs)
            }
        }
        return;
        } catch (err) {
        console.log(err);
        }
    };

//Get Jobs by Genres

    const handleGenres = async (genres) => {
        try{
            console.log("Here is the genere", genres)
            const jobs = await Jobs.find({genres:{$elemMatch:{genere:genres}}})
            .exec();
            for(i=0;i<jobs.length;i++){
                if(Data.indexOf(jobs[i]._id)!==-1){
                    return
                }
                else{
                    Data.push(jobs)
                }
            }
            return;
            } 
            catch (err) {
                res.json({message: err.message})
            }
    };

//jobs controllers

const jobsController={

    //Create A Job
    
        createJob:async(req,res)=>{
            try{
                const {jobTitle,deadLine,genres,description,referenceLinks,budget,category,subCategory,uploadMp3}=req.body
                const user=await Users.findOne({_id: req.user.id})
                console.log(user)
                if(!jobTitle||!genres||!description||!budget)
                    return res.status(400).json({message:"Please fill all fields"})
                const newJob= new Jobs({
                    jobTitle:jobTitle,
                    category:category,
                    subCategory:subCategory,
                    deadLine:deadLine,
                    genres:genres,
                    description:description,
                    referenceLinks:referenceLinks,
                    budget:budget,
                    uploadMp3:uploadMp3,
                    jobPostedBy:user,
                })
                await newJob.save()
                res.json({newJob,message:"Job Post Success!"})
            }
            catch(err){
                return res.status(500).json({message:err.message})
            }
        }, 

    //Update Job 

        updateJob:async(req,res)=>{
            try{
                const{
                    status,
                    jobId,
                    jobTitle,
                    category,
                    subCategory,
                    deadLine,
                    genres,
                    description,
                    referenceLinks,
                    budget,
                    uploadMp3}=req.body
                await Jobs.findByIdAndUpdate({_id:jobId},{
                    status,
                    jobTitle,
                    category,
                    subCategory,
                    deadLine,
                    genres,
                    description,
                    referenceLinks,
                    budget,
                    uploadMp3
                })
                res.json({message:"Job Updated Succesfully"})
            }
            catch(err){
                return res.status(500).json({message:err.message})
            }
        },
    
    //Get All Jobs

        getJobs:async(req, res)=>{
            try {
                const jobs = await Jobs.find()
                res.json(jobs)
            } catch (err) {
                return res.status(500).json({msg: err.message})
            }
        },

        getJobsByCount:async(req,res)=>{
            try{
                const {page,count}=req.body
                const jobs = await Jobs.find({status:"not_funded"})
                .skip((page - 1) * count)
                .limit(count)
                .exec()
                res.status(200).send(jobs)
              }
              catch(err){
                res.status(400)
              }
        },

    //Save Jobs Responses

        responseJob:async(req, res)=>{
            try{
            console.log("userId:",req.user)
            const responseBy=req.user.id
            const {youProvide,description,quotation,jobId}=req.body
            console.log("Here is job Id:",jobId)
            const check=await JobsResponse.find({jobId:jobId,responseBy:responseBy}).exec()
            console.log(check)
            if(check.length!=0) return res.status(400).json({msg:"Response already exists!"})
            const newResponse=new JobsResponse({
                youProvide,
                description,
                quotation,
                responseBy,
                jobId
            })
            await newResponse.save()
            res.json({msg:"Response saved successfully!"})   
            }
            catch(err) {
                return res.status(500).json({msg:err.message})
            }
        },

    //Service seeker requesting for working

    requestToWork:async(req, res)=>{
        try{
        const {youProvide,description,quotation,jobId,responseBy}=req.body
        console.log("Here is job Id:",jobId)
        // const check=await JobsResponse.findOne({responseBy})
        // if(check) return res.status(400).json({msg:"Response already exists!"})
        const newResponse=new JobsResponse({
            youProvide,
            description,
            quotation,
            responseBy,
            jobId
        })
        await newResponse.save()
        res.json({msg:"Response saved successfully!"})   
        }
        catch(err) {
            return res.status(500).json({msg:err.message})
        }
    },
    
    //Update JobResponse Status

        updateJobResponseStatus:async(req,res)=>{
            try{
                const {status,jobId,userId}=req.body
                console.log(req.body)
                const updateResponse=await JobsResponse.updateOne({
                    $and:[
                        {jobId:jobId},
                        {responseBy:mongoose.Types.ObjectId(userId)}
                        ]},{status}).exec()
                console.log(updateResponse)
                res.status(200).send(updateResponse)
            }
            catch(err){
                res.status(400).send({message:err.message})
            }
        },  

    //GetJobResponseById

        getJobResponseById:async(req,res)=>{
            try{
                const{jobId,id}=req.body
                
                console.log("Here is user and id",id,jobId)
                const jobResponse=await JobsResponse.find({
                    $and:[
                        {jobId:jobId},
                        {responseBy:mongoose.Types.ObjectId(id)}
                    ]}).exec()
                res.status(200).json(jobResponse)
                }
                catch(err) {
                    return res.status(500).json({msg:err.message})
                }
        },
    
    //Get Single Job By id

        getJobById:async (req, res) => {
            try{
            const job=await Jobs.findById(req.params._id)
            res.status(200).json(job)
            }
            catch(err) {
                return res.status(500).json({msg:err.message})
            }
        },

    //Delete a Job by IDs

        deleteJobById:async (req, res) => {
            try{
            const job=await Jobs.findByIdAndDelete(req.params._id)
            res.status(200).json(job)
            }
            catch(err) {
                return res.status(500).json({msg:err.message})
            }
        },

    //Get Jobs by User id

        getJobByUserId:async (req, res) => {
            try{
                console.log("Here is your Id",req.user.id)
                const userId=mongoose.Types.ObjectId(req.user.id)

                const job=await Jobs.find({"jobPostedBy._id":{$eq:userId}}).exec()
                res.status(200).json({job})
            }
            catch(err) {
                return res.status(500).json({msg:err.message})
            }
        },

    //Job Search Filte

        jobSearchFilters: async (req, res) => {
            try{
            const query  = req.body;
            console.log(query);
            if (query) {
                const jobs = await Jobs.find(query)
                .exec();
            res.status(200).send(jobs);
            }
        }
        catch(err) {
            return res.status(500).json({message:err.message})
        }
        },
    
    //Service Provider filters jobs

        serviceProviderFilters: async (req, res) => {
            try{
                const query=req.body;
                console.log(query.service);
                if(query) {
                    const service= await Users.find({services:{$elemMatch:{service:query.service.toUpperCase()}}})
                    .exec();
                res.status(200).send(service);
                }
            }
            catch(err) {
                return res.status(500).send({message:err.message})
            }
        },

    //SubService Provider filter
    subServiceProviderFilters: async (req, res) => {
        try{
            const query=req.body;
            console.log(query.subService);
            if(query) {
                const service= await Users.find({services:{$elemMatch:{subService:query.subService}}})
                .exec();
            res.status(200).send(service);
            }
        }
        catch(err) {
            return res.status(500).send({message:err.message})
        }
    },

    //Explore Service serviceProviders

        exloreServiceProvider: async (req, res) => {
            try{
                const query=req.body;
                console.log(query.service);
                if(query) {
                    const service= await Users.find({services:{$elemMatch:{service:query.service.toUpperCase()}}})
                    .exec();
                res.status(200).send(service);
                }
            }
            catch(err) {
                return res.status(500).send({message:err.message})
            }
        },

    //Jobs Search 

        jobSearch: async(req, res, next) => {
            try{
                let jobs = await Jobs.find(
                    {
                        "$or":[
                            {"jobTitle":{$regex:req.params.key}},
                            {"deadLine":{$regex:req.params.key}},
                            {"genres":{$regex:req.params.key}},
                            {"budget":{$regex:parseInt(req.params.key)}}
                        ]
                    }
                )
                res.status(200).json(jobs);
            }
            catch(err) {
                return res.status(500).json({message:err.message})
            }
        },


    //JobFilter

    jobFilter: async(req, res, next) => {
        try{
            const{category,deadLine,generes,budget}=req.body
            console.log(req.body)
            let jobs = await Jobs.find(
                {
                    "$and":[
                        {category:{$elemMatch:{service:category}}},
                        {deadLine:{$eq:deadLine}},
                        // {genres:{$elemMatch:{genere:generes}}},
                        //{budget: { $elemMatch: { $gte:budget[0], $lte:budget[1]}}}
                    ]
                }
            )
            res.status(200).json(jobs);
        }
        catch(err) {
            return res.status(500).json({message:err.message})
        }
    },
    // SERACH / FILTER
  
        searchFilters: async (req, res) => {
            const { category, budget, deadLine, generes} = req.body;

            if (category!== undefined) {
                console.log("Here is your category", category);
                await handleCategory(category);
            }

            if (budget !== undefined) {
                console.log("Here is your budget", budget);
                await handlePrice(budget);
            }

            if (deadLine !== undefined) {
                console.log("Here is your deadline", deadLine);
                await handleDeadLine( deadLine);
                
            }
    
            if (generes!== undefined) {
                console.log("Here is genres", generes);
                await handleGenres(generes);
            }

          

            res.status(200).send(Data[0])
            Data=[];
        },

    //Search Service Provider
    
        // serviceProviderSearch: async(req, res, next) => {
        //     try{
               
        //         res.status(200).json(serviceProviders);
        //     }
        //     catch(err) {
        //         return res.status(500).json({message:err.message})
        //     }
        // },

    //Get Job By Country

        // getJobsByCount:async(req, res, next)=>{
        //     try{
        //         const count=req.params.count
        //         const jobs = await Jobs.find().limit(parseInt(count))
        //         console.log(count)
        //         res.status(200).json(jobs)
        //     }
        //     catch (err) {
        //         res.status(500).json({message:err.message})
        //     }
        // },
    
    //Job post update in user schema

        jobPostedByUser: async(req, res, next) => {
            try{    
                const user=req.user.id;
                const jobId=req.body.jobId;
                const update=await Users.updateOne({_id:{$eq:user}},{$push:{postedJobs:jobId}}).exec();
                res.status(200).send({message:"Job Updated successfully"})
            }
            catch(err){
                res.status(400).send({message:err.message})
            }
        },
    
    //My jobs response

        myJobResponse:async(req, res, next)=>{
            try{
                const userId=req.user.id
                const user=await Users.findOne({_id:{$eq:userId}}).exec()
                const jobs=user.postedJobs
                console.log(jobs)
                let sendJobs=[]
                if(jobs!=undefined)
                {
                    for(i=0; i<jobs.length; i++){
                        const job=jobs[i]
                            const response= await JobsResponse.find({jobId:{$eq:job}}).exec()
                            sendJobs.push(...response)
                    }   
                }       
                res.status(200).send({sendJobs})
            }
            catch(err){
                res.status(200).send({message:err.message})
            }
        },
    
    // My responses on jobs

        responseJobById:async(req,res,next) =>{
            console.log("Heer ")
            try{
                const user=req.user.id
                console.log("Here is your user:",user)
                const response=await JobsResponse.find({responseBy:mongoose.Types.ObjectId(user)}).exec()
                console.log(response)
                res.status(200).send({response})
            }
            catch(err) {
                res.status(500).send({message:err.message})
            }
        }
}

module.exports=jobsController