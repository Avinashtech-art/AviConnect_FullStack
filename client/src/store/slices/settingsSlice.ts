import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SettingsState, Theme } from '../../types';

const defaultThemes: Theme[] = [
  {
    id: 'discord-dark',
    name: 'Discord Dark',
    colors: {
      primary: '#7289da',
      secondary: '#99aab5',
      background: '#2c2f33',
      surface: '#36393f',
      text: '#ffffff',
      accent: '#7289da',
      success: '#43b581',
      warning: '#faa61a',
      error: '#f04747',
      border: '#40444b',
      muted: '#b9bbbe',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #7289da 0%, #5b6eae 100%)',
      secondary: 'linear-gradient(135deg, #99aab5 0%, #7a8b99 100%)',
      accent: 'linear-gradient(135deg, #7289da 0%, #677bc4 100%)',
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.3)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.3)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.3)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.4), 0 8px 10px -6px rgb(0 0 0 / 0.3)',
    },
  },
  {
    id: 'modern-blue',
    name: 'Modern Blue',
    colors: {
      primary: '#2563eb',
      secondary: '#64748b',
      background: '#f8fafc',
      surface: '#ffffff',
      text: '#0f172a',
      accent: '#3b82f6',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      border: '#e2e8f0',
      muted: '#64748b',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
      secondary: 'linear-gradient(135deg, #64748b 0%, #94a3b8 100%)',
      accent: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    },
  },
  {
    id: 'purple-luxury',
    name: 'Purple Luxury',
    colors: {
      primary: '#7c3aed',
      secondary: '#a78bfa',
      background: '#faf5ff',
      surface: '#ffffff',
      text: '#581c87',
      accent: '#c084fc',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      border: '#e9d5ff',
      muted: '#8b5cf6',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
      secondary: 'linear-gradient(135deg, #a78bfa 0%, #c084fc 100%)',
      accent: 'linear-gradient(135deg, #c084fc 0%, #ddd6fe 100%)',
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(124 58 237 / 0.1)',
      md: '0 4px 6px -1px rgb(124 58 237 / 0.15), 0 2px 4px -2px rgb(124 58 237 / 0.1)',
      lg: '0 10px 15px -3px rgb(124 58 237 / 0.15), 0 4px 6px -4px rgb(124 58 237 / 0.1)',
      xl: '0 20px 25px -5px rgb(124 58 237 / 0.15), 0 8px 10px -6px rgb(124 58 237 / 0.1)',
    },
  },
  {
    id: 'emerald-nature',
    name: 'Emerald Nature',
    colors: {
      primary: '#059669',
      secondary: '#34d399',
      background: '#f0fdf4',
      surface: '#ffffff',
      text: '#064e3b',
      accent: '#6ee7b7',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      border: '#bbf7d0',
      muted: '#047857',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
      secondary: 'linear-gradient(135deg, #34d399 0%, #6ee7b7 100%)',
      accent: 'linear-gradient(135deg, #6ee7b7 0%, #a7f3d0 100%)',
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(5 150 105 / 0.1)',
      md: '0 4px 6px -1px rgb(5 150 105 / 0.15), 0 2px 4px -2px rgb(5 150 105 / 0.1)',
      lg: '0 10px 15px -3px rgb(5 150 105 / 0.15), 0 4px 6px -4px rgb(5 150 105 / 0.1)',
      xl: '0 20px 25px -5px rgb(5 150 105 / 0.15), 0 8px 10px -6px rgb(5 150 105 / 0.1)',
    },
  },
];

const wallpapers = [
  {
    id: 'discord-default',
    name: 'Discord Default',
    url: 'linear-gradient(135deg, #36393f 0%, #2c2f33 100%)',
    type: 'gradient'
  },
  {
    id: 'gradient-1',
    name: 'Ocean Breeze',
    url: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    type: 'gradient'
  },
  {
    id: 'gradient-2',
    name: 'Sunset Glow',
    url: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    type: 'gradient'
  },
  {
    id: 'gradient-3',
    name: 'Forest Mist',
    url: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    type: 'gradient'
  },
];

// Helper function to apply theme to DOM
const applyThemeToDOM = (theme: Theme) => {
  const root = document.documentElement;
  
  // Apply colors
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });
  
  // Apply gradients
  Object.entries(theme.gradients).forEach(([key, value]) => {
    root.style.setProperty(`--gradient-${key}`, value);
  });
  
  // Apply shadows
  Object.entries(theme.shadows).forEach(([key, value]) => {
    root.style.setProperty(`--shadow-${key}`, value);
  });

  console.log('✅ Theme applied to DOM:', theme.name);
};

const getInitialState = (): SettingsState => {
  // Get saved settings from localStorage
  const savedTheme = localStorage.getItem('aviconnect-theme');
  const savedWallpaper = localStorage.getItem('aviconnect-wallpaper');
  const savedNotifications = localStorage.getItem('aviconnect-notifications');
  const savedSound = localStorage.getItem('aviconnect-sound');
  
  // Use saved theme or default to Discord Dark
  const initialTheme = savedTheme ? JSON.parse(savedTheme) : defaultThemes[0];
  
  // Apply initial theme to DOM immediately
  if (typeof window !== 'undefined') {
    applyThemeToDOM(initialTheme);
  }
  
  return {
    theme: initialTheme,
    wallpaper: savedWallpaper ? JSON.parse(savedWallpaper) : wallpapers[0],
    notifications: savedNotifications ? JSON.parse(savedNotifications) : true,
    soundEnabled: savedSound ? JSON.parse(savedSound) : true,
    isLoading: false,
    error: null,
  };
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState: getInitialState(),
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
      localStorage.setItem('aviconnect-theme', JSON.stringify(action.payload));
      
      // Apply theme to DOM immediately
      applyThemeToDOM(action.payload);
    },
    setWallpaper: (state, action: PayloadAction<any>) => {
      state.wallpaper = action.payload;
      localStorage.setItem('aviconnect-wallpaper', JSON.stringify(action.payload));
    },
    toggleNotifications: (state) => {
      state.notifications = !state.notifications;
      localStorage.setItem('aviconnect-notifications', JSON.stringify(state.notifications));
    },
    toggleSound: (state) => {
      state.soundEnabled = !state.soundEnabled;
      localStorage.setItem('aviconnect-sound', JSON.stringify(state.soundEnabled));
    },
    resetSettings: (state) => {
      state.theme = defaultThemes[0];
      state.wallpaper = wallpapers[0];
      state.notifications = true;
      state.soundEnabled = true;
      localStorage.removeItem('aviconnect-theme');
      localStorage.removeItem('aviconnect-wallpaper');
      localStorage.removeItem('aviconnect-notifications');
      localStorage.removeItem('aviconnect-sound');
      
      // Apply default theme to DOM
      applyThemeToDOM(defaultThemes[0]);
    },
  },
});

export const { setTheme, setWallpaper, toggleNotifications, toggleSound, resetSettings } = settingsSlice.actions;
export { defaultThemes, wallpapers };
export default settingsSlice.reducer;