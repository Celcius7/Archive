const router=require('express').Router()

const AdminController  = require('../controllers/adminController')
const authAdmin=require('../middlewares/auth')

router.get("/get-all-user",authAdmin,AdminController.allUsers)
router.get("/get-all-jobs",authAdmin,AdminController.allJobs)
router.get("/get-all-queries",authAdmin,AdminController.allqueries)
router.get("/get-all-payments",authAdmin,AdminController.allPayments)
router.delete('/delete-user/:id',authAdmin,AdminController.deleteUser)
router.delete('/delete-job/:id',authAdmin,AdminController.deleteJobById)
router.patch('/update-job-status/:id',authAdmin,AdminController.updateJob)
router.patch('/update-payment-intent/:id',authAdmin,AdminController.updatePaymentIntent)
module.exports=router