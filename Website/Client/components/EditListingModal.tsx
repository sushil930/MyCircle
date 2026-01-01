import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Listing, Category } from '../types';
import { CATEGORIES } from '../constants';

interface EditListingModalProps {
  listing: Listing;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedListing: Listing) => void;
}

export const EditListingModal: React.FC<EditListingModalProps> = ({ listing, isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState(listing.title);
  const [description, setDescription] = useState(listing.description);
  const [price, setPrice] = useState<string | number>(
    listing.price === 'Free' || listing.price === 'Barter' ? '' : listing.price
  );
  const [category, setCategory] = useState<Category>(listing.category);
  const [error, setError] = useState('');

  // Reset state when listing changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setTitle(listing.title);
      setDescription(listing.description);
      setPrice(listing.price === 'Free' || listing.price === 'Barter' ? '' : listing.price);
      setCategory(listing.category);
      setError('');
    }
  }, [listing, isOpen]);

  const handleSave = () => {
    if (!title.trim() || !description.trim()) {
      setError('Title and description are required.');
      return;
    }

    let finalPrice: number | 'Free' | 'Barter' = price === '' ? 0 : Number(price);
    
    // Logic to ensure price matches category
    if (category === 'Free') finalPrice = 'Free';
    else if (category === 'Barter') finalPrice = 'Barter';
    else if (price === '') {
       setError('Please enter a valid price for this category.');
       return;
    }

    onSave({
      ...listing,
      title,
      description,
      category,
      price: finalPrice
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200" 
        onClick={onClose} 
      />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom-8 duration-300">
        
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-xl font-serif font-bold text-brand-dark">Edit Listing</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          
          {/* Image Preview (Read Only) */}
          <div className="relative h-40 rounded-xl overflow-hidden group">
             <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <span className="text-white text-xs font-medium bg-black/50 px-3 py-1 rounded-full backdrop-blur-md">Image cannot be changed</span>
             </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-dark mb-1.5">Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
               <label className="block text-sm font-semibold text-brand-dark mb-1.5">Category</label>
               <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none bg-white text-sm"
               >
                 {CATEGORIES.filter(c => c.label !== 'All').map(c => (
                   <option key={c.value} value={c.value}>{c.label}</option>
                 ))}
               </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-brand-dark mb-1.5">Price</label>
              <div className="relative">
                 <span className="absolute left-3 top-2.5 text-gray-400 text-sm">$</span>
                 <input 
                    type="number" 
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    disabled={category === 'Free' || category === 'Barter'}
                    placeholder={category === 'Free' ? 'Free' : category === 'Barter' ? 'Trade' : '0.00'}
                    className="w-full pl-7 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none text-sm disabled:bg-gray-50 disabled:text-gray-400 transition-colors"
                 />
              </div>
            </div>
          </div>

          <div>
             <label className="block text-sm font-semibold text-brand-dark mb-1.5">Description</label>
             <textarea 
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none resize-none text-sm"
             />
          </div>
          
          {error && (
            <div className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}
        </div>

        <div className="p-5 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
           <button 
             onClick={onClose}
             className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-200 transition-colors"
           >
             Cancel
           </button>
           <button 
             onClick={handleSave}
             className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-brand-primary hover:bg-brand-dark shadow-lg shadow-brand-primary/20 transition-all flex items-center gap-2"
           >
             <Save size={16} />
             Save Changes
           </button>
        </div>

      </div>
    </div>
  );
};
