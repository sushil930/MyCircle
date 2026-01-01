import React, { useState, useEffect } from 'react';
import { X, Save, User, MapPin, AlignLeft, Trash2, AlertTriangle } from 'lucide-react';
import { User as UserType } from '../types';

interface EditProfileModalProps {
  user: UserType;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: Partial<UserType>) => void;
  onDelete?: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ user, isOpen, onClose, onSave, onDelete }) => {
  const [name, setName] = useState(user.name);
  const [neighborhood, setNeighborhood] = useState(user.neighborhood);
  const [bio, setBio] = useState(user.bio || '');

  useEffect(() => {
    if (isOpen) {
      setName(user.name);
      setNeighborhood(user.neighborhood);
      setBio(user.bio || '');
    }
  }, [user, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, neighborhood, bio });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200" 
        onClick={onClose} 
      />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in slide-in-from-bottom-8 zoom-in-95 duration-300">
        
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-xl font-serif font-bold text-brand-dark">Edit Profile</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-5">
            
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-brand-dark flex items-center gap-2">
                <User size={16} className="text-brand-primary" />
                Full Name
              </label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none text-sm transition-all"
                placeholder="Your name"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-brand-dark flex items-center gap-2">
                <MapPin size={16} className="text-brand-primary" />
                Neighborhood
              </label>
              <input 
                type="text" 
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none text-sm transition-all"
                placeholder="E.g. Maplewood District"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-brand-dark flex items-center gap-2">
                <AlignLeft size={16} className="text-brand-primary" />
                Bio
              </label>
              <textarea 
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none text-sm resize-none transition-all"
                placeholder="Share a little about yourself..."
              />
            </div>

            {onDelete && (
                <div className="pt-4 border-t border-gray-100">
                    <button 
                        type="button"
                        onClick={onDelete}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-100 bg-red-50 text-red-600 font-bold text-sm hover:bg-red-100 transition-colors"
                    >
                        <Trash2 size={16} />
                        Delete Account
                    </button>
                    <p className="text-[10px] text-gray-400 text-center mt-2">
                        Permanently remove your profile and all listings.
                    </p>
                </div>
            )}

          </div>

          <div className="p-5 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-brand-primary hover:bg-brand-dark shadow-lg shadow-brand-primary/20 transition-all flex items-center gap-2"
            >
              <Save size={16} />
              Save Changes
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};