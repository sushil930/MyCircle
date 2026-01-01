import React from 'react';
import { MOCK_NOTIFICATIONS } from '../constants';
import { useNavigate } from 'react-router-dom';
import { Heart, Star, CheckCircle, Bell } from 'lucide-react';

export const Notifications: React.FC = () => {
  const navigate = useNavigate();
  
  // Group by date or just plain list for now
  const notifications = MOCK_NOTIFICATIONS;

  return (
    <div className="min-h-screen pt-4 pb-24 md:pt-10 px-4 max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-brand-sand/50 min-h-[600px] mt-2 md:mt-0">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-serif font-bold text-brand-dark">Activity</h1>
                <button className="text-xs font-bold text-brand-primary hover:text-brand-dark transition-colors">
                    Mark all read
                </button>
            </div>

            {notifications.length > 0 ? (
                <div className="space-y-2">
                    {notifications.map((notification) => (
                        <div 
                            key={notification.id}
                            onClick={() => navigate(notification.linkTo)}
                            className={`
                                group flex items-start gap-4 p-4 rounded-2xl cursor-pointer transition-all border border-transparent
                                ${!notification.isRead ? 'bg-brand-primary/5 hover:bg-brand-primary/10' : 'hover:bg-gray-50'}
                            `}
                        >
                            <div className="relative">
                                <img 
                                    src={notification.actor.avatar} 
                                    alt={notification.actor.name} 
                                    className="w-12 h-12 rounded-full object-cover border border-white shadow-sm"
                                />
                                <div className={`
                                    absolute -bottom-1 -right-1 p-1 rounded-full border-2 border-white text-white shadow-sm
                                    ${notification.type === 'like' ? 'bg-red-500' : 'bg-amber-400'}
                                `}>
                                    {notification.type === 'like' ? <Heart size={10} fill="currentColor" /> : <Star size={10} fill="currentColor" />}
                                </div>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <p className="text-brand-dark text-sm leading-relaxed">
                                    <span className="font-bold">{notification.actor.name}</span> {notification.content}
                                </p>
                                <span className="text-xs text-gray-400 font-medium mt-1 block">
                                    {notification.timestamp}
                                </span>
                            </div>

                            {!notification.isRead && (
                                <div className="self-center">
                                    <div className="w-2.5 h-2.5 bg-brand-primary rounded-full"></div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full py-20 text-gray-400">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <Bell size={32} className="text-gray-300" />
                    </div>
                    <p className="font-medium">No new activity</p>
                    <p className="text-xs">When neighbors interact with you, it will show up here.</p>
                </div>
            )}
        </div>
    </div>
  );
};