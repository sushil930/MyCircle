import React, { useState, useEffect, useRef } from 'react';
import { MOCK_LISTINGS } from '../constants';
import { Send, ArrowLeft, MoreVertical, Search, Check, CheckCheck } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

// Mock data extension
const INITIAL_CONTACTS = [
  { 
    id: 'u2', 
    name: 'Sarah J.', 
    avatar: MOCK_LISTINGS[0].author.avatar, 
    lastMsg: 'Is the chair still available?', 
    time: '2m', 
    unread: 2, 
    online: true,
    listingContext: MOCK_LISTINGS[0] 
  },
  { 
    id: 'u3', 
    name: 'Mike T.', 
    avatar: MOCK_LISTINGS[1].author.avatar, 
    lastMsg: 'Sounds good, see you then.', 
    time: '1d', 
    unread: 0,
    online: false,
    listingContext: MOCK_LISTINGS[1]
  },
  { 
    id: 'u4', 
    name: 'Emily R.', 
    avatar: MOCK_LISTINGS[2].author.avatar, 
    lastMsg: 'Thanks for the recommendation!', 
    time: '3d', 
    unread: 0,
    online: true
  },
];

interface Message {
  id: string;
  senderId: string; // 'me' or other
  text: string;
  timestamp: string;
  isRead?: boolean;
}

const MOCK_MESSAGES: Record<string, Message[]> = {
  'u2': [
    { id: '1', senderId: 'me', text: 'Hi Sarah, thanks for reaching out!', timestamp: '10:30 AM', isRead: true },
    { id: '2', senderId: 'u2', text: 'Hi! I saw your listing for the vintage chair. Is it still available?', timestamp: '10:32 AM', isRead: false },
    { id: '3', senderId: 'u2', text: 'I can pick it up this weekend if that works.', timestamp: '10:33 AM', isRead: false },
  ],
  'u3': [
     { id: '1', senderId: 'u3', text: 'Hey, about the drill rental...', timestamp: 'Yesterday', isRead: true },
     { id: '2', senderId: 'me', text: 'Yes?', timestamp: 'Yesterday', isRead: true },
     { id: '3', senderId: 'u3', text: 'Sounds good, see you then.', timestamp: 'Yesterday', isRead: true },
  ],
  'u4': [
    { id: '1', senderId: 'me', text: 'Enjoy the new plants!', timestamp: '3 days ago', isRead: true },
    { id: '2', senderId: 'u4', text: 'Thanks for the recommendation!', timestamp: '3 days ago', isRead: true },
  ]
};

