import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { setTheme, setWallpaper, toggleNotifications, toggleSound, resetSettings, defaultThemes, wallpapers } from '../../store/slices/settingsSlice';
import { logoutUser } from '../../store/slices/authSlice';
import { ArrowLeft, Palette, Image, Bell, Volume2, Lock, LogOut, User, Moon, Sun, Sparkles, Shield, Key, Smartphone } from 'lucide-react';

interface SettingsPageProps {
  onBack: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onBack }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { theme, wallpaper, notifications, soundEnabled } = useSelector((state: RootState) => state.settings);
  const { user } = useSelector((state: RootState) => state.auth);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleThemeChange = (newTheme: any) => {
    console.log('Changing theme to:', newTheme.name);
    dispatch(setTheme(newTheme));
  };

  const handleWallpaperChange = (newWallpaper: any) => {
    dispatch(setWallpaper(newWallpaper));
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement password change API call
    console.log('Password change:', passwordForm);
    setShowChangePassword(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const ChangePasswordForm = () => (
    <div className="bg-surface rounded-2xl border border-border p-6 shadow-lg">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
          <Key className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-bold text-text">Change Password</h3>
      </div>
      
      <form onSubmit={handlePasswordChange} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-text mb-2">
            Current Password
          </label>
          <input
            type="password"
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
            className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-text"
            placeholder="Enter current password"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-text mb-2">
            New Password
          </label>
          <input
            type="password"
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
            className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-text"
            placeholder="Enter new password"
            required
            minLength={6}
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-text mb-2">
            Confirm New Password
          </label>
          <input
            type="password"
            value={passwordForm.confirmPassword}
            onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
            className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-text"
            placeholder="Confirm new password"
            required
          />
        </div>
        
        <div className="flex space-x-3 pt-4">
          <button 
            type="submit"
            className="flex-1 bg-gradient-to-r from-primary to-accent text-white py-3 px-4 rounded-xl hover:shadow-lg transition-all font-semibold transform hover:scale-[1.02]"
          >
            Update Password
          </button>
          <button 
            type="button"
            onClick={() => setShowChangePassword(false)}
            className="flex-1 bg-border text-text py-3 px-4 rounded-xl hover:bg-muted/20 transition-all font-semibold"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: theme.colors.background }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent p-6 text-white">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/20 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Settings</h1>
              <p className="text-white/80 text-sm">Customize your experience</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Profile Section */}
        <div className="rounded-2xl border p-6 shadow-lg" style={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.border }}>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={user?.avatar}
                alt={user?.name}
                className="w-16 h-16 rounded-2xl object-cover border-2"
                style={{ borderColor: `${theme.colors.primary}33` }}
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 flex items-center justify-center" style={{ backgroundColor: theme.colors.success, borderColor: theme.colors.surface }}>
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold" style={{ color: theme.colors.text }}>{user?.name}</h2>
              <p style={{ color: theme.colors.muted }}>{user?.email}</p>
              <p className="text-sm mt-1" style={{ color: theme.colors.muted }}>{user?.bio}</p>
            </div>
            <button className="p-3 rounded-xl transition-all" style={{ color: theme.colors.muted, backgroundColor: `${theme.colors.primary}1a` }}>
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Change Password */}
        {showChangePassword && <ChangePasswordForm />}

        {/* Settings Sections */}
        <div className="space-y-4">
          {/* Themes */}
          <div className="rounded-2xl border shadow-lg overflow-hidden" style={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.border }}>
            <button
              onClick={() => setActiveSection(activeSection === 'themes' ? null : 'themes')}
              className="w-full flex items-center justify-between p-6 transition-colors"
              style={{ backgroundColor: activeSection === 'themes' ? `${theme.colors.background}80` : 'transparent' }}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                  <Palette className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <span className="font-semibold text-lg" style={{ color: theme.colors.text }}>Themes</span>
                  <p className="text-sm" style={{ color: theme.colors.muted }}>Customize your app appearance</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm px-3 py-1 rounded-full font-medium" style={{ color: theme.colors.primary, backgroundColor: `${theme.colors.primary}1a` }}>
                  {theme.name}
                </span>
                <div className={`transform transition-transform ${activeSection === 'themes' ? 'rotate-180' : ''}`}>
                  <ArrowLeft className="w-5 h-5 rotate-90" style={{ color: theme.colors.muted }} />
                </div>
              </div>
            </button>
            
            {activeSection === 'themes' && (
              <div className="px-6 pb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {defaultThemes.map((themeOption) => (
                    <button
                      key={themeOption.id}
                      onClick={() => handleThemeChange(themeOption)}
                      className={`p-4 rounded-xl border-2 transition-all transform hover:scale-[1.02] ${
                        theme.id === themeOption.id 
                          ? 'shadow-lg' 
                          : 'hover:shadow-md'
                      }`}
                      style={{ 
                        borderColor: theme.id === themeOption.id ? theme.colors.primary : theme.colors.border,
                        backgroundColor: theme.id === themeOption.id ? `${theme.colors.primary}1a` : theme.colors.background
                      }}
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div 
                          className="w-6 h-6 rounded-full border-2 border-white shadow-md"
                          style={{ background: themeOption.gradients.primary }}
                        />
                        <span className="font-semibold" style={{ color: theme.colors.text }}>{themeOption.name}</span>
                        {theme.id === themeOption.id && (
                          <Sparkles className="w-4 h-4 ml-auto" style={{ color: theme.colors.primary }} />
                        )}
                      </div>
                      <div className="flex space-x-1">
                        {Object.values(themeOption.colors).slice(0, 6).map((color, index) => (
                          <div
                            key={index}
                            className="w-4 h-4 rounded-full border border-white/50"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Wallpapers */}
          <div className="rounded-2xl border shadow-lg overflow-hidden" style={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.border }}>
            <button
              onClick={() => setActiveSection(activeSection === 'wallpapers' ? null : 'wallpapers')}
              className="w-full flex items-center justify-between p-6 transition-colors"
              style={{ backgroundColor: activeSection === 'wallpapers' ? `${theme.colors.background}80` : 'transparent' }}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-xl flex items-center justify-center">
                  <Image className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <span className="font-semibold text-lg" style={{ color: theme.colors.text }}>Chat Wallpaper</span>
                  <p className="text-sm" style={{ color: theme.colors.muted }}>Personalize your chat background</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm px-3 py-1 rounded-full font-medium" style={{ color: theme.colors.accent, backgroundColor: `${theme.colors.accent}1a` }}>
                  {wallpaper.name}
                </span>
                <div className={`transform transition-transform ${activeSection === 'wallpapers' ? 'rotate-180' : ''}`}>
                  <ArrowLeft className="w-5 h-5 rotate-90" style={{ color: theme.colors.muted }} />
                </div>
              </div>
            </button>
            
            {activeSection === 'wallpapers' && (
              <div className="px-6 pb-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {wallpapers.map((wallpaperOption) => (
                    <button
                      key={wallpaperOption.id}
                      onClick={() => handleWallpaperChange(wallpaperOption)}
                      className={`aspect-square rounded-xl overflow-hidden border-2 transition-all transform hover:scale-[1.05] ${
                        wallpaper.id === wallpaperOption.id 
                          ? 'shadow-lg ring-2' 
                          : ''
                      }`}
                      style={{ 
                        borderColor: wallpaper.id === wallpaperOption.id ? theme.colors.primary : theme.colors.border,
                        ringColor: wallpaper.id === wallpaperOption.id ? `${theme.colors.primary}33` : 'transparent'
                      }}
                    >
                      {wallpaperOption.type === 'gradient' ? (
                        <div 
                          className="w-full h-full flex items-center justify-center"
                          style={{ background: wallpaperOption.url }}
                        >
                          <span className="text-white font-semibold text-xs bg-black/20 px-2 py-1 rounded">
                            {wallpaperOption.name}
                          </span>
                        </div>
                      ) : (
                        <img
                          src={wallpaperOption.url}
                          alt={wallpaperOption.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                      {wallpaper.id === wallpaperOption.id && (
                        <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: `${theme.colors.primary}33` }}>
                          <Sparkles className="w-6 h-6 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="rounded-2xl border shadow-lg" style={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.border }}>
            <button
              onClick={() => dispatch(toggleNotifications())}
              className="w-full flex items-center justify-between p-6 transition-colors"
              style={{ backgroundColor: 'transparent' }}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-warning to-accent rounded-xl flex items-center justify-center">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <span className="font-semibold text-lg" style={{ color: theme.colors.text }}>Notifications</span>
                  <p className="text-sm" style={{ color: theme.colors.muted }}>Receive message alerts</p>
                </div>
              </div>
              <div className={`relative w-14 h-8 rounded-full transition-all duration-300`} style={{ backgroundColor: notifications ? theme.colors.primary : theme.colors.border }}>
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                  notifications ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </div>
            </button>
          </div>

          {/* Sound */}
          <div className="rounded-2xl border shadow-lg" style={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.border }}>
            <button
              onClick={() => dispatch(toggleSound())}
              className="w-full flex items-center justify-between p-6 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-success to-primary rounded-xl flex items-center justify-center">
                  <Volume2 className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <span className="font-semibold text-lg" style={{ color: theme.colors.text }}>Sound Effects</span>
                  <p className="text-sm" style={{ color: theme.colors.muted }}>Play notification sounds</p>
                </div>
              </div>
              <div className={`relative w-14 h-8 rounded-full transition-all duration-300`} style={{ backgroundColor: soundEnabled ? theme.colors.success : theme.colors.border }}>
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                  soundEnabled ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </div>
            </button>
          </div>

          {/* Change Password */}
          <div className="rounded-2xl border shadow-lg" style={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.border }}>
            <button
              onClick={() => setShowChangePassword(!showChangePassword)}
              className="w-full flex items-center justify-between p-6 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-error to-warning rounded-xl flex items-center justify-center">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <span className="font-semibold text-lg" style={{ color: theme.colors.text }}>Change Password</span>
                  <p className="text-sm" style={{ color: theme.colors.muted }}>Update your account security</p>
                </div>
              </div>
              <Shield className="w-5 h-5" style={{ color: theme.colors.muted }} />
            </button>
          </div>

          {/* Logout */}
          <div className="rounded-2xl border shadow-lg" style={{ backgroundColor: theme.colors.surface, borderColor: `${theme.colors.error}33` }}>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-4 p-6 transition-colors"
              style={{ color: theme.colors.error, backgroundColor: 'transparent' }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-error to-error/80 rounded-xl flex items-center justify-center">
                <LogOut className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <span className="font-semibold text-lg">Logout</span>
                <p className="text-sm opacity-70">Sign out of your account</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;