import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import { ArrowLeft, Mail, Lock, Loader2, CircleDot } from 'lucide-react';
import { MOCK_USER } from '../constants';

export const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // For mock purposes, we just persist a user session
      // In a real app, this would validate credentials
      const sessionUser = {
        ...MOCK_USER,
        name: formData.email.split('@')[0] || 'Neighbor', // Mock name from email
      };
      
      localStorage.setItem('mycircle_user', JSON.stringify(sessionUser));
      
      showToast('Welcome back, neighbor!', 'success');
      navigate('/feed');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Image Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-dark/20 mix-blend-multiply z-10" />
        <img 
          src="https://images.unsplash.com/photo-1572297794908-3221c4059e7f?q=80&w=2835&auto=format&fit=crop" 
          alt="Neighborhood street" 
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="relative z-20 flex flex-col justify-between h-full p-16 text-white">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
               <CircleDot size={20} className="text-white" />
            </div>
            <span className="text-2xl font-serif font-bold">MyCircle</span>
          </div>
          
          <div className="max-w-md space-y-6">
            <blockquote className="text-3xl font-serif leading-tight">
              "It feels good to know exactly who you're borrowing a ladder from. Trust makes everything simpler."
            </blockquote>
            <div className="flex items-center gap-4">
               <img src="https://picsum.photos/seed/user4/100/100" alt="User" className="w-12 h-12 rounded-full border-2 border-white/20" />
               <div>
                  <div className="font-bold">Emily Rodriguez</div>
                  <div className="text-white/60 text-sm">Member since 2023</div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-brand-cream/30">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
          
          {/* Mobile Logo & Header */}
          <div className="text-center lg:text-left">
             <div className="lg:hidden flex justify-center mb-6">
                <div className="w-12 h-12 bg-brand-dark rounded-xl flex items-center justify-center text-white">
                   <CircleDot size={24} />
                </div>
             </div>
             <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark mb-3">Welcome back</h1>
             <p className="text-brand-slate">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
             <div className="space-y-4">
                <div className="space-y-1.5">
                   <label className="text-sm font-bold text-brand-dark ml-1">Email</label>
                   <div className="relative group">
                      <Mail size={18} className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-brand-primary transition-colors" />
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="neighbor@example.com"
                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                      />
                   </div>
                </div>

                <div className="space-y-1.5">
                   <div className="flex justify-between items-center ml-1">
                      <label className="text-sm font-bold text-brand-dark">Password</label>
                      <button type="button" className="text-xs font-semibold text-brand-primary hover:text-brand-dark transition-colors">
                        Forgot password?
                      </button>
                   </div>
                   <div className="relative group">
                      <Lock size={18} className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-brand-primary transition-colors" />
                      <input 
                        type="password" 
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        placeholder="••••••••"
                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                      />
                   </div>
                </div>
             </div>

             <button 
               type="submit" 
               disabled={isLoading}
               className="w-full bg-brand-dark text-white font-bold text-lg py-4 rounded-xl hover:bg-brand-primary transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
             >
               {isLoading ? (
                 <>
                   <Loader2 size={20} className="animate-spin" />
                   Signing in...
                 </>
               ) : 'Sign In'}
             </button>
          </form>

          <div className="relative">
             <div className="absolute inset-0 flex items-center">
               <div className="w-full border-t border-gray-200"></div>
             </div>
             <div className="relative flex justify-center text-sm">
               <span className="px-2 bg-[#FAF9F6] text-gray-400">or continue with</span>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <button type="button" className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-white hover:border-gray-300 transition-all font-semibold text-sm text-brand-dark">
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Google
             </button>
             <button type="button" className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-white hover:border-gray-300 transition-all font-semibold text-sm text-brand-dark">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
                Facebook
             </button>
          </div>

          <div className="text-center pt-4">
             <span className="text-brand-slate text-sm">Don't have an account? </span>
             <Link to="/signup" className="text-brand-primary font-bold hover:underline">
                Join the circle
             </Link>
          </div>

        </div>
      </div>
    </div>
  );
};