import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { setActiveChat, fetchChats, searchUsers, createChat, clearSearchResults } from '../../store/slices/chatSlice';
import { logoutUser } from '../../store/slices/authSlice';
import { 
  MessageCircle, 
  Search, 
  Plus, 
  X, 
  Users, 
  LogOut, 
  Settings, 
  Phone, 
  Camera, 
  UserPlus, 
  Crown, 
  Mic, 
  Headphones, 
  Cog,
  ChevronDown,
  Hash,
  Bell,
  Archive
} from 'lucide-react';
import { formatChatTime } from '../../utils/dateUtils';
import { Chat, User } from '../../types';
import CreateGroup from '../Groups/CreateGroup';
import StatusPage from '../Status/StatusPage';
import CallHistory from '../Calls/CallHistory';
import SettingsPage from '../Settings/SettingsPage';

const Sidebar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { chats, activeChat, searchResults, isLoading } = useSelector((state: RootState) => state.chat);
  const { user } = useSelector((state: RootState) => state.auth);
  const { theme } = useSelector((state: RootState) => state.settings);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [currentView, setCurrentView] = useState<'chats' | 'status' | 'calls' | 'settings'>('chats');
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    dispatch(fetchChats());
  }, [dispatch]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const debounceTimer = setTimeout(() => {
        dispatch(searchUsers(searchQuery.trim()));
      }, 300);
      return () => clearTimeout(debounceTimer);
    } else {
      dispatch(clearSearchResults());
    }
  }, [searchQuery, dispatch]);

  const handleChatSelect = (chat: Chat) => {
    dispatch(setActiveChat(chat));
    setShowNewChat(false);
  };

  const handleUserSelect = async (selectedUser: User) => {
    await dispatch(createChat(selectedUser.id));
    setShowNewChat(false);
    setSearchQuery('');
    dispatch(clearSearchResults());
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const handleViewChange = (view: 'chats' | 'status' | 'calls' | 'settings') => {
    setCurrentView(view);
    setShowNewChat(false);
    setShowCreateGroup(false);
  };

  // Show different views based on current selection
  if (currentView === 'status') {
    return <StatusPage onBack={() => setCurrentView('chats')} />;
  }

  if (currentView === 'calls') {
    return <CallHistory onBack={() => setCurrentView('chats')} />;
  }

  if (currentView === 'settings') {
    return <SettingsPage onBack={() => setCurrentView('chats')} />;
  }

  if (showCreateGroup) {
    return (
      <CreateGroup
        onBack={() => setShowCreateGroup(false)}
        onCreated={() => {
          setShowCreateGroup(false);
          dispatch(fetchChats());
        }}
      />
    );
  }

  return (
    <div 
      className="w-80 flex flex-col h-full relative border-r"
      style={{ 
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border
      }}
    >
      {/* Top Navigation Bar */}
      <div 
        className="p-3 border-b shadow-sm"
        style={{ 
          backgroundColor: theme.colors.background,
          borderColor: theme.colors.border
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative group">
              <img
                src={user?.avatar}
                alt={user?.name}
                className="w-8 h-8 rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity ring-2"
                style={{ ringColor: theme.colors.success }}
                onClick={() => setShowUserMenu(!showUserMenu)}
              />
              <div 
                className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
                style={{ 
                  backgroundColor: theme.colors.success,
                  borderColor: theme.colors.background
                }}
              ></div>
              
              {/* User Status Dropdown */}
              {showUserMenu && (
                <div 
                  className="absolute top-10 left-0 rounded-lg shadow-2xl border p-2 min-w-[220px] z-50 animate-slide-down"
                  style={{ 
                    backgroundColor: theme.colors.background,
                    borderColor: theme.colors.border
                  }}
                >
                  <div className="p-3 border-b" style={{ borderColor: theme.colors.border }}>
                    <div className="flex items-center space-x-3">
                      <img src={user?.avatar} alt={user?.name} className="w-10 h-10 rounded-full" />
                      <div>
                        <p className="font-semibold text-sm" style={{ color: theme.colors.text }}>{user?.name}</p>
                        <p className="text-xs" style={{ color: theme.colors.muted }}>{user?.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="py-2">
                    <button className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-opacity-50 rounded text-left transition-colors" style={{ backgroundColor: 'transparent' }}>
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.colors.success }}></div>
                      <span className="text-sm" style={{ color: theme.colors.text }}>Online</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-opacity-50 rounded text-left transition-colors">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.colors.warning }}></div>
                      <span className="text-sm" style={{ color: theme.colors.text }}>Away</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-opacity-50 rounded text-left transition-colors">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.colors.error }}></div>
                      <span className="text-sm" style={{ color: theme.colors.text }}>Do Not Disturb</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-opacity-50 rounded text-left transition-colors">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.colors.muted }}></div>
                      <span className="text-sm" style={{ color: theme.colors.text }}>Invisible</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-sm" style={{ color: theme.colors.text }}>{user?.name}</h2>
              <p className="text-xs flex items-center" style={{ color: theme.colors.muted }}>
                <span className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: theme.colors.success }}></span>
                Online
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <button 
              onClick={() => setShowNewChat(!showNewChat)}
              className={`p-2 rounded transition-colors ${showNewChat ? 'text-primary' : ''}`}
              style={{ 
                backgroundColor: showNewChat ? `${theme.colors.primary}20` : 'transparent',
                color: showNewChat ? theme.colors.primary : theme.colors.muted
              }}
              title="New Chat"
            >
              {showNewChat ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </button>
            <button 
              onClick={() => setShowCreateGroup(true)}
              className="p-2 rounded transition-colors hover:bg-opacity-20"
              style={{ 
                color: theme.colors.muted,
                backgroundColor: 'transparent'
              }}
              title="New Group"
            >
              <Users className="w-4 h-4" />
            </button>
            <button 
              onClick={() => handleViewChange('settings')}
              className="p-2 rounded transition-colors hover:bg-opacity-20"
              style={{ 
                color: theme.colors.muted,
                backgroundColor: 'transparent'
              }}
              title="Settings"
            >
              <Cog className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-3" style={{ backgroundColor: theme.colors.surface }}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: theme.colors.muted }} />
          <input
            type="text"
            placeholder={showNewChat ? "Search users..." : "Search conversations..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border-none focus:outline-none text-sm transition-colors"
            style={{ 
              backgroundColor: theme.colors.background,
              color: theme.colors.text,
              '::placeholder': { color: theme.colors.muted }
            }}
          />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="px-3 mb-2">
        <div className="flex rounded-lg p-1 border" style={{ backgroundColor: theme.colors.background, borderColor: theme.colors.border }}>
          <button
            onClick={() => handleViewChange('chats')}
            className={`flex-1 flex items-center justify-center space-x-1 py-2 text-xs font-medium rounded-md transition-all ${
              currentView === 'chats' ? 'shadow-lg' : ''
            }`}
            style={{
              backgroundColor: currentView === 'chats' ? theme.colors.primary : 'transparent',
              color: currentView === 'chats' ? 'white' : theme.colors.muted
            }}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Chats</span>
          </button>
          <button
            onClick={() => handleViewChange('calls')}
            className={`flex-1 flex items-center justify-center space-x-1 py-2 text-xs font-medium rounded-md transition-all ${
              currentView === 'calls' ? 'shadow-lg' : ''
            }`}
            style={{
              backgroundColor: currentView === 'calls' ? theme.colors.primary : 'transparent',
              color: currentView === 'calls' ? 'white' : theme.colors.muted
            }}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Calls</span>
          </button>
          <button
            onClick={() => handleViewChange('status')}
            className={`flex-1 flex items-center justify-center space-x-1 py-2 text-xs font-medium rounded-md transition-all ${
              currentView === 'status' ? 'shadow-lg' : ''
            }`}
            style={{
              backgroundColor: currentView === 'status' ? theme.colors.primary : 'transparent',
              color: currentView === 'status' ? 'white' : theme.colors.muted
            }}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Status</span>
          </button>
        </div>
      </div>

      {/* Section Header */}
      {!showNewChat && (
        <div className="px-4 py-2 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wide flex items-center" style={{ color: theme.colors.muted }}>
            <Hash className="w-3 h-3 mr-1" />
            Direct Messages
          </h3>
          <div className="flex items-center space-x-1">
            <button className="p-1 rounded transition-colors" style={{ color: theme.colors.muted }}>
              <Bell className="w-3 h-3" />
            </button>
            <button className="p-1 rounded transition-colors" style={{ color: theme.colors.muted }}>
              <Archive className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        {showNewChat ? (
          // New Chat - User Search Results
          <div className="px-2">
            {searchQuery.trim() && (
              <div className="px-2 py-2 border-b mb-2" style={{ borderColor: theme.colors.border }}>
                <h3 className="text-xs font-semibold uppercase tracking-wide" style={{ color: theme.colors.muted }}>Search Results</h3>
              </div>
            )}
            {isLoading ? (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-t-transparent mx-auto mb-3" style={{ borderColor: theme.colors.primary }}></div>
                <p className="text-sm" style={{ color: theme.colors.muted }}>Searching users...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-1">
                {searchResults.map((searchUser) => (
                  <div
                    key={searchUser.id}
                    onClick={() => handleUserSelect(searchUser)}
                    className="px-3 py-3 cursor-pointer transition-all rounded-lg group"
                    style={{ backgroundColor: 'transparent' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${theme.colors.primary}10`}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src={searchUser.avatar}
                          alt={searchUser.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        {searchUser.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2" style={{ backgroundColor: theme.colors.success, borderColor: theme.colors.surface }}></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate" style={{ color: theme.colors.text }}>
                          {searchUser.name}
                        </h3>
                        <p className="text-xs truncate" style={{ color: theme.colors.muted }}>
                          {searchUser.email}
                        </p>
                        {searchUser.bio && (
                          <p className="text-xs truncate mt-0.5" style={{ color: theme.colors.muted }}>
                            {searchUser.bio}
                          </p>
                        )}
                      </div>
                      <UserPlus className="w-4 h-4 transition-colors" style={{ color: theme.colors.muted }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : searchQuery.trim() ? (
              <div className="p-6 text-center">
                <Users className="w-12 h-12 mx-auto mb-3" style={{ color: theme.colors.muted }} />
                <p className="text-sm mb-1" style={{ color: theme.colors.text }}>No users found</p>
                <p className="text-xs" style={{ color: theme.colors.muted }}>Try a different search term</p>
              </div>
            ) : (
              <div className="p-6 text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: theme.colors.background }}>
                  <Users className="w-8 h-8" style={{ color: theme.colors.muted }} />
                </div>
                <p className="text-sm mb-1" style={{ color: theme.colors.text }}>Find your friends</p>
                <p className="text-xs" style={{ color: theme.colors.muted }}>Search for users to start a new chat</p>
              </div>
            )}
          </div>
        ) : (
          // Chat List
          <div className="space-y-0.5 px-2">
            {chats.length === 0 ? (
              <div className="p-6 text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: theme.colors.background }}>
                  <MessageCircle className="w-8 h-8" style={{ color: theme.colors.muted }} />
                </div>
                <p className="text-sm mb-1" style={{ color: theme.colors.text }}>No conversations yet</p>
                <p className="text-xs" style={{ color: theme.colors.muted }}>Start a new conversation to get started</p>
              </div>
            ) : (
              chats
                .filter(chat => 
                  !searchQuery.trim() || 
                  chat.participants.some(p => 
                    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.email.toLowerCase().includes(searchQuery.toLowerCase())
                  ) ||
                  (chat.chatType === 'group' && chat.groupName?.toLowerCase().includes(searchQuery.toLowerCase()))
                )
                .map((chat) => {
                  const isActive = activeChat?.id === chat.id;
                  const isGroup = chat.chatType === 'group';
                  const displayName = isGroup ? chat.groupName : chat.participants[0]?.name;
                  const displayAvatar = isGroup ? chat.groupAvatar : chat.participants[0]?.avatar;
                  const isOnline = isGroup ? false : chat.participants[0]?.isOnline;
                  
                  return (
                    <div
                      key={chat.id}
                      onClick={() => handleChatSelect(chat)}
                      className={`px-3 py-3 cursor-pointer transition-all group rounded-lg relative ${
                        isActive ? 'shadow-sm' : ''
                      }`}
                      style={{
                        backgroundColor: isActive ? `${theme.colors.primary}20` : 'transparent',
                        color: isActive ? theme.colors.text : theme.colors.text
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = `${theme.colors.primary}10`;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      {/* Active indicator */}
                      {isActive && (
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 rounded-r-full" style={{ backgroundColor: theme.colors.primary }}></div>
                      )}
                      
                      <div className="flex items-center space-x-3">
                        <div className="relative flex-shrink-0">
                          {isGroup ? (
                            <div 
                              className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                              style={{ background: theme.gradients.primary }}
                            >
                              <Users className="w-6 h-6 text-white" />
                            </div>
                          ) : (
                            <img
                              src={displayAvatar}
                              alt={displayName}
                              className="w-12 h-12 rounded-full object-cover shadow-lg"
                            />
                          )}
                          {isOnline && (
                            <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 shadow-sm" style={{ backgroundColor: theme.colors.success, borderColor: theme.colors.surface }}></div>
                          )}
                          {chat.unreadCount > 0 && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: theme.colors.error }}>
                              <span className="text-white text-xs font-bold">
                                {chat.unreadCount > 9 ? '9+' : chat.unreadCount}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className={`font-semibold text-sm truncate flex items-center`} style={{ color: theme.colors.text }}>
                              {displayName}
                              {isGroup && <Crown className="w-3 h-3 ml-1" style={{ color: theme.colors.warning }} />}
                            </h3>
                            <span className="text-xs flex-shrink-0" style={{ color: theme.colors.muted }}>
                              {chat.lastMessage && formatChatTime(chat.lastMessage.timestamp)}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <p className="text-xs truncate flex-1" style={{ color: theme.colors.muted }}>
                              {chat.isTyping ? (
                                <span className="italic flex items-center" style={{ color: theme.colors.primary }}>
                                  <span className="flex space-x-1 mr-2">
                                    <div className="w-1 h-1 rounded-full animate-bounce" style={{ backgroundColor: theme.colors.primary }}></div>
                                    <div className="w-1 h-1 rounded-full animate-bounce delay-100" style={{ backgroundColor: theme.colors.primary }}></div>
                                    <div className="w-1 h-1 rounded-full animate-bounce delay-200" style={{ backgroundColor: theme.colors.primary }}></div>
                                  </span>
                                  typing...
                                </span>
                              ) : (
                                chat.lastMessage?.content || 'No messages yet'
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        )}
      </div>

      {/* Bottom User Panel */}
      <div className="p-3 border-t" style={{ backgroundColor: theme.colors.background, borderColor: theme.colors.border }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={user?.avatar}
                alt={user?.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2" style={{ backgroundColor: theme.colors.success, borderColor: theme.colors.background }}></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: theme.colors.text }}>{user?.name}</p>
              <p className="text-xs truncate" style={{ color: theme.colors.muted }}>#{user?.id?.slice(-4) || '0000'}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <button className="p-2 rounded transition-colors" style={{ color: theme.colors.muted }} title="Mute">
              <Mic className="w-4 h-4" />
            </button>
            <button className="p-2 rounded transition-colors" style={{ color: theme.colors.muted }} title="Deafen">
              <Headphones className="w-4 h-4" />
            </button>
            <button 
              onClick={handleLogout}
              className="p-2 rounded transition-colors" 
              style={{ color: theme.colors.error }}
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </div>
  );
};

export default Sidebar;