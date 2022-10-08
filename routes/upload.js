const router = require('express').Router()
const uploadImage = require('../middlewares/uploadImage')
const uploadAttachment = require('../middlewares/uploadAttachment')

const uploadCtrl = require('../controllers/uploadController')
const auth = require('../middlewares/auth')

router.post('/upload_avatar', uploadImage, auth, uploadCtrl.uploadAvatar)

router.post('/upload_attachment',uploadCtrl.uploadFile)

router.post('/delete-attachment',uploadCtrl.deleteFile)

module.exports = router