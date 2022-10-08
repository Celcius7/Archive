const router = require('express').Router()

const paymentGateway = require('../controllers/paymentController')
const auth = require('../middlewares/auth')

router.post('/create-order', paymentGateway.createOrder)

router.post('/save-order', paymentGateway.saveOrder)

router.post('/get-order-by-chatroom',paymentGateway.getOrderByChatroomId)

module.exports = router