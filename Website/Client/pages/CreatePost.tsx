import React, { useState, useEffect } from 'react';
import { 
  Camera, Sparkles, Loader2, X, Upload, 
  ChevronLeft, ChevronRight, Plus, Trash2, 
  ShoppingBag, Key, RefreshCw, Briefcase, Heart,
  DollarSign, MapPin, Eye
} from 'lucide-react';
import { CATEGORIES } from '../constants';
import { generateListingDescription } from '../services/geminiService';
import { Category, User } from '../types';
import { useToast } from '../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../hooks/useCurrentUser';

type ListingType = 'sell' | 'rent' | 'barter' | 'service' | 'give';

export const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useCurrentUser();
  
  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('Marketplace');
  const [listingType, setListingType] = useState<ListingType>('sell');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Images State
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);

  // Auto-switch category based on listing type
  useEffect(() => {
    switch (listingType) {
        case 'sell':
            setCategory('Marketplace');
            break;
        case 'rent':
            setCategory('Rentals');
            break;
        case 'barter':
            setCategory('Barter');
            break;
        case 'service':
            setCategory('Services');
            break;
        case 'give':
            setCategory('Free');
            break;
    }
  }, [listingType]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files) as File[];
      const newImages: string[] = [];
      let processed = 0;

      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            newImages.push(reader.result);
          }
          processed++;
          if (processed === files.length) {
            setPreviewImages(prev => [...prev, ...newImages]);
            if (previewImages.length === 0) setCurrentPreviewIndex(0);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setPreviewImages(prev => {
        const newImages = prev.filter((_, i) => i !== index);
        if (currentPreviewIndex >= newImages.length) {
            setCurrentPreviewIndex(Math.max(0, newImages.length - 1));
        }
        return newImages;
    });
  };

  const handleAIMagic = async () => {
    if (!title) {
        showToast("Please enter a title first", "error");
        return;
    }
    setIsGenerating(true);
    
    let keyFeatures = '';
    if (listingType === 'give') keyFeatures = 'Free item';
    else if (listingType === 'barter') keyFeatures = 'Open to trade/barter';
    else keyFeatures = `Price: ${price}`;
    
    keyFeatures += '. Condition: Good.';
    
    const firstImage = previewImages.length > 0 ? previewImages[0] : null;
    const generated = await generateListingDescription(title, category, keyFeatures, firstImage);
    
    setDescription(generated);
    setIsGenerating(false);
    showToast("Description generated!", "success");
  };

  const handlePost = () => {
      const needsPrice = ['sell', 'rent', 'service'].includes(listingType);
      
      if (!title || !description || (needsPrice && !price)) {
          showToast("Please fill in all required fields", "error");
          return;
      }
      showToast("Listing published to your circle!", "success");
      setTimeout(() => navigate('/feed'), 1500);
  };

  // Render a Preview Card that looks like the real feed
  const PreviewCard = () => {
    const displayPrice = () => {
        if (listingType === 'give') return 'Free';
        if (listingType === 'barter') return 'Barter';
        if (!price) return '$0';
        return `$${price}${listingType === 'rent' ? '/day' : ''}`;
    };

    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-card border border-brand-sand transform transition-all hover:shadow-soft">
            <div className="relative aspect-[4/3] bg-gray-100 flex items-center justify-center overflow-hidden">
                {previewImages.length > 0 ? (
                    <img src={previewImages[0]} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                    <div className="text-gray-300 flex flex-col items-center">
                        <Camera size={32} />
                        <span className="text-xs mt-2 font-medium">No image</span>
                    </div>
                )}
                <div className="absolute top-3 left-3 bg-brand-dark/90 backdrop-blur-md px-3 py-1 rounded-full">
                    <span className="text-xs font-medium text-white tracking-wide uppercase">{category}</span>
                </div>
            </div>
            <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-brand-dark text-lg leading-tight line-clamp-1">
                        {title || "Untitled Listing"}
                    </h3>
                    <span className="font-bold text-brand-primary whitespace-nowrap ml-2">
                        {displayPrice()}
                    </span>
                </div>
                <p className="text-brand-slate text-sm line-clamp-2 mb-3 font-light min-h-[40px]">
                    {description || "Your description will appear here..."}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                        <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full object-cover" />
                        <span className="text-xs text-gray-500">{user.name}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                        <MapPin size={12} />
                        <span className="text-xs">0.0mi</span>
                    </div>
                </div>
            </div>
        </div>
    );
  };

  return (
    <div className="min-h-screen pt-4 md:pt-10 pb-24 px-4 bg-brand-cream/30">
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-4 mt-2 md:mt-0">
            <h1 className="text-3xl font-serif font-bold text-brand-dark">Create New Listing</h1>
            <p className="text-brand-slate mt-1">Share an item or service with your neighbors.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            
            {/* LEFT COLUMN - FORM */}
            <div className="lg:col-span-7 space-y-6">
                
                {/* Image Upload Section */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-brand-sand">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-brand-dark">Photos</h2>
                        <span className="text-xs text-gray-400">{previewImages.length}/5 photos</span>
                    </div>
                    
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                        {previewImages.map((img, idx) => (
                            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-gray-100">
                                <img src={img} alt="Upload" className="w-full h-full object-cover" />
                                <button 
                                    onClick={() => removeImage(idx)}
                                    className="absolute top-1 right-1 bg-white/90 p-1.5 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                >
                                    <Trash2 size={14} />
                                </button>
                                {idx === 0 && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] font-bold text-center py-1">Cover</div>
                                )}
                            </div>
                        ))}
                        
                        {previewImages.length < 5 && (
                            <label className="aspect-square rounded-xl border-2 border-dashed border-gray-200 hover:border-brand-primary/50 hover:bg-brand-primary/5 flex flex-col items-center justify-center cursor-pointer transition-all group">
                                <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-white group-hover:text-brand-primary flex items-center justify-center mb-2 transition-colors text-gray-400">
                                    <Upload size={20} />
                                </div>
                                <span className="text-xs font-medium text-gray-400 group-hover:text-brand-primary">Add Photo</span>
                                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                            </label>
                        )}
                    </div>
                </div>

                {/* Details Section */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-brand-sand space-y-6">
                    <h2 className="text-lg font-bold text-brand-dark">Details</h2>

                    <div>
                        <label className="block text-sm font-semibold text-brand-dark mb-2">Listing Title</label>
                        <input 
                            type="text" 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Vintage Leather Armchair"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none text-base transition-all placeholder:text-gray-300"
                        />
                    </div>

                    {/* Listing Type Selector */}
                    <div>
                        <label className="block text-sm font-semibold text-brand-dark mb-3">Listing Type</label>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                            {[
                                { id: 'sell', label: 'Sell', icon: DollarSign },
                                { id: 'rent', label: 'Rent', icon: Key },
                                { id: 'service', label: 'Service', icon: Briefcase },
                                { id: 'barter', label: 'Barter', icon: RefreshCw },
                                { id: 'give', label: 'Give', icon: Heart },
                            ].map((type) => {
                                const Icon = type.icon;
                                const isSelected = listingType === type.id;
                                return (
                                    <button
                                        key={type.id}
                                        onClick={() => setListingType(type.id as ListingType)}
                                        className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                                            isSelected 
                                            ? 'bg-brand-dark text-white border-brand-dark shadow-md' 
                                            : 'bg-white text-gray-500 border-gray-200 hover:border-brand-primary/30 hover:bg-gray-50'
                                        }`}
                                    >
                                        <Icon size={20} className="mb-1.5" />
                                        <span className="text-xs font-bold">{type.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Price Input (Conditional) */}
                    {(listingType === 'sell' || listingType === 'rent' || listingType === 'service') && (
                        <div>
                            <label className="block text-sm font-semibold text-brand-dark mb-2">
                                {listingType === 'rent' ? 'Daily Rate' : listingType === 'service' ? 'Price / Rate' : 'Price'}
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-serif italic text-lg">$</span>
                                <input 
                                    type="number" 
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none text-lg font-medium"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Description Section */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-brand-sand">
                    <div className="flex justify-between items-center mb-3">
                        <label className="text-lg font-bold text-brand-dark">Description</label>
                        <button 
                            onClick={handleAIMagic}
                            disabled={!title || isGenerating}
                            className="group flex items-center gap-2 bg-gradient-to-r from-violet-100 to-fuchsia-100 hover:from-violet-200 hover:to-fuchsia-200 text-violet-700 px-3 py-1.5 rounded-full text-xs font-bold transition-all disabled:opacity-50 border border-violet-200/50"
                        >
                            {isGenerating ? (
                                <Loader2 size={14} className="animate-spin" />
                            ) : (
                                <Sparkles size={14} className="group-hover:scale-110 transition-transform" />
                            )}
                            {isGenerating ? 'Writing...' : 'AI Magic Write'}
                        </button>
                    </div>
                    <textarea 
                        rows={6}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Tell your neighbors about the condition, history, and pickup details..."
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none text-sm resize-none"
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-2">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="flex-1 py-3.5 rounded-xl border border-gray-300 text-brand-slate font-bold hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handlePost}
                        className="flex-[2] py-3.5 rounded-xl bg-brand-primary text-white font-bold hover:bg-brand-dark shadow-lg shadow-brand-primary/20 transition-all transform active:scale-95 flex items-center justify-center gap-2"
                    >
                        Publish Listing <ChevronRight size={18} />
                    </button>
                </div>

            </div>

            {/* RIGHT COLUMN - PREVIEW */}
            <div className="lg:col-span-5">
                <div className="sticky top-28 space-y-6">
                    <div className="flex items-center gap-2 text-brand-slate/60 text-sm font-bold uppercase tracking-wider px-2">
                        <Eye size={14} /> Live Preview
                    </div>
                    
                    {/* The Preview Card */}
                    <PreviewCard />

                    {/* Guidelines Box */}
                    <div className="bg-brand-primary/5 rounded-2xl p-6 border border-brand-primary/10">
                        <h4 className="font-bold text-brand-dark mb-2 flex items-center gap-2">
                            <Heart size={16} className="text-brand-primary fill-brand-primary" />
                            Good Neighbor Tips
                        </h4>
                        <ul className="text-sm text-brand-slate space-y-2 list-disc list-inside">
                            <li>Be honest about condition (scratches, wear).</li>
                            <li>Respond quickly to inquiries.</li>
                            <li>Meet in safe, public spots for high-value items.</li>
                        </ul>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};