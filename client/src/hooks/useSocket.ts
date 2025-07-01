import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io, Socket } from 'socket.io-client';
import { RootState } from '../store';
import { addMessage, setTyping, updateMessageStatus } from '../store/slices/chatSlice';
import { Message } from '../types';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const useSocket = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { activeChat } = useSelector((state: RootState) => state.chat);
  const socketRef = useRef<Socket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  // Initialize socket connection
  useEffect(() => {
    if (user) {
      const token = localStorage.getItem('token');
      
      const connectSocket = () => {
        console.log('🔌 Connecting to socket server...');
        
        socketRef.current = io(SOCKET_URL, {
          auth: { token },
          transports: ['websocket', 'polling'],
          forceNew: true,
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });

        const socket = socketRef.current;

        // Connection events
        socket.on('connect', () => {
          console.log('✅ Connected to server with ID:', socket.id);
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
          }
        });

        socket.on('disconnect', (reason) => {
          console.log('❌ Disconnected from server:', reason);
          if (reason === 'io server disconnect') {
            // Server disconnected, try to reconnect
            reconnectTimeoutRef.current = setTimeout(() => {
              console.log('🔄 Attempting to reconnect...');
              socket.connect();
            }, 2000);
          }
        });

        socket.on('connect_error', (error) => {
          console.error('❌ Connection error:', error);
        });

        socket.on('reconnect', (attemptNumber) => {
          console.log('🔄 Reconnected after', attemptNumber, 'attempts');
        });

        socket.on('reconnect_error', (error) => {
          console.error('❌ Reconnection error:', error);
        });

        // Message events
        socket.on('new-message', (message: Message & { chat: string }) => {
          console.log('📨 Received new message:', message);
          dispatch(addMessage(message));
        });

        socket.on('user-typing', ({ userId, chatId, isTyping }) => {
          console.log('⌨️ User typing:', { userId, chatId, isTyping });
          dispatch(setTyping({ chatId, userId, isTyping }));
        });

        socket.on('messages-read', ({ chatId, readBy }) => {
          console.log('👁️ Messages read:', { chatId, readBy });
          dispatch(updateMessageStatus({ chatId, readBy }));
        });

        socket.on('user-offline', ({ userId, lastSeen }) => {
          console.log(`👋 User ${userId} went offline at ${lastSeen}`);
        });

        socket.on('error', (error) => {
          console.error('❌ Socket error:', error);
        });
      };

      connectSocket();

      return () => {
        console.log('🧹 Cleaning up socket connection');
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
    }
  }, [user, dispatch]);

  // Join chat room
  const joinChat = useCallback((chatId: string) => {
    if (socketRef.current && socketRef.current.connected) {
      console.log('🚪 Joining chat:', chatId);
      socketRef.current.emit('join-chat', chatId);
    } else {
      console.warn('⚠️ Cannot join chat - socket not connected');
    }
  }, []);

  // Leave chat room
  const leaveChat = useCallback((chatId: string) => {
    if (socketRef.current && socketRef.current.connected) {
      console.log('🚪 Leaving chat:', chatId);
      socketRef.current.emit('leave-chat', chatId);
    }
  }, []);

  // Send message
  const sendMessage = useCallback((messageData: {
    chatId: string;
    content: string;
    messageType?: string;
    replyTo?: string;
  }) => {
    if (socketRef.current && socketRef.current.connected) {
      console.log('📤 Sending message via socket:', messageData);
      socketRef.current.emit('send-message', messageData);
      return true;
    } else {
      console.warn('⚠️ Socket not connected, cannot send message');
      return false;
    }
  }, []);

  // Emit typing indicator
  const emitTyping = useCallback((chatId: string, isTyping: boolean) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('typing', { chatId, isTyping });
    }
  }, []);

  // Mark messages as read
  const markMessagesAsRead = useCallback((chatId: string) => {
    if (socketRef.current && socketRef.current.connected) {
      console.log('👁️ Marking messages as read:', chatId);
      socketRef.current.emit('mark-messages-read', { chatId });
    }
  }, []);

  // Join active chat when it changes
  useEffect(() => {
    if (activeChat && socketRef.current && socketRef.current.connected) {
      joinChat(activeChat.id);
      markMessagesAsRead(activeChat.id);
    }
  }, [activeChat, joinChat, markMessagesAsRead]);

  return {
    socket: socketRef.current,
    isConnected: socketRef.current?.connected || false,
    joinChat,
    leaveChat,
    sendMessage,
    emitTyping,
    markMessagesAsRead,
  };
};