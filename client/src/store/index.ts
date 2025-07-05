import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import chatReducer from './slices/chatSlice';
import statusReducer from './slices/statusSlice';
import callReducer from './slices/callSlice';
import settingsReducer from './slices/settingsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    status: statusReducer,
    call: callReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'chat/addMessage', 
          'chat/fetchMessages/fulfilled',
          'chat/sendMessage/fulfilled',
          'auth/loginUser/fulfilled',
          'auth/registerUser/fulfilled',
          'auth/getCurrentUser/fulfilled',
          'status/createStatus/fulfilled',
          'status/viewStatus/fulfilled',
          'call/makeCall/fulfilled',
        ],
        ignoredPaths: [
          'chat.messages.timestamp', 
          'chat.chats.lastMessage.timestamp',
          'chat.chats.lastActivity',
          'auth.user.lastSeen',
          'status.statuses.timestamp',
          'status.statuses.expiresAt',
          'status.statuses.viewers.viewedAt',
          'call.calls.timestamp',
        ],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;