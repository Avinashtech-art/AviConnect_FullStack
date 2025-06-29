import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Message } from '../../types';
import { formatMessageTime } from '../../utils/dateUtils';
import { Check, CheckCheck, Bot, MoreVertical, Reply, Heart, ThumbsUp, Laugh, Angry } from 'lucide-react';
import clsx from 'clsx';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [showReactions, setShowReactions] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const isOwn = message.senderId === user?.id;
  const isAI = message.type === 'ai-suggestion';

  const reactionEmojis = ['❤️', '👍', '😂', '😮', '😢', '😡'];

  const handleReaction = (emoji: string) => {
    console.log('Add reaction:', emoji, 'to message:', message.id);
    setShowReactions(false);
  };

  const handleReply = () => {
    console.log('Reply to message:', message.id);
    setShowMenu(false);
  };

  const handleDelete = () => {
    console.log('Delete message:', message.id);
    setShowMenu(false);
  };

  return (
    <div className={clsx(
      'flex group hover:bg-[#32353b] px-4 py-1 transition-colors',
      isOwn ? 'justify-end' : 'justify-start'
    )}>
      <div className="flex items-start space-x-3 max-w-[70%]">
        {!isOwn && (
          <img
            src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2"
            alt="User"
            className="w-8 h-8 rounded-full object-cover mt-1"
          />
        )}
        
        <div className="flex-1">
          {!isOwn && (
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-medium text-white text-sm">Contact Name</span>
              <span className="text-xs text-[#72767d]">
                {formatMessageTime(message.timestamp)}
              </span>
            </div>
          )}
          
          <div className={clsx(
            'relative group/message',
            isAI && 'bg-[#7289da]/10 border border-[#7289da]/20 rounded p-2'
          )}>
            {isAI && (
              <div className="flex items-center space-x-1 mb-1">
                <Bot className="w-3 h-3 text-[#7289da]" />
                <span className="text-xs text-[#7289da] font-medium">AI Suggestion</span>
              </div>
            )}
            
            <p className="text-[#dcddde] text-sm leading-relaxed break-words">
              {message.content}
            </p>
            
            {isOwn && (
              <span className="text-xs text-[#72767d] mt-1 block">
                {formatMessageTime(message.timestamp)}
              </span>
            )}
            
            {/* Message Reactions */}
            {message.reactions && message.reactions.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {message.reactions.map((reaction, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 bg-[#40444b] rounded-full text-xs"
                  >
                    {reaction.emoji}
                    <span className="ml-1 text-[#b9bbbe]">1</span>
                  </span>
                ))}
              </div>
            )}

            {/* Hover Actions */}
            <div className="absolute top-0 right-0 opacity-0 group-hover/message:opacity-100 transition-opacity bg-[#2f3136] border border-[#40444b] rounded shadow-lg p-1 flex space-x-1 -mt-8">
              <button
                onClick={() => setShowReactions(!showReactions)}
                className="p-1 hover:bg-[#40444b] rounded transition-colors"
                title="Add reaction"
              >
                <Heart className="w-4 h-4 text-[#b9bbbe]" />
              </button>
              <button
                onClick={handleReply}
                className="p-1 hover:bg-[#40444b] rounded transition-colors"
                title="Reply"
              >
                <Reply className="w-4 h-4 text-[#b9bbbe]" />
              </button>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 hover:bg-[#40444b] rounded transition-colors"
                title="More options"
              >
                <MoreVertical className="w-4 h-4 text-[#b9bbbe]" />
              </button>
            </div>

            {/* Reaction Picker */}
            {showReactions && (
              <div className="absolute bottom-full mb-2 bg-[#2f3136] border border-[#40444b] rounded-lg shadow-lg z-10 px-2 py-1 flex space-x-1">
                {reactionEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleReaction(emoji)}
                    className="w-8 h-8 flex items-center justify-center text-lg hover:bg-[#40444b] rounded transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;