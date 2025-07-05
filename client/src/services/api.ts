import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL ;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData: { name: string; email: string; password: string }) =>
    api.post('/auth/register', userData),
  
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  
  logout: () => api.post('/auth/logout'),
  
  getMe: () => api.get('/auth/me'),
  
  refreshToken: () => api.post('/auth/refresh'),
};

// Chat API
export const chatAPI = {
  getChats: () => api.get('/chat'),
  
  createChat: (participantId: string) =>
    api.post('/chat', { participantId }),
  
  getMessages: (chatId: string, page = 1, limit = 50) =>
    api.get(`/chat/${chatId}/messages?page=${page}&limit=${limit}`),
  
  sendMessage: (chatId: string, messageData: { content: string; messageType?: string; replyTo?: string }) =>
    api.post(`/chat/${chatId}/messages`, messageData),
  
  deleteMessage: (chatId: string, messageId: string) =>
    api.delete(`/chat/${chatId}/messages/${messageId}`),
};

// User API
export const userAPI = {
  getUsers: () => api.get('/user'),
  
  searchUsers: (query: string) =>
    api.get(`/user/search?query=${encodeURIComponent(query)}`),
  
  updateProfile: (profileData: { name?: string; bio?: string; avatar?: string }) =>
    api.put('/user/profile', profileData),
  
  getUser: (userId: string) => api.get(`/user/${userId}`),
};

export default api;