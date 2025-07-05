export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: Date;
  bio?: string;
  theme?: string;
  wallpaper?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  type: 'text' | 'ai-suggestion' | 'image' | 'file';
  chat?: string;
  replyTo?: string;
  reactions?: Array<{
    user: string;
    emoji: string;
    createdAt: Date;
  }>;
  isEdited?: boolean;
  editedAt?: Date;
  isPending?: boolean;
}

export interface Chat {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  isTyping: boolean;
  typingUser?: string;
  lastActivity?: Date;
  chatType: 'private' | 'group';
  groupName?: string;
  groupAvatar?: string;
  groupAdmin?: string;
  groupDescription?: string;
}

export interface Status {
  id: string;
  userId: string;
  content: string;
  type: 'text' | 'image' | 'video';
  mediaUrl?: string;
  backgroundColor?: string;
  textColor?: string;
  timestamp: Date;
  expiresAt: Date;
  viewers: Array<{
    userId: string;
    viewedAt: Date;
  }>;
}

export interface Call {
  id: string;
  callerId: string;
  receiverId: string;
  type: 'voice' | 'video';
  status: 'missed' | 'answered' | 'declined' | 'busy';
  duration?: number;
  timestamp: Date;
  chatId?: string;
}

export interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
    border: string;
    muted: string;
  };
  gradients: {
    primary: string;
    secondary: string;
    accent: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

export interface Wallpaper {
  id: string;
  name: string;
  url: string;
  type: 'gradient' | 'image';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ChatState {
  chats: Chat[];
  activeChat: Chat | null;
  messages: Message[];
  searchResults: User[];
  isLoading: boolean;
  error: string | null;
  typingUsers: Record<string, string>;
}

export interface StatusState {
  statuses: Status[];
  myStatuses: Status[];
  isLoading: boolean;
  error: string | null;
}

export interface CallState {
  calls: Call[];
  activeCall: Call | null;
  isLoading: boolean;
  error: string | null;
}

export interface SettingsState {
  theme: Theme;
  wallpaper: Wallpaper;
  notifications: boolean;
  soundEnabled: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface MessageFormData {
  content: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface GroupChatFormData {
  name: string;
  description?: string;
  participants: string[];
}

export interface StatusFormData {
  content: string;
  type: 'text' | 'image';
  backgroundColor?: string;
  textColor?: string;
}