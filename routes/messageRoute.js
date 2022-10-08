const router = require("express").Router();
const {catchErrors}=require("../handlers/errorHandlers")
const chatroomController = require("../controllers/chatroomController");
const messageController = require("../controllers/messageController");

const auth = require("../middlewares/auth");

router.get("/", catchErrors(chatroomController.getAllChatrooms));
router.get("/all-chatRoomByName/:Id", catchErrors(chatroomController.getAllChatroomByName));
router.post("/", catchErrors(chatroomController.createChatroom));
router.get("/get/:_id",messageController.getMessages);
router.get("/get-chatroom-by-id/:id",chatroomController.getChatroomById);
router.patch('/update-chatroom-by-id',chatroomController.updateChatroomById);
router.post("/save-attachment",chatroomController.createAttachment);
router.post("/get-attachments-by-id",chatroomController.getChatroomAttachments);
router.post("/get-payment-by-chatroom",chatroomController.getPaymentByChatroom);
module.exports = router;
