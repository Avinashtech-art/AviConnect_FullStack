import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { chatAPI, userAPI } from '../../services/api';
import { ChatState, Chat, Message, User } from '../../types';

// Async thunks
export const fetchChats = createAsyncThunk(
  'chat/fetchChats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await chatAPI.getChats();
      return response.data.chats;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch chats');
    }
  }
);

export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (chatId: string, { rejectWithValue }) => {
    try {
      const response = await chatAPI.getMessages(chatId);
      return { chatId, messages: response.data.messages };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch messages');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (
    { chatId, content, messageType, replyTo }: {
      chatId: string;
      content: string;
      messageType?: string;
      replyTo?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await chatAPI.sendMessage(chatId, { content, messageType, replyTo });
      return response.data.message;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send message');
    }
  }
);

export const createChat = createAsyncThunk(
  'chat/createChat',
  async (participantId: string, { rejectWithValue }) => {
    try {
      const response = await chatAPI.createChat(participantId);
      return response.data.chat;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create chat');
    }
  }
);

export const createGroupChat = createAsyncThunk(
  'chat/createGroupChat',
  async (
    { name, description, participants }: {
      name: string;
      description?: string;
      participants: string[];
    },
    { rejectWithValue }
  ) => {
    try {
      // Mock API call for group creation
      const groupChat: Chat = {
        id: `group-${Date.now()}`,
        chatType: 'group',
        groupName: name,
        groupDescription: description,
        participants: participants.map(id => ({
          id,
          name: `User ${id.slice(-4)}`,
          email: `user${id.slice(-4)}@example.com`,
          avatar: `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2`,
          isOnline: Math.random() > 0.5,
          bio: 'Group member'
        })),
        unreadCount: 0,
        isTyping: false,
        lastActivity: new Date(),
      };
      
      console.log('Creating group chat:', groupChat);
      return groupChat;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create group chat');
    }
  }
);

export const searchUsers = createAsyncThunk(
  'chat/searchUsers',
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await userAPI.searchUsers(query);
      return response.data.users;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search users');
    }
  }
);

const initialState: ChatState = {
  chats: [],
  activeChat: null,
  messages: [],
  searchResults: [],
  isLoading: false,
  error: null,
  typingUsers: {},
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveChat: (state, action: PayloadAction<Chat>) => {
      state.activeChat = action.payload;
      // Reset unread count for active chat
      const chatIndex = state.chats.findIndex(chat => chat.id === action.payload.id);
      if (chatIndex !== -1) {
        state.chats[chatIndex].unreadCount = 0;
      }
    },
    
    addMessage: (state, action: PayloadAction<Message & { chat?: string }>) => {
      const message = action.payload;
      console.log('Adding message to state:', message);
      
      // Add to messages if it's for the active chat
      if (state.activeChat && (message.chat === state.activeChat.id || 
          state.messages.some(m => m.senderId === message.senderId || m.receiverId === message.senderId))) {
        // Check if message already exists to avoid duplicates
        const existingMessage = state.messages.find(m => m.id === message.id);
        if (!existingMessage) {
          state.messages.push(message);
          console.log('Message added to active chat messages');
        } else {
          console.log('Message already exists, skipping duplicate');
        }
      }
      
      // Update chat list
      const chatIndex = state.chats.findIndex(chat => 
        chat.id === message.chat ||
        chat.participants.some(p => p.id === message.senderId) ||
        chat.participants.some(p => p.id === message.receiverId)
      );
      
      if (chatIndex !== -1) {
        state.chats[chatIndex].lastMessage = message;
        state.chats[chatIndex].lastActivity = message.timestamp;
        
        // Increment unread count if not from current user and not active chat
        if (!state.activeChat || state.activeChat.id !== state.chats[chatIndex].id) {
          state.chats[chatIndex].unreadCount += 1;
        }
        
        // Move chat to top
        const chat = state.chats.splice(chatIndex, 1)[0];
        state.chats.unshift(chat);
        console.log('Chat list updated with new message');
      }
    },
    
    setTyping: (state, action: PayloadAction<{ chatId: string; userId: string; isTyping: boolean }>) => {
      const { chatId, userId, isTyping } = action.payload;
      
      if (isTyping) {
        state.typingUsers[chatId] = userId;
      } else {
        delete state.typingUsers[chatId];
      }
      
      // Update chat typing status
      const chatIndex = state.chats.findIndex(chat => chat.id === chatId);
      if (chatIndex !== -1) {
        state.chats[chatIndex].isTyping = isTyping;
        state.chats[chatIndex].typingUser = isTyping ? userId : undefined;
      }
    },
    
    updateMessageStatus: (state, action: PayloadAction<{ chatId: string; readBy: string }>) => {
      const { chatId, readBy } = action.payload;
      
      // Update messages read status
      state.messages.forEach(message => {
        if (message.chat === chatId && message.senderId !== readBy) {
          message.isRead = true;
        }
      });
    },
    
    clearMessages: (state) => {
      state.messages = [];
    },
    
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    
    clearError: (state) => {
      state.error = null;
    },

    // Add optimistic message for better UX
    addOptimisticMessage: (state, action: PayloadAction<Message>) => {
      const message = action.payload;
      if (state.activeChat && message.chat === state.activeChat.id) {
        // Add temporary message with pending status
        const optimisticMessage = {
          ...message,
          id: `temp-${Date.now()}`, // Temporary ID
          isPending: true
        };
        state.messages.push(optimisticMessage);
      }
    },

    // Remove optimistic message when real message arrives
    removeOptimisticMessage: (state, action: PayloadAction<string>) => {
      const tempId = action.payload;
      state.messages = state.messages.filter(m => m.id !== tempId);
    },
  },
  
  extraReducers: (builder) => {
    // Fetch chats
    builder
      .addCase(fetchChats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.chats = action.payload;
        state.error = null;
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch messages
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages = action.payload.messages;
        state.error = null;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Send message
    builder
      .addCase(sendMessage.pending, (state) => {
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        // Message will be added via socket event for real-time sync
        // But we can also add it here for immediate feedback
        const message = action.payload;
        if (state.activeChat && message.chat === state.activeChat.id) {
          const existingMessage = state.messages.find(m => m.id === message.id);
          if (!existingMessage) {
            state.messages.push(message);
          }
        }
        state.error = null;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Create chat
    builder
      .addCase(createChat.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createChat.fulfilled, (state, action) => {
        state.isLoading = false;
        const existingChat = state.chats.find(chat => chat.id === action.payload.id);
        if (!existingChat) {
          state.chats.unshift(action.payload);
        }
        state.activeChat = action.payload;
        state.error = null;
      })
      .addCase(createChat.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create group chat
    builder
      .addCase(createGroupChat.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createGroupChat.fulfilled, (state, action) => {
        state.isLoading = false;
        const existingChat = state.chats.find(chat => chat.id === action.payload.id);
        if (!existingChat) {
          state.chats.unshift(action.payload);
        }
        state.activeChat = action.payload;
        state.error = null;
      })
      .addCase(createGroupChat.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Search users
    builder
      .addCase(searchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload;
        state.error = null;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setActiveChat,
  addMessage,
  setTyping,
  updateMessageStatus,
  clearMessages,
  clearSearchResults,
  clearError,
  addOptimisticMessage,
  removeOptimisticMessage,
} = chatSlice.actions;

export default chatSlice.reducer;