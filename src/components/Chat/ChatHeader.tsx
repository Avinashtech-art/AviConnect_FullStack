import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Phone, Video, MoreVertical, ArrowLeft, Search, UserPlus, Hash } from 'lucide-react';
import { formatLastSeen } from '../../utils/dateUtils';

interface ChatHeaderProps {
  onBack?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onBack }) => {
  const { activeChat } = useSelector((state: RootState) => state.chat);
  const { theme } = useSelector((state: RootState) => state.settings);

  if (!activeChat) return null;

  const otherUser = activeChat.participants[0];

  return (
    <div 
      className="border-b px-4 py-3 flex items-center justify-between"
      style={{ 
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border
      }}
    >
      <div className="flex items-center space-x-3">
        {onBack && (
          <button
            onClick={onBack}
            className="p-2 rounded transition-colors md:hidden"
            style={{ 
              color: theme.colors.muted,
              backgroundColor: 'transparent'
            }}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        
        <div className="flex items-center space-x-3">
          <Hash className="w-6 h-6" style={{ color: theme.colors.muted }} />
          <div>
            <h3 className="font-semibold text-base" style={{ color: theme.colors.text }}>{otherUser.name}</h3>
            <p className="text-xs" style={{ color: theme.colors.muted }}>
              {activeChat.isTyping ? (
                <span style={{ color: theme.colors.primary }}>typing...</span>
              ) : otherUser.isOnline ? (
                'Online'
              ) : (
                otherUser.lastSeen && formatLastSeen(otherUser.lastSeen)
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button 
          className="p-2 rounded transition-colors"
          style={{ 
            color: theme.colors.muted,
            backgroundColor: 'transparent'
          }}
        >
          <Phone className="w-5 h-5" />
        </button>
        <button 
          className="p-2 rounded transition-colors"
          style={{ 
            color: theme.colors.muted,
            backgroundColor: 'transparent'
          }}
        >
          <Video className="w-5 h-5" />
        </button>
        <button 
          className="p-2 rounded transition-colors"
          style={{ 
            color: theme.colors.muted,
            backgroundColor: 'transparent'
          }}
        >
          <UserPlus className="w-5 h-5" />
        </button>
        <button 
          className="p-2 rounded transition-colors"
          style={{ 
            color: theme.colors.muted,
            backgroundColor: 'transparent'
          }}
        >
          <Search className="w-5 h-5" />
        </button>
        <button 
          className="p-2 rounded transition-colors"
          style={{ 
            color: theme.colors.muted,
            backgroundColor: 'transparent'
          }}
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;