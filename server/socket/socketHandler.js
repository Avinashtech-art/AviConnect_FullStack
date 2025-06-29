import Message from '../models/Message.js';
import Chat from '../models/Chat.js';
import User from '../models/User.js';

const connectedUsers = new Map();

export const handleSocketConnection = (socket, io) => {
  const userId = socket.userId;
  
  // Store user connection
  connectedUsers.set(userId, socket.id);
  
  // Update user online status
  User.findByIdAndUpdate(userId, { 
    isOnline: true, 
    socketId: socket.id 
  }).exec();

  // Join user to their personal room
  socket.join(userId);

  // Handle joining chat rooms
  socket.on('join-chat', async (chatId) => {
    try {
      // Verify user is participant in this chat
      const chat = await Chat.findOne({
        _id: chatId,
        participants: userId
      });

      if (chat) {
        socket.join(chatId);
        console.log(`User ${userId} joined chat ${chatId}`);
      }
    } catch (error) {
      console.error('Join chat error:', error);
    }
  });

  // Handle leaving chat rooms
  socket.on('leave-chat', (chatId) => {
    socket.leave(chatId);
    console.log(`User ${userId} left chat ${chatId}`);
  });

  // Handle sending messages
  socket.on('send-message', async (data) => {
    try {
      const { chatId, content, messageType = 'text', replyTo } = data;

      // Verify user is participant in this chat
      const chat = await Chat.findOne({
        _id: chatId,
        participants: userId
      }).populate('participants', 'name email avatar isOnline lastSeen');

      if (!chat) {
        socket.emit('error', { message: 'Chat not found or access denied' });
        return;
      }

      // Create message
      const message = new Message({
        chat: chatId,
        sender: userId,
        content,
        messageType,
        replyTo: replyTo || null
      });

      await message.save();
      await message.populate('sender', 'name avatar');

      // Update chat's last message and activity
      chat.lastMessage = message._id;
      await chat.updateLastActivity();

      // Format message for broadcast
      const formattedMessage = {
        id: message._id,
        senderId: message.sender._id,
        receiverId: chat.participants.find(p => p._id.toString() !== userId)._id,
        content: message.content,
        timestamp: message.createdAt,
        isRead: false,
        type: message.messageType,
        replyTo: message.replyTo,
        chat: chatId
      };

      // Broadcast to all participants in the chat
      io.to(chatId).emit('new-message', formattedMessage);

      // Send push notification to offline users
      const offlineParticipants = chat.participants.filter(
        p => p._id.toString() !== userId && !p.isOnline
      );

      // Here you would implement push notifications for offline users
      // For now, we'll just log it
      if (offlineParticipants.length > 0) {
        console.log(`Send push notification to offline users:`, offlineParticipants.map(p => p.name));
      }

    } catch (error) {
      console.error('Send message error:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Handle typing indicators
  socket.on('typing', async (data) => {
    try {
      const { chatId, isTyping } = data;

      // Verify user is participant in this chat
      const chat = await Chat.findOne({
        _id: chatId,
        participants: userId
      });

      if (chat) {
        // Broadcast typing status to other participants
        socket.to(chatId).emit('user-typing', {
          userId,
          chatId,
          isTyping
        });
      }
    } catch (error) {
      console.error('Typing indicator error:', error);
    }
  });

  // Handle message read receipts
  socket.on('mark-messages-read', async (data) => {
    try {
      const { chatId } = data;

      // Mark all unread messages in this chat as read by this user
      await Message.updateMany(
        {
          chat: chatId,
          sender: { $ne: userId },
          'isRead.user': { $ne: userId }
        },
        {
          $push: { isRead: { user: userId, readAt: new Date() } }
        }
      );

      // Notify other participants that messages have been read
      socket.to(chatId).emit('messages-read', {
        chatId,
        readBy: userId
      });

    } catch (error) {
      console.error('Mark messages read error:', error);
    }
  });

  // Handle user disconnect
  socket.on('disconnect', async () => {
    try {
      console.log(`User ${userId} disconnected`);
      
      // Remove from connected users
      connectedUsers.delete(userId);
      
      // Update user offline status
      await User.findByIdAndUpdate(userId, {
        isOnline: false,
        lastSeen: new Date(),
        socketId: null
      });

      // Broadcast user offline status to relevant chats
      const userChats = await Chat.find({
        participants: userId
      }).populate('participants', '_id');

      userChats.forEach(chat => {
        socket.to(chat._id.toString()).emit('user-offline', {
          userId,
          lastSeen: new Date()
        });
      });

    } catch (error) {
      console.error('Disconnect error:', error);
    }
  });

  // Handle connection errors
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
};

export const getConnectedUsers = () => {
  return Array.from(connectedUsers.keys());
};

export const isUserOnline = (userId) => {
  return connectedUsers.has(userId);
};