import React from 'react';
import { Facebook, Instagram, Twitter, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-dark text-white pt-20 pb-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
           {/* Brand */}
           <div className="col-span-1 md:col-span-1 space-y-6">
              <div className="flex items-center gap-2">
                 <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                   <div className="w-4 h-4 bg-white rounded-full"></div>
                 </div>
                 <span className="text-2xl font-serif font-bold tracking-tight">MyCircle</span>
              </div>
              <p className="text-brand-sand/60 text-sm leading-relaxed max-w-xs">
                Building trust, one handshake at a time. The neighborhood marketplace for the modern community.
              </p>
           </div>

           {/* Links 1 */}
           <div>
              <h4 className="font-bold mb-6 text-brand-accent tracking-wide text-sm uppercase">Company</h4>
              <ul className="space-y-4 text-sm text-brand-sand/70">
                 <li><a href="#/about" className="hover:text-white transition-colors">Our Story</a></li>
                 <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                 <li><a href="#" className="hover:text-white transition-colors">Press Room</a></li>
                 <li><a href="#" className="hover:text-white transition-colors">Impact Report</a></li>
              </ul>
           </div>

           {/* Links 2 */}
           <div>
              <h4 className="font-bold mb-6 text-brand-accent tracking-wide text-sm uppercase">Support</h4>
               <ul className="space-y-4 text-sm text-brand-sand/70">
                 <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                 <li><a href="#" className="hover:text-white transition-colors">Trust & Safety</a></li>
                 <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                 <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
           </div>

           {/* Socials */}
           <div>
              <h4 className="font-bold mb-6 text-brand-accent tracking-wide text-sm uppercase">Connect</h4>
              <div className="flex gap-4">
                 <a href="#" className="bg-white/5 p-3 rounded-full hover:bg-white/20 transition-all hover:-translate-y-1"><Facebook size={20} /></a>
                 <a href="#" className="bg-white/5 p-3 rounded-full hover:bg-white/20 transition-all hover:-translate-y-1"><Instagram size={20} /></a>
                 <a href="#" className="bg-white/5 p-3 rounded-full hover:bg-white/20 transition-all hover:-translate-y-1"><Twitter size={20} /></a>
              </div>
           </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-brand-sand/40 gap-4">
           <span>&copy; {new Date().getFullYear()} MyCircle Inc. All rights reserved.</span>
           <div className="flex gap-6">
             <span>Made with <Heart size={10} className="inline fill-current text-red-500" /> in Maplewood</span>
           </div>
        </div>
      </div>
    </footer>
  );
};