export const Messages: React.FC = () => {
  const [contacts, setContacts] = useState(INITIAL_CONTACTS);
  const [activeContactId, setActiveContactId] = useState<string | null>(null); 
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const { showToast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Refs for mobile view detection
  const isMobile = window.innerWidth < 768;

  // Auto-select first contact on desktop if none selected
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && !activeContactId && contacts.length > 0) {
        setActiveContactId(contacts[0].id);
      }
    };
    
    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [contacts, activeContactId]);

  // Mark messages as read when active contact changes
  useEffect(() => {
    if (activeContactId) {
      // 1. Update Badge in Sidebar (Contacts)
      setContacts(prevContacts => 
        prevContacts.map(contact => 
          contact.id === activeContactId && contact.unread > 0
            ? { ...contact, unread: 0 }
            : contact
        )
      );

      // 2. Mark specific messages as read
      setMessages(prevMessages => {
        const chatMessages = prevMessages[activeContactId];
        if (!chatMessages) return prevMessages;

        const hasUnread = chatMessages.some(m => m.senderId !== 'me' && !m.isRead);
        
        if (hasUnread) {
          return {
            ...prevMessages,
            [activeContactId]: chatMessages.map(m => 
              m.senderId !== 'me' ? { ...m, isRead: true } : m
            )
          };
        }
        return prevMessages;
      });
    }
  }, [activeContactId]);

  const activeContact = contacts.find(c => c.id === activeContactId) || contacts[0];
  const currentMessages = activeContactId ? (messages[activeContactId] || []) : [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages, activeContactId]);

  const handleSendMessage = () => {
    if (!messageText.trim() || !activeContactId) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false
    };

    setMessages(prev => ({
      ...prev,
      [activeContactId]: [...(prev[activeContactId] || []), newMessage]
    }));
    
    // Move contact to top of list and update last message
    setContacts(prev => {
        const updatedContacts = prev.map(c => 
            c.id === activeContactId 
            ? { ...c, lastMsg: messageText, time: 'Now' } 
            : c
        );
        // Sort to move active to top (optional, simple implementation)
        return updatedContacts;
    });

    setMessageText('');
  };

  return (
    <div className="fixed inset-0 pt-0 md:pt-0 pb-16 md:pb-0 md:left-64 bg-brand-cream flex justify-center">
       <div className="w-full max-w-7xl mx-auto md:px-6 md:py-4 h-full flex flex-col">
         <div className="bg-white md:rounded-3xl shadow-xl border-x md:border border-brand-sand flex overflow-hidden flex-1 h-full w-full">
           
           {/* Sidebar List */}
           <div className={`
             w-full md:w-96 border-r border-gray-100 flex flex-col bg-white transition-all duration-300
             ${activeContactId ? 'hidden md:flex' : 'flex'}
           `}>
              <div className="p-4 md:p-6 border-b border-gray-100">
                 <h2 className="font-serif font-bold text-2xl text-brand-dark mb-4">Messages</h2>
                 <div className="relative">
                   <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                   <input 
                     type="text" 
                     placeholder="Search messages..." 
                     className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-primary/10 focus:border-brand-primary outline-none text-sm transition-all"
                   />
                 </div>
              </div>

              <div className="overflow-y-auto flex-1 p-2 space-y-1">
                 {contacts.map(c => (
                   <div 
                     key={c.id} 
                     onClick={() => setActiveContactId(c.id)}
                     className={`
                       group p-3 rounded-xl flex gap-3 cursor-pointer transition-all duration-200 border border-transparent
                       ${activeContactId === c.id 
                         ? 'bg-brand-primary/5 border-brand-primary/10' 
                         : 'hover:bg-gray-50'
                       }
                     `}
                   >
                     <div className="relative">
                       <img src={c.avatar} alt={c.name} className="w-12 h-12 rounded-full object-cover border border-gray-100" />
                       {c.online && (
                         <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                       )}
                     </div>
                     <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <div className="flex justify-between items-center mb-0.5">
                          <span className={`font-semibold text-sm truncate ${activeContactId === c.id ? 'text-brand-dark' : 'text-gray-700'}`}>
                            {c.name}
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium">{c.time}</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <p className={`text-xs truncate max-w-[160px] ${c.unread > 0 ? 'text-brand-dark font-semibold' : 'text-gray-500'}`}>
                             {c.lastMsg}
                           </p>
                           {c.unread > 0 && (
                             <span className="min-w-[18px] h-[18px] px-1 bg-brand-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                               {c.unread}
                             </span>
                           )}
                        </div>
                     </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Chat Area */}
           <div className={`
             flex-col flex-1 bg-gray-50/50 relative
             ${activeContactId ? 'flex' : 'hidden md:flex'}
           `}>
              {activeContactId ? (
                <>
                  {/* Chat Header */}
                  <div className="px-4 py-3 md:px-6 md:py-4 bg-white border-b border-gray-100 flex items-center justify-between shadow-sm z-10">
                     <div className="flex items-center gap-3">
                       <button 
                         onClick={() => setActiveContactId(null)}
                         className="md:hidden p-2 -ml-2 text-gray-500 hover:text-brand-dark hover:bg-gray-100 rounded-full transition-colors"
                       >
                         <ArrowLeft size={20} />
                       </button>
                       <img src={activeContact.avatar} alt={activeContact.name} className="w-10 h-10 rounded-full border border-gray-100" />
                       <div>
                         <h3 className="font-bold text-brand-dark text-sm">{activeContact.name}</h3>
                         <span className={`text-xs flex items-center gap-1 ${activeContact.online ? 'text-green-600' : 'text-gray-400'}`}>
                           {activeContact.online ? 'Active now' : 'Offline'}
                         </span>
                       </div>
                     </div>
                     <div className="flex items-center gap-1">
                        <button className="p-2 text-gray-400 hover:text-brand-dark hover:bg-gray-100 rounded-full transition-colors">
                          <MoreVertical size={20} />
                        </button>
                     </div>
                  </div>
                  
                  {/* Context Header (If listing related) */}
                  {activeContact.listingContext && (
                     <div className="px-4 py-2 bg-brand-cream/50 border-b border-brand-sand/50 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                           <span className="text-gray-500">Replying to:</span>
                           <span className="font-bold text-brand-dark">{activeContact.listingContext.title}</span>
                        </div>
                        <button 
                           onClick={() => window.location.hash = `#/post/${activeContact.listingContext.id}`}
                           className="text-brand-primary font-medium hover:underline"
                        >
                           View
                        </button>
                     </div>
                  )}

                  {/* Messages Scroll Area */}
                  <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                     {/* Date Separator */}
                     <div className="flex justify-center">
                        <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-wider">
                          Today
                        </span>
                     </div>

                     {currentMessages.map((msg) => {
                       const isMe = msg.senderId === 'me';
                       return (
                         <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] md:max-w-[65%] group ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                               <div className={`
                                 px-4 py-3 shadow-sm text-sm leading-relaxed
                                 ${isMe 
                                   ? 'bg-brand-primary text-white rounded-2xl rounded-br-sm' 
                                   : 'bg-white text-gray-800 border border-gray-100 rounded-2xl rounded-bl-sm'
                                 }
                               `}>
                                 {msg.text}
                               </div>
                               <div className={`flex items-center gap-1 mt-1 text-[10px] ${isMe ? 'text-brand-primary/70' : 'text-gray-400'}`}>
                                  {msg.timestamp}
                                  {isMe && (
                                    msg.isRead ? <CheckCheck size={12} /> : <Check size={12} />
                                  )}
                               </div>
                            </div>
                         </div>
                       );
                     })}
                     <div ref={messagesEndRef} />
                  </div>

                  {/* Input Area */}
                  <div className="p-4 bg-white border-t border-gray-100">
                     <div className="flex items-end gap-2 bg-gray-50 border border-gray-200 p-2 rounded-2xl focus-within:ring-2 focus-within:ring-brand-primary/10 focus-within:border-brand-primary/50 transition-all shadow-sm">
                        
                        <textarea 
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                          placeholder="Type a message..." 
                          className="flex-1 bg-transparent border-none focus:ring-0 outline-none text-sm min-h-[44px] max-h-32 py-3 px-3 resize-none"
                          rows={1}
                        />
                        
                        <div className="pb-1 pr-1">
                           <button 
                             onClick={handleSendMessage}
                             disabled={!messageText.trim()}
                             className="p-2.5 bg-brand-primary text-white rounded-xl hover:bg-brand-dark shadow-md hover:shadow-lg disabled:opacity-50 disabled:shadow-none transition-all transform active:scale-95"
                           >
                             <Send size={18} className={messageText.trim() ? 'ml-0.5' : ''} />
                           </button>
                        </div>
                     </div>
                  </div>
                </>
              ) : (
                <div className="hidden md:flex flex-col items-center justify-center h-full text-center p-8 bg-gray-50/50">
                   <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-100">
                      <div className="w-10 h-10 border-2 border-brand-primary/20 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-brand-primary rounded-full animate-ping"></div>
                      </div>
                   </div>
                   <h3 className="text-xl font-bold text-brand-dark mb-2">Select a conversation</h3>
                   <p className="text-gray-500 max-w-xs">
                     Choose a neighbor from the list to start chatting or continue a conversation.
                   </p>
                </div>
              )}
           </div>

         </div>
       </div>
    </div>
  );
};