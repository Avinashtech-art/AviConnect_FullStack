import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchMessages } from '../../store/slices/chatSlice';
import MessageBubble from './MessageBubble';
import { Loader2, MessageCircle, Hash } from 'lucide-react';

const ChatArea: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { activeChat, messages, isLoading } = useSelector((state: RootState) => state.chat);
  const { theme } = useSelector((state: RootState) => state.settings);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeChat) {
      dispatch(fetchMessages(activeChat.id));
    }
  }, [activeChat, dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!activeChat) {
    return (
      <div 
        className="flex-1 flex flex-col items-center justify-center text-center"
        style={{ backgroundColor: theme.colors.background }}
      >
        <div className="mb-8">
          <div 
            className="w-32 h-32 mx-auto mb-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: theme.colors.surface }}
          >
            <MessageCircle className="w-16 h-16" style={{ color: theme.colors.muted }} />
          </div>
          <h3 className="text-2xl font-bold mb-4" style={{ color: theme.colors.text }}>Start a conversation with David Brown</h3>
          <p className="max-w-md leading-relaxed" style={{ color: theme.colors.muted }}>
            Send a message to begin your conversation. You can share text, images, and files.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading && messages.length === 0) {
    return (
      <div 
        className="flex-1 flex items-center justify-center"
        style={{ backgroundColor: theme.colors.background }}
      >
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: theme.colors.primary }} />
          <p style={{ color: theme.colors.muted }}>Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="flex-1 overflow-hidden flex flex-col"
      style={{ backgroundColor: theme.colors.background }}
    >
      {/* Welcome Message */}
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center flex-1 text-center p-8">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: theme.colors.primary }}
          >
            <img
              src={activeChat.participants[0]?.avatar}
              alt={activeChat.participants[0]?.name}
              className="w-16 h-16 rounded-full object-cover"
            />
          </div>
          <h3 className="text-2xl font-bold mb-2" style={{ color: theme.colors.text }}>
            Start a conversation with {activeChat.participants[0]?.name}
          </h3>
          <p className="max-w-md" style={{ color: theme.colors.muted }}>
            Send a message to begin your conversation. You can share text, images, and files.
          </p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatArea;