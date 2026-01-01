import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import { ArrowLeft, Mail, Lock, User, MapPin, Loader2, CircleDot } from 'lucide-react';
import { MOCK_USER } from '../constants';

export const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    neighborhood: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Create new session user
      const newUser = {
        ...MOCK_USER,
        name: formData.name,
        neighborhood: formData.neighborhood || 'Maplewood District', // Default if empty
        joinedDate: new Date().getFullYear().toString(),
        isVerified: false // New users start unverified
      };
      
      localStorage.setItem('mycircle_user', JSON.stringify(newUser));
      
      showToast('Welcome to the neighborhood! 🎉', 'success');
      navigate('/feed');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white flex flex-row-reverse">
      {/* Right Side - Image Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-primary/20 mix-blend-multiply z-10" />
        <img 
          src="https://images.unsplash.com/photo-1558036117-15db527a94f8?q=80&w=2940&auto=format&fit=crop" 
          alt="Community gathering" 
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
        <div className="relative z-20 flex flex-col justify-between h-full p-16 text-white">
          <div className="flex items-center justify-end gap-2">
            <span className="text-2xl font-serif font-bold">MyCircle</span>
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
               <CircleDot size={20} className="text-white" />
            </div>
          </div>
          
          <div className="max-w-lg ml-auto text-right space-y-6">
            <h2 className="text-4xl font-serif font-bold leading-tight">
              Join 2,400+ neighbors building a better community.
            </h2>
            <div className="flex flex-col items-end gap-2 text-white/80">
               <div className="flex gap-1">
                 {[1,2,3,4,5].map(i => (
                   <div key={i} className="w-2 h-2 rounded-full bg-white opacity-60"></div>
                 ))}
               </div>
               <p className="font-light">Address verification required for full access.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-brand-cream/30">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
          
          {/* Mobile Logo & Header */}
          <div className="text-center lg:text-left">
             <div className="lg:hidden flex justify-center mb-6">
                <div className="w-12 h-12 bg-brand-primary rounded-xl flex items-center justify-center text-white">
                   <CircleDot size={24} />
                </div>
             </div>
             <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark mb-3">Create Account</h1>
             <p className="text-brand-slate">Start connecting with your verified neighbors.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
             
             {/* Name */}
             <div className="space-y-1.5">
                <label className="text-sm font-bold text-brand-dark ml-1">Full Name</label>
                <div className="relative group">
                   <User size={18} className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-brand-primary transition-colors" />
                   <input 
                     type="text" 
                     required
                     value={formData.name}
                     onChange={(e) => setFormData({...formData, name: e.target.value})}
                     placeholder="Jane Doe"
                     className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                   />
                </div>
             </div>

             {/* Neighborhood */}
             <div className="space-y-1.5">
                <label className="text-sm font-bold text-brand-dark ml-1">Neighborhood</label>
                <div className="relative group">
                   <MapPin size={18} className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-brand-primary transition-colors" />
                   <input 
                     type="text" 
                     required
                     value={formData.neighborhood}
                     onChange={(e) => setFormData({...formData, neighborhood: e.target.value})}
                     placeholder="e.g. Maplewood District"
                     className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                   />
                </div>
             </div>

             {/* Email */}
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

             {/* Password */}
             <div className="space-y-1.5">
                <label className="text-sm font-bold text-brand-dark ml-1">Password</label>
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
                <p className="text-xs text-gray-400 ml-1">Must be at least 8 characters.</p>
             </div>

             <div className="pt-2">
                <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-brand-primary text-white font-bold text-lg py-4 rounded-xl hover:bg-brand-dark transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                {isLoading ? (
                    <>
                    <Loader2 size={20} className="animate-spin" />
                    Creating Account...
                    </>
                ) : 'Join MyCircle'}
                </button>
             </div>
          </form>

          <p className="text-xs text-center text-gray-400 leading-relaxed px-4">
            By joining, you agree to our <a href="#" className="underline hover:text-brand-dark">Terms of Service</a> and <a href="#" className="underline hover:text-brand-dark">Privacy Policy</a>. We verify all addresses to ensure community safety.
          </p>

          <div className="text-center border-t border-gray-200 pt-6">
             <span className="text-brand-slate text-sm">Already a member? </span>
             <Link to="/signin" className="text-brand-primary font-bold hover:underline">
                Sign in here
             </Link>
          </div>

        </div>
      </div>
    </div>
  );
};