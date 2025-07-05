import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { searchUsers, createGroupChat } from '../../store/slices/chatSlice';
import { ArrowLeft, Users, Search, Check, X, Camera, Plus } from 'lucide-react';

interface CreateGroupProps {
  onBack: () => void;
  onCreated: () => void;
}

const CreateGroup: React.FC<CreateGroupProps> = ({ onBack, onCreated }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { searchResults, isLoading } = useSelector((state: RootState) => state.chat);
  const { user } = useSelector((state: RootState) => state.auth);
  const { theme } = useSelector((state: RootState) => state.settings);
  
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [step, setStep] = useState<'details' | 'members'>('details');
  const [isCreating, setIsCreating] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      dispatch(searchUsers(query));
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim() || selectedUsers.length === 0) return;

    setIsCreating(true);
    try {
      await dispatch(createGroupChat({
        name: groupName.trim(),
        description: groupDescription.trim(),
        participants: selectedUsers
      })).unwrap();
      
      console.log('✅ Group created successfully');
      onCreated();
    } catch (error) {
      console.error('❌ Failed to create group:', error);
    } finally {
      setIsCreating(false);
    }
  };

  if (step === 'details') {
    return (
      <div className="flex flex-col h-full" style={{ backgroundColor: theme.colors.background }}>
        {/* Header */}
        <div className="p-4 border-b" style={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.border }}>
          <div className="flex items-center space-x-3">
            <button
              onClick={onBack}
              className="p-2 rounded-full transition-colors"
              style={{ color: theme.colors.muted, backgroundColor: 'transparent' }}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold" style={{ color: theme.colors.text }}>New Group</h1>
          </div>
        </div>

        {/* Group Details Form */}
        <div className="flex-1 p-6">
          <div className="max-w-md mx-auto space-y-6">
            {/* Group Avatar */}
            <div className="flex justify-center">
              <div 
                className="w-24 h-24 rounded-full flex items-center justify-center relative group cursor-pointer"
                style={{ backgroundColor: theme.colors.surface }}
              >
                <Users className="w-12 h-12" style={{ color: theme.colors.muted }} />
                <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            {/* Group Name */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text }}>
                Group Name *
              </label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Enter group name"
                className="w-full px-4 py-3 rounded-lg border-2 focus:ring-2 focus:ring-opacity-20 transition-all"
                style={{ 
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                  color: theme.colors.text,
                  focusBorderColor: theme.colors.primary,
                  focusRingColor: theme.colors.primary
                }}
                maxLength={50}
              />
              <p className="text-xs mt-1" style={{ color: theme.colors.muted }}>
                {groupName.length}/50 characters
              </p>
            </div>

            {/* Group Description */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text }}>
                Description (Optional)
              </label>
              <textarea
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
                placeholder="What's this group about?"
                className="w-full px-4 py-3 rounded-lg border-2 focus:ring-2 focus:ring-opacity-20 resize-none transition-all"
                style={{ 
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                  color: theme.colors.text
                }}
                rows={3}
                maxLength={200}
              />
              <p className="text-xs mt-1" style={{ color: theme.colors.muted }}>
                {groupDescription.length}/200 characters
              </p>
            </div>

            {/* Next Button */}
            <button
              onClick={() => setStep('members')}
              disabled={!groupName.trim()}
              className="w-full py-3 px-4 rounded-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
              style={{ 
                background: theme.gradients.primary,
                color: 'white'
              }}
            >
              Next: Add Members
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: theme.colors.background }}>
      {/* Header */}
      <div className="p-4 border-b" style={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.border }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setStep('details')}
              className="p-2 rounded-full transition-colors"
              style={{ color: theme.colors.muted }}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-semibold" style={{ color: theme.colors.text }}>Add Members</h1>
              <p className="text-sm" style={{ color: theme.colors.muted }}>
                {selectedUsers.length} selected
              </p>
            </div>
          </div>
          <button
            onClick={handleCreateGroup}
            disabled={selectedUsers.length === 0 || isCreating}
            className="px-4 py-2 rounded-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              backgroundColor: theme.colors.primary,
              color: 'white'
            }}
          >
            {isCreating ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b" style={{ borderColor: theme.colors.border }}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: theme.colors.muted }} />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all"
            style={{ 
              backgroundColor: theme.colors.surface,
              color: theme.colors.text,
              focusRingColor: theme.colors.primary
            }}
          />
        </div>
      </div>

      {/* Selected Users */}
      {selectedUsers.length > 0 && (
        <div className="p-4 border-b" style={{ borderColor: theme.colors.border }}>
          <div className="flex flex-wrap gap-2">
            {selectedUsers.map((userId) => {
              const selectedUser = searchResults.find(u => u.id === userId);
              if (!selectedUser) return null;
              
              return (
                <div
                  key={userId}
                  className="flex items-center space-x-2 px-3 py-1 rounded-full"
                  style={{ backgroundColor: `${theme.colors.primary}20`, color: theme.colors.primary }}
                >
                  <img
                    src={selectedUser.avatar}
                    alt={selectedUser.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium">{selectedUser.name}</span>
                  <button
                    onClick={() => toggleUserSelection(userId)}
                    className="p-0.5 rounded-full transition-colors"
                    style={{ backgroundColor: `${theme.colors.primary}30` }}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* User List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 mx-auto" style={{ borderColor: theme.colors.primary }}></div>
            <p className="text-sm mt-2" style={{ color: theme.colors.muted }}>Searching...</p>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="divide-y" style={{ borderColor: theme.colors.border }}>
            {searchResults.map((searchUser) => {
              const isSelected = selectedUsers.includes(searchUser.id);
              
              return (
                <div
                  key={searchUser.id}
                  onClick={() => toggleUserSelection(searchUser.id)}
                  className="p-4 cursor-pointer transition-all"
                  style={{ backgroundColor: 'transparent' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${theme.colors.primary}10`}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={searchUser.avatar}
                        alt={searchUser.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {searchUser.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2" style={{ backgroundColor: theme.colors.success, borderColor: theme.colors.background }}></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate" style={{ color: theme.colors.text }}>
                        {searchUser.name}
                      </h3>
                      <p className="text-sm truncate" style={{ color: theme.colors.muted }}>
                        {searchUser.email}
                      </p>
                      {searchUser.bio && (
                        <p className="text-xs truncate mt-1" style={{ color: theme.colors.muted }}>
                          {searchUser.bio}
                        </p>
                      )}
                    </div>
                    <div 
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors`}
                      style={{ 
                        backgroundColor: isSelected ? theme.colors.primary : 'transparent',
                        borderColor: isSelected ? theme.colors.primary : theme.colors.border
                      }}
                    >
                      {isSelected && <Check className="w-4 h-4 text-white" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : searchQuery.trim() ? (
          <div className="p-4 text-center">
            <Users className="w-12 h-12 mx-auto mb-2" style={{ color: theme.colors.muted }} />
            <p className="text-sm" style={{ color: theme.colors.muted }}>No users found</p>
          </div>
        ) : (
          <div className="p-4 text-center">
            <Users className="w-12 h-12 mx-auto mb-2" style={{ color: theme.colors.muted }} />
            <p className="text-sm" style={{ color: theme.colors.muted }}>Search for users to add to your group</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateGroup;