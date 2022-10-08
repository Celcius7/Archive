//Dependencies

const Users=require('../models/userModel')
const Contacts=require('../models/contactsModel')
const QRCode = require('qrcode')

var mongoose = require('mongoose');
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const sendMail=require('./sendMail')
const {CLIENT_URL}=process.env
const fetch = require("node-fetch")
const {google} = require("googleapis")
const Jobs = require('../models/jobModel');
const { findOneAndUpdate } = require('../models/userModel');
const {OAuth2} = google.auth
const client = new OAuth2(process.env.MAILING_SERVICE_CLIENT_ID)

//Intializes Empty array

    var UsersJobs=[]

// Get users by rating

    const handleRating = async(rating)=>{
        try{

            const users= await Users.find({Rating:{$eq:rating}}).exec()
            UsersJobs.push(users)
        }
        catch(err){
            res.status(500).send({message:err.message})
        }
    }

//Get jobs by pricing

    const handlePrice = async (budget) => {
        try {
            console.log("I am in budget:",budget[1])
        let jobs = await Users.find({
            startingPrice: { $elemMatch: { $gte:budget[0], $lte:budget[1] } }
        }).exec();
        UsersJobs.push(jobs)
        //   Data.push(jobs);
        } catch (err) {
        console.log(err);
        }
    };

//Get Users by Genres

    const handleGenres = async (genres) => {
        try{
            console.log("Here is the genere", genres)
            const jobs = await Users.find({genres:{$elemMatch:{genere:genres}}})
            .exec();
            console.log(jobs)
            UsersJobs.push(jobs);
            return;
            }
            catch (err) {
                res.json({message: err.message})
            }
    };

//Get Jobs by Job title

    const handleJobTitle = async (req, res, jobTitle) => {
        try{
            console.log("Here is your Job title", jobTitle)
            const jobs=await Users.find({tag:{$regex:jobTitle}}).exec()
            UsersJobs.push(jobs);
            return;
        }
        catch (err) {
            res.status(400).send({message:err.message})
        }
    }

//user Controller

    const userController={

    //Register New User

        register:async(req,res)=>{
            try{
                const {name,email,password}=req.body
                if(!name||!email||!password)
                    return res.status(400).json({message:"Please fill all fields"})
                if(!validateEmail(email))
                    return res.status(400).json({message:"Please enter valid email!"})
                const user=await Users.findOne({email})
                if(user) return res.status(400).json({message:"Email Already Exist!"})
                if(password.length<6) return res.status(400).json({message:"Password must be atleast 6 characters."})

                const passwordHash=await bcrypt.hash(password,12)
                const newUser={
                    name,email,password:passwordHash
                }
                const activation_token = createActivationToken(newUser)       
                const url = `${CLIENT_URL}/user/activate/${activation_token}`
                sendMail(email, url)
                res.json({message:"Register Success!Please activate your email to start."})
            }
            catch(err){
                return res.status(500).json({message:err.message})
            }
        },

    //Email Activation

        activateEmail: async (req, res) => {
            try {
                const {activation_token} = req.body
                const user = jwt.verify(activation_token, process.env.ACTIVATION_TOKEN_SECRET)

                const {name, email, password} = user

                const check = await Users.findOne({email})
                if(check) return res.status(400).json({message:"This email already exists."})

                const newUser = new Users({
                    name, email, password,isMusician:""
                })

                await newUser.save()

                res.json({message: "Account has been activated!"})

            }
            catch (err) {
                return res.status(500).json({message: err.message})
            }
        },

    //UserLogin

        login: async (req, res) => {
            try {
                const {email, password} = req.body
                const user = await Users.findOne({email})
                if(!user) return res.status(400).json({message: "This email does not exist."})

                const isMatch = await bcrypt.compare(password, user.password)
                if(!isMatch) return res.status(400).json({message: "Password is incorrect."})

                const refresh_token = createRefreshToken({id: user._id})
                res.cookie('refreshtoken', refresh_token, {
                    httpOnly: true,
                    path: '/user/refresh_token',
                    maxAge: 7*24*60*60*1000 // 7 days
                })

                res.json({user: user, refresh_token})
            } catch (err) {
                return res.status(500).json({message: err.message})
            }
        },

    //Get session access token or new Token

        getAccessToken: (req, res) => {
            try {
                const rf_token = req.cookies.refreshtoken
                if(!rf_token) return res.status(400).json({message: "Please login now!"})

                jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                    if(err) return res.status(400).json({message: "Please login now!"})

                    const access_token = createAccessToken({id: user.id})
                    res.json({access_token})
                })
            } catch (err) {
                return res.status(500).json({message: err.message})
            }
        },

    //Forgot Password

        forgotPassword: async (req, res) => {
            try {
                const {email} = req.body
                const user = await Users.findOne({email})
                if(!user) return res.status(400).json({message: "This email does not exist."})
                const access_token = createAccessToken({id: user._id})
                const url = `${CLIENT_URL}/user/reset/${access_token}`

                sendMail(email, url, "Reset your password")
                res.json({message: "Re-send the password, please check your email."})
            } catch (err) {
                return res.status(500).json({message: err.message})
            }
        },

    //Reset Paswword

        resetPassword: async (req, res) => {
            try {
                const {password} = req.body
                console.log(password)
                const passwordHash = await bcrypt.hash(password, 12)

                await Users.findOneAndUpdate({_id: req.user.id}, {
                    password: passwordHash
                })

                res.json({message: "Password successfully changed!"})
            } catch (err) {
                return res.status(500).json({message: err.message})
            }
        },

    //Get User Info

        getUserInfor: async (req, res) => {
            try {
                const user = await Users.findById(req.user.id).select('-password')

                res.json(user)
            } catch (err) {
                return res.status(500).json({message: err.message})
            }
        },

    //getUserById

        getUserById: async (req, res) => {
            try {
                const user = await Users.findById(req.params._id)
                res.json(user)
            } catch (err) {
                return res.status(500).json({message: err.message})
            }
        },

    //getUsersAllInfo

        getUsersAllInfor: async (req, res) => {
            try {
                const users = await Users.find().select('-password')

                res.json(users)
            } catch (err) {
                return res.status(500).json({message: err.message})
            }
        },

    //logout

        logout: async (req, res) => {
            try {
                res.clearCookie('refreshtoken', {path: '/user/refresh_token'})
                return res.json({message: "Logged out."})
            } catch (err) {
                return res.status(500).json({message: err.message})
            }
        },

    //update user

        updateUser: async (req, res) => {
        try {
            const {
                name,
                userName,
                avatar,
                city,
                mobile,
                state,
                country,
                description,
                startingPrice,
                genres,
                services,
                gearHighLights,
                workSample,
                isProfileCompleted,
                tag,
                terms,
                jobsCompleted,
                totalEarn,
                repeatedBuyer
                } = req.body
                await Users.findOneAndUpdate({_id: req.user.id}, {
                name,
                userName,
                avatar,
                city,
                mobile,
                state,
                country,
                description,
                tag,
                terms,startingPrice,
                genres,
                services,
                gearHighLights,
                workSample,
                isProfileCompleted,
                jobsCompleted,
                totalEarn,
                repeatedBuyer
            })
            const user=await Users.findById({_id:req.user.id}).exec()
            res.json({message:user})
        } catch (err) {
            return res.status(500).json({message: err.message})
        }
        },

    // Update User role

        updateUsersProfileById: async (req, res) => {
            try {
                const {
                    name,
                    userName,
                    avatar,
                    mobile,
                    city,
                    state,
                    country,
                    description,
                    startingPrice,
                    genres,
                    services,
                    gearHighLights,
                    socialMedia,
                    workSample,
                    isProfileCompleted,
                    tag,
                    terms,
                    jobsCompleted,
                    totalEarn,
                    repeatedBuyer} = req.body

                await Users.findOneAndUpdate({_id: req.params.id}, {
                name,
                userName,
                avatar,
                mobile,
                city,
                state,
                country,
                description,
                startingPrice,
                genres,
                socialMedia,
                services,
                gearHighLights,
                workSample,
                isProfileCompleted,
                tag,
                terms,
                jobsCompleted,
                totalEarn,
                repeatedBuyer
                })

                res.json({message: "Update Success!"})
            } catch (err) {
                return res.status(500).json({message: err.message})
            }
        },

    // Update Musician status

        updateIsMusician: async (req, res) => {
            try {
                const {isMusician} = req.body

                await Users.findOneAndUpdate({_id: req.user.id}, {
                    isMusician
                })

                res.json({message: "Update Success!"})
            } catch (err) {
                return res.status(500).json({message: err.message})
            }
        },

    //Check Username Existence

        userNameExistence:async(req,res)=>{
            try{
                const{userName}=req.body
                const user=await Users.find({userName:userName}).exec()
                if(user.length>0){
                    res.status(400).send({message:"User exist! Try another one"})
                }
                else{
                    res.status(200).send({message:"Username is available"})
                }
            }
            catch(err){
                res.status(400).send({message:err.message})
            }
        },

    //Get User By UserName

    getUserByUserName:async(req,res)=>{
        try{
            const{userName}=req.body
            const user=await Users.find({userName:userName}).exec()
            res.status(200).send({user})
        }
        catch(err){
            res.status(400).send({message:err.message})
        }
    },

    //Hero Image

    getHeroImage:async(req,res)=>{
        try{
            const user=await Users.find({role:0}).sort({_id:-1}).limit(4).select(
                '-password',
                ).exec()
            res.status(200).send({user})
        }
        catch(err){
            res.status(400).send({message:err.message})
        }
    },

    //Delete User

        deleteUser: async (req, res) => {
            try {
                await Users.findByIdAndDelete(req.params.id)

                res.json({message: "Deleted Success!"})
            } catch (err) {
                return res.status(500).json({message: err.message})
            }
        },

    //Google Login

        googleLogin: async (req, res) => {
            try {
                console.log(req.body);
                const {tokenId} = req.body

                const verify = await client.verifyIdToken({idToken: tokenId, audience: process.env.MAILING_SERVICE_CLIENT_ID})

                const {email_verified, email, name, picture} = verify.payload

                const password = email + process.env.GOOGLE_SECRET

                const passwordHash = await bcrypt.hash(password, 12)

                if(!email_verified) return res.status(400).json({message: "Email verification failed."})

                const user = await Users.findOne({email})

                if(user){
                    const isMatch = await bcrypt.compare(password, user.password)
                    if(!isMatch) return res.status(400).json({message: "Password is incorrect."})

                    const refresh_token = createRefreshToken({id: user._id})
                    res.cookie('refreshtoken', refresh_token, {
                        httpOnly: true,
                        path: '/user/refresh_token',
                        maxAge: 7*24*60*60*1000 // 7 days
                    })

                 res.json({user,refresh_token})
                }else{
                    const newUser = new Users({
                        name, email, password: passwordHash, avatar: picture,isMusician:"",
                    })

                    await newUser.save()

                    const refresh_token = createRefreshToken({id: newUser._id})
                    res.cookie('refreshtoken', refresh_token, {
                        httpOnly: true,
                        path: '/user/refresh_token',
                        maxAge: 7*24*60*60*1000 // 7 days
                    })

                    res.json({user:newUser, refresh_token})
                }


            } catch (err) {
                return res.status(500).json({message: err.message})
            }
        },

    //Facebook login

        facebookLogin: async (req, res) => {
            try {
                const {accessToken, userID} = req.body

                const URL = `https://graph.facebook.com/v2.9/${userID}/?fields=id,name,email,picture&access_token=${accessToken}`

                const data = await fetch(URL).then(res => res.json()).then(res => {return res})

                const {email, name, picture} = data

                const password = email + process.env.FACEBOOK_SECRET

                const passwordHash = await bcrypt.hash(password, 12)

                const user = await Users.findOne({email})

                if(user){
                    const isMatch = await bcrypt.compare(password, user.password)
                    if(!isMatch) return res.status(400).json({msg: "Password is incorrect."})

                    const refresh_token = createRefreshToken({id: user._id})
                    res.cookie('refreshtoken', refresh_token, {
                        httpOnly: true,
                        path: '/user/refresh_token',
                        maxAge: 7*24*60*60*1000 // 7 days
                    })

                    res.json({user,refresh_token})
                }else{
                    const newUser = new Users({
                        name, email, password: passwordHash, avatar: picture.data.url,isMusician:"",
                    })

                    await newUser.save()

                    const refresh_token = createRefreshToken({id: newUser._id})
                    res.cookie('refreshtoken', refresh_token, {
                        httpOnly: true,
                        path: '/user/refresh_token',
                        maxAge: 7*24*60*60*1000 // 7 days
                    })

                    res.json({user,refresh_token})
                }


            } catch (err) {
                return res.status(500).json({msg: err.message})
            }
        },

    //Contact Us

        contactUs: async (req, res) => {
            try{
                const{name, email, title, message} = req.body
                const newContact = new Contacts({
                    name,email,title,message
                })
                await newContact.save()
                res.status(200).json({message:"Contact Saved"})
            }
            catch (err) {
                return res.status(500).json({message: err.message})
            }
        },

    //Get queries

        getqueries: async (req,res)=>{
            try{
                const queries= await Contacts.find().exec();
                res.status(200).json(queries)
            }
            catch (err) {
                res.status(500).json({message: err.message})
            }
        },

    //User filters

        searchFilters: async (req, res)=>{

                const {userRating,price,genere,jobTitle}=req.body

                if(userRating!==undefined){
                    console.log("Here is your rating",userRating)
                    await handleRating(userRating)
                }

                if(price!==undefined){
                    console.log("Here is your price",price)
                    await handlePrice(price)
                    }

                if(genere!==undefined){
                    console.log("Here is your genre",genere)
                    await handleGenres(genere)
                }
                console.log("Here is User Jobs",UsersJobs)
                res.status(200).send(UsersJobs[0])
                UsersJobs=[];
                },



    //User search

        userSearch: async(req, res, next) => {
            try{
                console.log("Here is your request:",req)
                let users = await Users.find(
                    {
                        "$or":[
                            {"name":{$regex:req.params.key,$options:"i"}},
                            {"services":{$regex:req.params.key,$options:"i"}},
                            {"genres":{$regex:req.params.key,$options:"i"}},
                            {"tag":{$regex:req.params.key,$options:"i"}},
                        ]
                    }
                )
                res.status(200).json(users);
            }
            catch(err) {
                return res.status(500).json({message:err.message})
            }
        },

    //Update user Review Schema

        updateUserReview: async(req,res)=>{
            try{
                // const userId=mongoose.mongo.ObjectId(req.params.id);
                // console.log("Here is usr id",userId)
                const {review}=req.body
                const userUpdate= await Users.findByIdAndUpdate({_id:req.params.id},{$push:{review:review}}).exec();
                const userDetail=await Users.findById({_id:req.params.id}).exec()
                var userRatingSum=0
                userDetail.review.forEach(x => {
                    userRatingSum += x.rating;
                });
                    let updatedRating=(parseInt(userRatingSum)/userDetail.review.length).toFixed(1)
                const updateUser=await Users.findOneAndUpdate({_id:req.params.id},{Rating:updatedRating}).exec()
                console.log("Here is Updated User",updatedRating)
                res.status(200).send({updateUser})
            }
            catch(err){
                res.status(500).send({message:err.message});
            }
        },

    //Shareable User Profile Link

        shareProfile:(req,res)=>{
            try{
                const {userId}=req.body
                const url=`https://udukku.com/user/service-provider/${userId}`
                let stringdata = JSON.stringify(url)
                 QRCode.toDataURL(stringdata, async(err, code)=>{
                     try{
                        if(err) return console.log("error occurred")
                        console.log(code)
                    const UpdateUser=await Users.findOneAndUpdate({_id:userId},{profileUrl:code}).exec()
                    const newUser=await Users.findById({_id:userId}).exec()
                        res.status(200).send(newUser)
                     }
                     catch(err){
                         res.status(500).send({message:err.message})
                     }
                })

            }
            catch(err){
                res.status(500).send({message:err.message})
            }
        }

    }

    //Function to validate email address

        const validateEmail = (email) => {
            return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
        };

    //Activation Token

        const createActivationToken=(payload)=>{
            return jwt.sign(payload,process.env.ACTIVATION_TOKEN_SECRET,{expiresIn:'5m'})
        }

    //Access Token

        const createAccessToken=(payload)=>{
            return jwt.sign(payload,process.env.ACTIVATION_TOKEN_SECRET,{expiresIn:'15m'})
        }

    //Refresh Token
        const createRefreshToken=(payload)=>{
            return jwt.sign(payload,process.env.ACTIVATION_TOKEN_SECRET,{expiresIn:'7d'})
        }


module.exports=userController
