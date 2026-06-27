const express = require("express");
const router = express.Router();

const protect = require("../middleware/middleware");
const {
    startConversation,
    getMessages,
    sendMessage,
    getConversations
} = require("../controllers/messageController");

router.get("/", protect, getConversations);

router.post( "/start", protect, startConversation);

router.get( "/:conversationId", protect, getMessages);

router.post( "/:conversationId", protect, sendMessage);

module.exports = router;