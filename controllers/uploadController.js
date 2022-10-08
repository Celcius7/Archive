//dependencies
const cloudinary = require('cloudinary')
const fs = require('fs')

    //Cloudinary Api

    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUD_API_KEY,
        api_secret: process.env.CLOUD_API_SECRET
    })


//Upload Controllers

    const uploadCtrl = {
        
    //Upload Avatar image
    
    uploadAvatar: (req, res) => {
        try {
            const file = req.files.file;
            
            cloudinary.v2.uploader.upload(file.tempFilePath, {
                folder: 'avatar', width: 450, height: 450, crop: "fill"
            }, async(err, result) => {
                if(err) throw err;

                removeTmp(file.tempFilePath)

                res.json(result)
            })
        
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
        },
        
    //Upload File and Attachemnts
    
    uploadFile: (req, res) => {
        try {
            const file = req.files.file;
            
            cloudinary.v2.uploader.upload(file.tempFilePath, {
                resource_type: "auto",
                folder: 'songs',
            }, async(err, result) => {
                if(err) throw err.message;

                removeTmp(file.tempFilePath)

                res.json(result)
            })
        
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
        },

    deleteFile:async(req,res)=>{
        try{
            const {public_id,resource_type}=req.body
            await cloudinary.v2.uploader.destroy(public_id,
                {resource_type:resource_type},
                async(err,result)=>{
                    if(err) throw err.message;
                    res.json(result)
                }    
            );
        }
        catch(err){
            res.status(500).send({message:err.message})
        }
    }
}

    //Remove Temporary File

    const removeTmp = (path) => {
    fs.unlink(path, err => {
        if(err) throw err
    })
    }

module.exports = uploadCtrl