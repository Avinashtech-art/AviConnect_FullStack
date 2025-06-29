import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { sendMessage } from '../../store/slices/chatSlice';
import { useSocket } from '../../hooks/useSocket';
import { Send, Paperclip, Mic, Smile, Plus, Gift } from 'lucide-react';
import { MessageFormData } from '../../types';
import { generateAISuggestions } from '../../utils/aiSuggestions';
import EmojiPicker from './EmojiPicker';

const MessageInput: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { register, handleSubmit, reset, watch, setValue } = useForm<MessageFormData>();
  const { activeChat, messages } = useSelector((state: RootState) => state.chat);
  const { user } = useSelector((state: RootState) => state.auth);
  const { theme } = useSelector((state: RootState) => state.settings);
  const { sendMessage: socketSendMessage, emitTyping, isConnected } = useSocket();
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const messageContent = watch('content', '');

  // Update input value when form content changes
  useEffect(() => {
    setInputValue(messageContent || '');
  }, [messageContent]);

  useEffect(() => {
    // Generate AI suggestions based on last received message
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.senderId !== user?.id) {
      const suggestions = generateAISuggestions(lastMessage.content);
      setAiSuggestions(suggestions);
      setShowSuggestions(true);
    }
  }, [messages, user?.id]);

  useEffect(() => {
    // Handle typing indicator
    if (inputValue && activeChat && isConnected) {
      emitTyping(activeChat.id, true);
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      typingTimeoutRef.current = setTimeout(() => {
        emitTyping(activeChat.id, false);
      }, 1000);
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [inputValue, activeChat, emitTyping, isConnected]);

  const sendMessageHandler = async (content: string, messageType: string = 'text') => {
    if (!content.trim() || !activeChat || !user || isSending) return;

    setIsSending(true);
    
    try {
      console.log('📤 Sending message:', { content, messageType, chatId: activeChat.id });

      // Send via Socket for real-time delivery (primary method)
      if (isConnected) {
        const success = socketSendMessage({
          chatId: activeChat.id,
          content: content.trim(),
          messageType
        });
        
        if (success) {
          console.log('✅ Message sent via socket');
        } else {
          throw new Error('Socket send failed');
        }
      } else {
        console.warn('⚠️ Socket not connected, falling back to HTTP API');
        // Fallback to HTTP API if socket is not connected
        await dispatch(sendMessage({
          chatId: activeChat.id,
          content: content.trim(),
          messageType
        })).unwrap();
        console.log('✅ Message sent via HTTP API');
      }

      // Reset form and focus input
      reset();
      setInputValue('');
      setValue('content', '');
      setShowSuggestions(false);
      inputRef.current?.focus();
    } catch (error) {
      console.error('❌ Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const onSubmit = async (data: MessageFormData) => {
    await sendMessageHandler(data.content, 'text');
  };

  const handleSuggestionClick = async (suggestion: string) => {
    await sendMessageHandler(suggestion, 'ai-suggestion');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim()) {
        handleSubmit(onSubmit)();
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setValue('content', value);
  };

  const handleEmojiSelect = (emoji: string) => {
    const newValue = inputValue + emoji;
    setInputValue(newValue);
    setValue('content', newValue);
    inputRef.current?.focus();
  };

  if (!activeChat) return null;

  return (
    <div 
      className="p-4 relative"
      style={{ backgroundColor: theme.colors.surface }}
    >
      {/* AI Suggestions */}
      {showSuggestions && aiSuggestions.length > 0 && (
        <div className="mb-3 animate-slide-up">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xs font-medium" style={{ color: theme.colors.primary }}>💡 AI Suggestions:</span>
            <button
              onClick={() => setShowSuggestions(false)}
              className="text-xs transition-colors"
              style={{ color: theme.colors.muted }}
            >
              Hide
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {aiSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                disabled={isSending}
                className="px-3 py-1 rounded-full text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  backgroundColor: theme.colors.primary,
                  color: 'white'
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="flex items-center space-x-3">
        <button 
          className="p-2 transition-colors"
          style={{ color: theme.colors.muted }}
        >
          <Plus className="w-5 h-5" />
        </button>

        <div className="flex-1 relative">
          <div 
            className="flex items-center rounded-lg px-4 py-3"
            style={{ backgroundColor: theme.colors.background }}
          >
            <input
              {...register('content')}
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Type a message..."
              className="flex-1 bg-transparent border-none outline-none text-sm"
              style={{ 
                color: theme.colors.text,
                '::placeholder': { color: theme.colors.muted }
              }}
              autoComplete="off"
              onKeyPress={handleKeyPress}
              disabled={isSending}
            />
            
            <div className="flex items-center space-x-2 ml-3">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-1 transition-colors"
                style={{ color: theme.colors.muted }}
                title="Add emoji"
              >
                <Smile className="w-5 h-5" />
              </button>
              
              <button
                type="button"
                className="p-1 transition-colors"
                style={{ color: theme.colors.muted }}
                title="Attach file"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              <button
                type="button"
                className="p-1 transition-colors"
                style={{ color: theme.colors.muted }}
                title="Voice message"
              >
                <Mic className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {showEmojiPicker && (
            <EmojiPicker
              onEmojiSelect={handleEmojiSelect}
              onClose={() => setShowEmojiPicker(false)}
            />
          )}
        </div>

        <button
          type="button"
          onClick={() => handleSubmit(onSubmit)()}
          disabled={!inputValue.trim() || isSending || !isConnected}
          className="p-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ color: theme.colors.muted }}
          title={!isConnected ? "Connecting..." : isSending ? "Sending..." : "Send message"}
        >
          {isSending ? (
            <div 
              className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: theme.colors.muted }}
            />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Click outside to close emoji picker */}
      {showEmojiPicker && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowEmojiPicker(false)}
        />
      )}
    </div>
  );
};

export default MessageInput;