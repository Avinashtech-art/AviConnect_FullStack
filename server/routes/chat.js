import express from 'express';
import Joi from 'joi';
import Chat from '../models/Chat.js';
import Message from '../models/Message.js';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Validation schemas
const createChatSchema = Joi.object({
  participantId: Joi.string().required()
});

const sendMessageSchema = Joi.object({
  content: Joi.string().min(1).max(1000).required(),
  messageType: Joi.string().valid('text', 'ai-suggestion').default('text'),
  replyTo: Joi.string().optional()
});

// Get all chats for current user
router.get('/', authenticate, async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user._id,
      isActive: true
    })
    .populate('participants', 'name email avatar isOnline lastSeen')
    .populate('lastMessage')
    .sort({ lastActivity: -1 });

    // Format chats for frontend
    const formattedChats = await Promise.all(chats.map(async (chat) => {
      const otherParticipant = chat.participants.find(
        p => p._id.toString() !== req.user._id.toString()
      );

      // Get unread count for this user
      const unreadCount = await Message.countDocuments({
        chat: chat._id,
        sender: { $ne: req.user._id },
        'isRead.user': { $ne: req.user._id }
      });

      return {
        id: chat._id,
        participants: [otherParticipant],
        lastMessage: chat.lastMessage ? {
          id: chat.lastMessage._id,
          senderId: chat.lastMessage.sender,
          content: chat.lastMessage.content,
          timestamp: chat.lastMessage.createdAt,
          isRead: chat.lastMessage.isReadBy(req.user._id),
          type: chat.lastMessage.messageType
        } : null,
        unreadCount,
        isTyping: false,
        lastActivity: chat.lastActivity
      };
    }));

    res.json({ chats: formattedChats });
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({ message: 'Server error fetching chats' });
  }
});

// Create or get existing chat
router.post('/', authenticate, async (req, res) => {
  try {
    const { error } = createChatSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { participantId } = req.body;

    // Check if participant exists
    const participant = await User.findById(participantId);
    if (!participant) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if chat already exists
    let chat = await Chat.findOne({
      chatType: 'private',
      participants: { $all: [req.user._id, participantId] }
    }).populate('participants', 'name email avatar isOnline lastSeen');

    if (!chat) {
      // Create new chat
      chat = new Chat({
        participants: [req.user._id, participantId],
        chatType: 'private'
      });
      await chat.save();
      await chat.populate('participants', 'name email avatar isOnline lastSeen');
    }

    const otherParticipant = chat.participants.find(
      p => p._id.toString() !== req.user._id.toString()
    );

    const formattedChat = {
      id: chat._id,
      participants: [otherParticipant],
      lastMessage: null,
      unreadCount: 0,
      isTyping: false,
      lastActivity: chat.lastActivity
    };

    res.json({ chat: formattedChat });
  } catch (error) {
    console.error('Create chat error:', error);
    res.status(500).json({ message: 'Server error creating chat' });
  }
});

// Get messages for a chat
router.get('/:chatId/messages', authenticate, async (req, res) => {
  try {
    const { chatId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    // Check if user is participant in this chat
    const chat = await Chat.findOne({
      _id: chatId,
      participants: req.user._id
    });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found or access denied' });
    }

    // Get messages
    const messages = await Message.find({
      chat: chatId,
      isDeleted: false
    })
    .populate('sender', 'name avatar')
    .populate('replyTo')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);

    // Format messages for frontend
    const formattedMessages = messages.reverse().map(message => ({
      id: message._id,
      senderId: message.sender._id,
      receiverId: chat.participants.find(p => p.toString() !== message.sender._id.toString()),
      content: message.content,
      timestamp: message.createdAt,
      isRead: message.isReadBy(req.user._id),
      type: message.messageType,
      replyTo: message.replyTo,
      reactions: message.reactions,
      isEdited: message.isEdited
    }));

    // Mark messages as read
    await Message.updateMany(
      {
        chat: chatId,
        sender: { $ne: req.user._id },
        'isRead.user': { $ne: req.user._id }
      },
      {
        $push: { isRead: { user: req.user._id, readAt: new Date() } }
      }
    );

    res.json({ messages: formattedMessages });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error fetching messages' });
  }
});

// Send message
router.post('/:chatId/messages', authenticate, async (req, res) => {
  try {
    const { error } = sendMessageSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { chatId } = req.params;
    const { content, messageType, replyTo } = req.body;

    // Check if user is participant in this chat
    const chat = await Chat.findOne({
      _id: chatId,
      participants: req.user._id
    }).populate('participants', 'name email avatar isOnline lastSeen');

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found or access denied' });
    }

    // Create message
    const message = new Message({
      chat: chatId,
      sender: req.user._id,
      content,
      messageType: messageType || 'text',
      replyTo: replyTo || null
    });

    await message.save();
    await message.populate('sender', 'name avatar');

    // Update chat's last message and activity
    chat.lastMessage = message._id;
    await chat.updateLastActivity();

    // Format message for response
    const formattedMessage = {
      id: message._id,
      senderId: message.sender._id,
      receiverId: chat.participants.find(p => p._id.toString() !== req.user._id.toString())._id,
      content: message.content,
      timestamp: message.createdAt,
      isRead: false,
      type: message.messageType,
      replyTo: message.replyTo
    };

    res.status(201).json({ message: formattedMessage });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error sending message' });
  }
});

// Delete message
router.delete('/:chatId/messages/:messageId', authenticate, async (req, res) => {
  try {
    const { chatId, messageId } = req.params;

    const message = await Message.findOne({
      _id: messageId,
      chat: chatId,
      sender: req.user._id
    });

    if (!message) {
      return res.status(404).json({ message: 'Message not found or access denied' });
    }

    message.isDeleted = true;
    message.deletedAt = new Date();
    await message.save();

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ message: 'Server error deleting message' });
  }
});

export default router;