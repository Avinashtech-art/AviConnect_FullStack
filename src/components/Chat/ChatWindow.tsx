import React from 'react';
import ChatHeader from './ChatHeader';
import ChatArea from './ChatArea';
import MessageInput from './MessageInput';

interface ChatWindowProps {
  onBack?: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ onBack }) => {
  return (
    <div className="flex-1 flex flex-col h-full">
      <ChatHeader onBack={onBack} />
      <ChatArea />
      <MessageInput />
    </div>
  );
};

export default ChatWindow;