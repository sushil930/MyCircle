import React, { useEffect, useState } from 'react';
import { X, MapPin, MessageSquare, Heart, Share2, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { Listing } from '../types';
import { useToast } from '../contexts/ToastContext';

interface ListingModalProps {
  listing: Listing | null;
  isOpen: boolean;
  onClose: () => void;
  isSaved?: boolean;
  onToggleSave?: () => void;
}

export const ListingModal: React.FC<ListingModalProps> = ({ listing, isOpen, onClose, isSaved, onToggleSave }) => {
  const { showToast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Reset image index when listing changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, listing]);

  if (!isOpen || !listing) return null;

  const images = listing.images && listing.images.length > 0 ? listing.images : [listing.image];
  const hasMultipleImages = images.length > 1;

  const handleMessageSeller = () => {
    showToast(`Message sent to ${listing.author.name}!`, 'success');
  };

  const handleShare = () => {
     showToast("Link copied to clipboard", "info");
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button (Mobile) */}
        <button 
          onClick={onClose}
          className="md:hidden absolute top-4 right-4 z-20 bg-white/90 p-2 rounded-full shadow-sm text-gray-700"
        >
          <X size={20} />
        </button>

        {/* Image Section */}
        <div className="w-full md:w-1/2 h-64 md:h-auto bg-gray-100 relative group select-none">
          <img 
            src={images[currentImageIndex]} 
            alt={listing.title} 
            className="w-full h-full object-cover transition-all duration-300"
          />
          
          {/* Carousel Navigation */}
          {hasMultipleImages && (
            <>
              <button 
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full text-white transition-all shadow-sm z-10"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full text-white transition-all shadow-sm z-10"
              >
                <ChevronRight size={24} />
              </button>
              
              {/* Counter/Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-medium tracking-wider">
                 {currentImageIndex + 1} / {images.length}
              </div>
            </>
          )}

          <div className="absolute top-4 left-4 flex gap-2">
            <span className="bg-brand-dark/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium tracking-wide uppercase">
              {listing.category}
            </span>
          </div>
        </div>

        {/* Details Section */}
        <div className="w-full md:w-1/2 flex flex-col h-full overflow-y-auto bg-white">
          <div className="p-6 md:p-8 flex-1">
            
            {/* Header */}
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-brand-dark leading-tight pr-8">
                {listing.title}
              </h2>
              <button 
                onClick={onClose}
                className="hidden md:block text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Price & Location */}
            <div className="flex items-center gap-4 mb-6 text-sm">
              <span className="text-2xl font-bold text-brand-primary">
                {typeof listing.price === 'number' ? `$${listing.price}` : listing.price}
              </span>
              <div className="h-4 w-px bg-gray-200" />
              <div className="flex items-center gap-1 text-gray-500">
                <MapPin size={16} />
                <span>{listing.distance} miles away</span>
              </div>
              <div className="h-4 w-px bg-gray-200" />
              <span className="text-gray-400">{listing.createdAt}</span>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-sm font-bold text-brand-dark uppercase tracking-wider mb-2">Description</h3>
              <p className="text-brand-slate leading-relaxed whitespace-pre-line">
                {listing.description}
                {listing.description.length < 100 && "\n\nIdeally looking for a quick transaction. Please feel free to reach out if you have any questions or want to see more photos!"}
              </p>
            </div>

            {/* Author Card */}
            <div className="bg-brand-cream rounded-2xl p-4 border border-brand-sand/50 mb-8">
              <div className="flex items-center gap-4">
                <div className="relative">
                   <img src={listing.author.avatar} alt={listing.author.name} className="w-12 h-12 rounded-full object-cover" />
                   {listing.author.isVerified && (
                     <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                       <ShieldCheck size={14} className="text-brand-primary fill-brand-accent" />
                     </div>
                   )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-brand-dark">{listing.author.name}</span>
                    <span className="flex items-center text-xs text-brand-primary bg-brand-primary/10 px-1.5 py-0.5 rounded ml-2">
                       ★ {listing.author.rating}
                    </span>
                  </div>
                  <span className="text-xs text-brand-slate block">{listing.author.neighborhood}</span>
                </div>
                <button className="text-xs font-medium text-brand-primary border border-brand-primary px-3 py-1.5 rounded-full hover:bg-brand-primary hover:text-white transition-colors">
                  View Profile
                </button>
              </div>
            </div>
          </div>

          {/* Sticky Footer Actions */}
          <div className="p-4 md:p-6 border-t border-gray-100 bg-white sticky bottom-0 flex gap-3 z-10">
            <button 
              onClick={handleMessageSeller}
              className="flex-1 bg-brand-primary text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-brand-primary/25 hover:bg-brand-dark transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare size={18} />
              Message Seller
            </button>
            <button 
              onClick={onToggleSave}
              className={`p-3.5 rounded-xl border transition-all ${isSaved ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              <Heart size={20} className={isSaved ? "fill-current" : ""} />
            </button>
            <button 
              onClick={handleShare}
              className="p-3.5 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Share2 size={20} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};