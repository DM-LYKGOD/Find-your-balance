import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, User, AlertCircle, Loader2, Sparkles, Eye, EyeOff, KeyRound, Compass } from 'lucide-react';

interface LoginProps {
  onLogin: (name: string, email: string, password: string, isSignUp: boolean) => void;
  onGuestLogin?: () => void;
  isLoading?: boolean;
  error?: string | null;
}

const Login: React.FC<LoginProps> = ({ onLogin, onGuestLogin, isLoading, error }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    onLogin(name.trim(), email.trim(), password.trim(), isSignUp);
  };

  const handleFillDemo = () => {
    setEmail('demo@balance.app');
    setPassword('balance123');
    setIsSignUp(false);
    onLogin('Mindful Traveler', 'demo@balance.app', 'balance123', false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full p-4 relative z-20">
      <div className="glass-card p-8 md:p-10 rounded-[2.5rem] w-full max-w-md relative overflow-hidden shadow-2xl animate-fade-in backdrop-blur-xl border border-white/60 dark:border-white/10 transform rotate-1">
        
        {/* Decorative badge */}
        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-3 py-1 bg-lavender-100 dark:bg-lavender-900/40 text-lavender-700 dark:text-lavender-300 rounded-full border border-lavender-200 dark:border-lavender-700/50">
            <Sparkles className="w-3 h-3" /> Offline-First
          </span>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
           <div className="w-16 h-16 bg-gradient-to-br from-lavender-400 via-rose-300 to-amber-200 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white shadow-lg shadow-lavender-500/20 transform -rotate-3 border-2 border-white">
             <User className="w-8 h-8 text-zinc-800" />
           </div>
           <h1 className="font-handwriting text-5xl text-zinc-800 dark:text-zinc-100 mb-2">
             {isSignUp ? 'Join the Circle' : 'Welcome Back'}
           </h1>
           <p className="text-zinc-500 dark:text-zinc-400 font-marker text-sm">
             {isSignUp 
               ? 'Create your personal mindful balance profile' 
               : 'Enter your credentials to access your daily reflections'}
           </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-5 p-3.5 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800/40 text-red-600 dark:text-red-300 text-sm rounded-xl flex items-start gap-2.5 animate-fadeIn font-marker">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" />
            <div className="flex-1">
              <span className="font-bold block">Notice:</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="relative group animate-fadeIn">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name (e.g. Maya)"
                required={isSignUp}
                className="w-full bg-white/70 dark:bg-zinc-800/70 border-2 border-zinc-200 dark:border-zinc-700 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-lavender-400 font-marker text-lg transition-all"
              />
            </div>
          )}

          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
              className="w-full bg-white/70 dark:bg-zinc-800/70 border-2 border-zinc-200 dark:border-zinc-700 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-lavender-400 font-marker text-lg transition-all"
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input 
              type={showPassword ? 'text' : 'password'} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full bg-white/70 dark:bg-zinc-800/70 border-2 border-zinc-200 dark:border-zinc-700 rounded-xl py-3 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-lavender-400 font-marker text-lg transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-zinc-800 dark:bg-white text-white dark:text-zinc-900 py-3.5 rounded-xl font-bold hover:scale-[1.01] active:scale-[0.99] transition-all shadow-lg shadow-zinc-500/20 flex items-center justify-center gap-2 mt-2 text-xl font-handwriting tracking-wide disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Verifying...
              </>
            ) : (
              <>
                {isSignUp ? 'Create My Profile' : 'Access My Journal'}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Toggle Sign In / Sign Up */}
        <div className="mt-5 text-center">
          <button 
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
            }}
            className="text-base text-zinc-500 hover:text-lavender-600 dark:hover:text-lavender-400 font-medium transition-colors font-marker cursor-pointer"
          >
            {isSignUp ? 'Already registered? Sign In here' : "First time? Create a New Profile"}
          </button>
        </div>

        {/* Quick Demo & Guest Shortcuts */}
        <div className="mt-6 pt-5 border-t border-zinc-200/80 dark:border-zinc-700/80 space-y-2.5">
          <button
            type="button"
            onClick={handleFillDemo}
            className="w-full py-2.5 px-3 rounded-xl border border-dashed border-lavender-300 dark:border-lavender-700 bg-lavender-50/60 dark:bg-lavender-900/20 text-lavender-800 dark:text-lavender-300 hover:bg-lavender-100/80 transition-colors flex items-center justify-center gap-2 text-sm font-marker font-semibold cursor-pointer"
          >
            <KeyRound className="w-4 h-4 text-lavender-500" />
            Quick Demo Login (Mindful Traveler)
          </button>

          {onGuestLogin && (
            <button
              type="button"
              onClick={onGuestLogin}
              className="w-full py-2 px-3 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors flex items-center justify-center gap-1.5 text-sm font-marker cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              Explore as Guest (No password required)
            </button>
          )}
        </div>

        <p className="mt-4 text-[11px] text-center text-zinc-400 dark:text-zinc-500 font-marker">
          Your reflections and habits stay private and encrypted on your device.
        </p>

      </div>
    </div>
  );
};

export default Login;