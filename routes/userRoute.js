
const router=require('express').Router()
const userController=require('../controllers/userController');
const auth=require('../middlewares/auth')
const authAdmin=require('../middlewares/authAdmin')

router.post('/register',userController.register)

router.post('/activation',userController.activateEmail)

router.post('/login',userController.login)

router.post('/check-user-exist',userController.userNameExistence)

router.post('/get-user-by-username',userController.getUserByUserName)

router.get('/get-hero-image-users',userController.getHeroImage)

router.post('/refresh_token',userController.getAccessToken)

router.post('/forgotPassword',userController.forgotPassword)

router.post('/reset',auth,userController.resetPassword)

router.get('/infor',auth,userController.getUserInfor)

router.get('/get-user-by-id/:_id',userController.getUserById)

router.get('/all_infor',authAdmin,userController.getUsersAllInfor)

router.get('/logout',userController.logout)

router.patch('/update-profile',auth,userController.updateUser)

router.patch('/update-user-by-id/:id',userController.updateUsersProfileById)

router.patch('/update-isMusician',auth,userController.updateIsMusician)

router.post('/google_login', userController.googleLogin)

router.post('/facebook_login', userController.facebookLogin)

router.post('/contact-us',userController.contactUs)

router.get('/get-queries',auth,authAdmin,userController.getqueries)

router.post("/service-provider-filter",userController.searchFilters)

router.get("/user-search/:key",userController.userSearch)

router.patch('/update-review/:id',userController.updateUserReview);

router.patch('/genrate-profile-link',userController.shareProfile);

module.exports=router
