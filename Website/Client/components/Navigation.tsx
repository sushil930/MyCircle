import React from 'react';
import { Home, PlusSquare, MessageSquare, User as UserIcon, MapPin, Bell } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { MOCK_NOTIFICATIONS } from '../constants';

export const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useCurrentUser();

  const isActive = (path: string) => location.pathname === path;

  // Simple unread count for the notification badge
  const unreadCount = MOCK_NOTIFICATIONS.filter(n => !n.isRead).length;

  const navItems = [
    { icon: Home, label: 'Home', path: '/feed' },
    { icon: Bell, label: 'Activity', path: '/notifications', badge: unreadCount > 0 },
    { icon: PlusSquare, label: 'Post', path: '/create' },
    { icon: MessageSquare, label: 'Chat', path: '/messages' },
    { icon: UserIcon, label: 'Profile', path: '/profile' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed top-0 left-0 h-screen w-64 bg-white border-r border-brand-sand z-50 flex-col p-6 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        {/* Logo */}
        <div className="flex items-center gap-3 px-2 mb-10 cursor-pointer" onClick={() => navigate('/feed')}>
          <div className="w-10 h-10 bg-brand-dark rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-dark/20">
             <div className="w-5 h-5 border-2 border-brand-cream rounded-full"></div>
          </div>
          <span className="text-2xl font-serif font-bold text-brand-dark tracking-tight">MyCircle</span>
        </div>

        {/* Nav Items */}
        <div className="flex flex-col gap-2 flex-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive(item.path) 
                  ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/20' 
                  : 'text-brand-slate hover:bg-gray-50 hover:text-brand-dark'
              }`}
            >
              <div className="relative">
                <item.icon size={22} strokeWidth={isActive(item.path) ? 2.5 : 2} className={isActive(item.path) ? 'text-white' : 'text-gray-400 group-hover:text-brand-dark'} />
                {item.badge && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </div>
              <span className="tracking-wide">{item.label}</span>
            </button>
          ))}
        </div>

        {/* User Profile Widget */}
        <div className="mt-auto pt-6 border-t border-gray-100">
           <div 
             onClick={() => navigate('/profile')}
             className="bg-brand-cream/50 p-3 rounded-2xl flex items-center gap-3 border border-brand-sand/50 cursor-pointer hover:bg-brand-cream transition-colors"
           >
              <div className="w-10 h-10 rounded-full overflow-hidden border border-white shadow-sm flex-shrink-0">
                  <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-brand-dark truncate">{user.name}</p>
                  <div className="flex items-center gap-1 text-xs text-brand-slate">
                      <MapPin size={10} />
                      <span className="truncate">{user.neighborhood}</span>
                  </div>
              </div>
           </div>
        </div>
      </aside>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-brand-sand z-50 pb-safe">
        <div className="flex justify-around items-center py-3">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 transition-all duration-200 ${
                isActive(item.path) ? 'text-brand-primary' : 'text-gray-400'
              }`}
            >
              {item.label === 'Profile' ? (
                 <div className={`
                    w-7 h-7 rounded-full overflow-hidden transition-all duration-300
                    ${isActive(item.path) 
                      ? 'border-2 border-brand-primary ring-2 ring-brand-primary/20 shadow-sm' 
                      : 'border border-gray-200 opacity-90'
                    }
                 `}>
                   <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                 </div>
              ) : (
                 <div className="relative">
                     <item.icon size={24} strokeWidth={isActive(item.path) ? 2.5 : 2} />
                     {item.badge && (
                        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                     )}
                 </div>
              )}
              <span className={`text-[10px] font-medium transition-colors ${isActive(item.path) ? 'font-bold' : ''}`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
};