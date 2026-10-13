import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, User, AlertCircle, Loader2 } from 'lucide-react';

interface LoginProps {
  onLogin: (name: string, email: string, password: string, isSignUp: boolean) => void;
  isLoading?: boolean;
  error?: string | null;
}

const Login: React.FC<LoginProps> = ({ onLogin, isLoading, error }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(name, email, password, isSignUp);
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full p-4 relative z-20">
      <div className="glass-card p-8 md:p-10 rounded-[2rem] w-full max-w-md relative overflow-hidden shadow-2xl animate-fade-in backdrop-blur-xl border border-white/40 dark:border-white/10 transform rotate-1">
        
        {/* Header */}
        <div className="text-center mb-8">
           <div className="w-16 h-16 bg-gradient-to-br from-lavender-400 to-rose-400 rounded-2xl mx-auto mb-6 flex items-center justify-center text-white shadow-lg shadow-lavender-500/30 transform -rotate-3 border-2 border-white">
             <User className="w-8 h-8" />
           </div>
           <h1 className="font-handwriting text-5xl text-zinc-800 dark:text-zinc-100 mb-3">
             {isSignUp ? 'Join the Circle' : 'Welcome Back'}
           </h1>
           <p className="text-zinc-500 dark:text-zinc-400 font-marker text-sm">
             Your journal is safe in the cloud.
           </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 text-red-500 text-sm rounded-lg flex items-center gap-2 animate-pulse font-bold">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
             {isSignUp && (
               <div className="relative group animate-fade-in">
                 <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                 <input 
                   type="text" 
                   value={name}
                   onChange={(e) => setName(e.target.value)}
                   placeholder="Your Name"
                   required={isSignUp}
                   className="w-full bg-white/50 dark:bg-zinc-800/50 border-2 border-zinc-200 dark:border-zinc-700 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-lavender-400 font-marker text-lg transition-all"
                 />
               </div>
             )}

             <div className="relative group">
               <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
               <input 
                 type="email" 
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 placeholder="Email"
                 required
                 className="w-full bg-white/50 dark:bg-zinc-800/50 border-2 border-zinc-200 dark:border-zinc-700 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-lavender-400 font-marker text-lg transition-all"
               />
             </div>

             <div className="relative group">
               <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
               <input 
                 type="password" 
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 placeholder="Password"
                 required
                 className="w-full bg-white/50 dark:bg-zinc-800/50 border-2 border-zinc-200 dark:border-zinc-700 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-lavender-400 font-marker text-lg transition-all"
               />
             </div>

             <button 
               type="submit"
               disabled={isLoading}
               className="w-full bg-zinc-800 dark:bg-white text-white dark:text-zinc-900 py-4 rounded-xl font-bold hover:scale-[1.02] transition-transform shadow-lg shadow-zinc-500/20 flex items-center justify-center gap-2 mt-4 text-xl font-handwriting tracking-wide disabled:opacity-70 disabled:cursor-not-allowed"
             >
               {isLoading ? (
                 <>
                   <Loader2 className="w-5 h-5 animate-spin" /> Connecting...
                 </>
               ) : (
                 <>
                   {isSignUp ? 'Create Account' : 'Access Journal'}
                   <ArrowRight className="w-5 h-5" />
                 </>
               )}
             </button>
        </form>

        <div className="mt-6 text-center">
            <button 
              onClick={() => { setIsSignUp(!isSignUp); }}
              className="text-base text-zinc-500 hover:text-lavender-600 dark:hover:text-lavender-400 font-medium transition-colors font-marker"
            >
              {isSignUp ? 'Already registered? Sign In' : "New here? Create Profile"}
            </button>
        </div>
      </div>
    </div>
  );
};
export default Login;