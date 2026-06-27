// server/controller/messageController.js

const Message = require("../models/messageModel");
const Conversation = require("../models/conversationModel");

exports.getMessages = async (req, res) => {

    const conversation =
    await Conversation.findById(req.params.conversationId)
    .populate("participants", "fullname phone");

    if (!conversation) {
        return res.status(404).json({
            success: false,
            message: "Conversation not found"
        });
    }

    const allowed = conversation.participants.some(
        p => String(p._id) === String(req.user.id)
    );

    if (
        !allowed &&
        req.user.role !== "admin"
    ) {
        return res.status(403).json({
            success: false,
            message: "Unauthorized"
        });
    }

    const messages =
        await Message.find({
            conversation:
                req.params.conversationId
        }).populate(
            "sender",
            "fullname"
        );

    res.json({
        success: true,
        conversation,
        messages
    });
};

exports.startConversation = async (req, res) => {
    const { receiverId } = req.body;

    let conversation =
        await Conversation.findOne({
            participants: {
                $all: [
                    req.user.id,
                    receiverId
                ]
            }
        });

    if (!conversation) {
        conversation =
            await Conversation.create({
                participants: [
                    req.user.id,
                    receiverId
                ]
            });
    }

    res.json({
        success: true,
        conversation
    });
};

exports.getConversations = async (req, res) => {
    try {

        const conversations = await Conversation.find({
            participants: req.user.id
        })
        .populate("participants", "fullname")
        .populate({
            path: "lastMessage",
            select: "text createdAt sender",
            populate: {
                path: "sender",
                select: "fullname"
            }
        })
        .sort({ updatedAt: -1 });

        const formatted = conversations.map(conv => {

            const otherUser = conv.participants.find(
                p => p._id.toString() !== req.user.id
            );

            const lastMsg = conv.lastMessage || null;

            return {
                _id: conv._id,
                name: otherUser?.fullname || "Unknown",
                lastMessage: lastMsg?.text || "No messages yet",
                time: lastMsg?.createdAt || conv.updatedAt,
                unread: lastMsg
                    ? lastMsg.sender._id?.toString() !== req.user.id
                    : false
            };
        });

        res.json({
            success: true,
            conversations: formatted
        });

    } catch (err) {

        console.error("GET CONVERSATIONS ERROR:", err);

        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


exports.sendMessage = async (req, res) => {
    try {

        const message = await Message.create({
            conversation: req.params.conversationId,
            sender: req.user.id,
            text: req.body.text,
            readBy: [req.user.id]
        });

        await Conversation.findByIdAndUpdate(
            req.params.conversationId,
            {
                lastMessage: message._id,
                updatedAt: new Date()
            }
        );

        await message.populate("sender", "fullname");

        res.json({
            success: true,
            message
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};