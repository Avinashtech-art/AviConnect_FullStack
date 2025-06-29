import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import Sidebar from './Sidebar';
import ChatWindow from '../Chat/ChatWindow';

const ChatLayout: React.FC = () => {
  const { activeChat } = useSelector((state: RootState) => state.chat);
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <div className="h-screen bg-[#36393f] flex overflow-hidden">
      {/* Mobile: Show sidebar or chat based on selection */}
      <div className="md:hidden w-full flex">
        {!activeChat || showSidebar ? (
          <Sidebar />
        ) : (
          <ChatWindow onBack={() => setShowSidebar(true)} />
        )}
      </div>

      {/* Desktop: Show both sidebar and chat */}
      <div className="hidden md:flex w-full">
        <Sidebar />
        <ChatWindow />
      </div>
    </div>
  );
};

export default ChatLayout;