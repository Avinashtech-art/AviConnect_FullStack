import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { loginUser } from '../../store/slices/authSlice';
import { RootState, AppDispatch } from '../../store';
import { MessageCircle, Eye, EyeOff, Loader2, Sparkles } from 'lucide-react';
import { LoginFormData } from '../../types';

const LoginForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    await dispatch(loginUser(data));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse-slow delay-500"></div>
      </div>

      <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-md border border-white/20">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl mb-6 shadow-lg">
            <MessageCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            Welcome Back
          </h1>
          <p className="text-muted">Sign in to continue your conversations</p>
          <div className="flex items-center justify-center space-x-1 mt-2">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm text-accent font-medium">AviConnect</span>
            <Sparkles className="w-4 h-4 text-accent" />
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-xl">
            <p className="text-error text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-semibold text-text">
              Email Address
            </label>
            <div className="relative">
              <input
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                type="email"
                className="w-full px-4 py-4 bg-surface border-2 border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-text placeholder-muted"
                placeholder="Enter your email"
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <p className="text-error text-sm font-medium">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-semibold text-text">
              Password
            </label>
            <div className="relative">
              <input
                {...register('password', { 
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                type={showPassword ? 'text' : 'password'}
                className="w-full px-4 py-4 pr-12 bg-surface border-2 border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-text placeholder-muted"
                placeholder="Enter your password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted hover:text-text transition-colors"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-error text-sm font-medium">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-primary to-accent text-white py-4 px-6 rounded-xl hover:shadow-lg focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-muted">
            Don't have an account?{' '}
            <Link 
              to="/register" 
              className="text-primary hover:text-accent font-semibold transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>

        <div className="mt-6 text-center">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-3">
            <p className="text-xs text-muted">
              <span className="font-semibold">Demo:</span> Use any valid email and password (6+ chars)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;