const fs = require('fs');

module.exports = async function(req, res, next) {
    try {
        if(!req.files || Object.keys(req.files).length === 0)
            return res.status(400).json({msg: "No files were uploaded."})
            
        const file = req.files.file;

        if(file.size > 2048 * 2048){
            removeTmp(file.tempFilePath)
            return res.status(400).json({message: "Size too large."})
        } // 1mb

        if(file.mimetype !== 'audio/mp3' && file.mimetype !== 'audio/mp4'){
            removeTmp(file.tempFilePath)
            return res.status(400).json({message: "File format is incorrect."})
        }
        next()
    } catch (err) {
        return res.status(500).json({message: err.message})
    }
}

const removeTmp = (path) => {
    fs.unlink(path, err => {
        if(err) throw err
    })
}