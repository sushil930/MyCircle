import React, { useState, useEffect } from 'react';
import { Heart, MapPin, BadgeCheck, Trash2, Pencil, ChevronLeft, ChevronRight } from 'lucide-react';
import { Listing } from '../types';

interface ListingCardProps {
  listing: Listing;
  onClick: () => void;
  isSaved?: boolean;
  onToggleSave?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  currentUserId?: string;
}

export const ListingCard: React.FC<ListingCardProps> = ({ 
  listing, 
  onClick, 
  isSaved = false, 
  onToggleSave, 
  onDelete, 
  onEdit,
  currentUserId 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  const isOwner = currentUserId && listing.author.id === currentUserId;
  const images = listing.images && listing.images.length > 0 ? listing.images : [listing.image];
  const hasMultipleImages = images.length > 1;

  useEffect(() => {
    if (!hasMultipleImages || isHovered) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [hasMultipleImages, isHovered, images.length]);

  const handleToggleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAnimating(true);
    onToggleSave?.();
    setTimeout(() => setIsAnimating(false), 300);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div 
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-soft transition-all duration-300 cursor-pointer border border-transparent hover:border-brand-sand transform hover:-translate-y-1"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img 
          src={images[currentImageIndex]} 
          alt={listing.title} 
          className="w-full h-full object-cover transition-transform duration-700"
        />

        {/* Carousel Navigation */}
        {hasMultipleImages && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-sm text-brand-dark opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white z-10"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-sm text-brand-dark opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white z-10"
            >
              <ChevronRight size={16} />
            </button>
            
            {/* Dot Indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {images.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`w-1.5 h-1.5 rounded-full transition-all shadow-sm ${idx === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50'}`} 
                />
              ))}
            </div>
          </>
        )}
        
        <div className="absolute top-3 right-3 flex gap-2 z-20">
          {onEdit && isOwner && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm hover:bg-brand-primary hover:text-white text-gray-500 transition-colors group/edit"
              title="Edit Listing"
            >
              <Pencil size={16} />
            </button>
          )}

          {onDelete && isOwner && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors group/delete"
              title="Delete Listing"
            >
              <Trash2 size={16} />
            </button>
          )}

          <button 
            onClick={handleToggleSaveClick}
            className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm hover:bg-red-50 transition-colors group/heart"
            title="Save Listing"
          >
            <Heart 
              size={16} 
              className={`transition-all duration-300 ${
                isSaved ? "text-red-500 fill-red-500" : "text-gray-600 group-hover/heart:text-red-400"
              } ${
                isAnimating ? "scale-125" : (isSaved ? "scale-110" : "scale-100")
              }`} 
            />
          </button>
        </div>

        <div className="absolute top-3 left-3 bg-brand-dark/90 backdrop-blur-md px-3 py-1 rounded-full z-10">
          <span className="text-xs font-medium text-white tracking-wide uppercase">{listing.category}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-semibold text-brand-dark text-lg leading-tight line-clamp-1">{listing.title}</h3>
          <span className="font-bold text-brand-primary">
            {typeof listing.price === 'number' ? `$${listing.price}` : listing.price}
          </span>
        </div>
        
        <p className="text-brand-slate text-sm line-clamp-2 mb-3 font-light">{listing.description}</p>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <img src={listing.author.avatar} alt={listing.author.name} className="w-6 h-6 rounded-full object-cover" />
            <span className="text-xs text-gray-500 truncate max-w-[80px]">{listing.author.name}</span>
            {listing.author.isVerified && <BadgeCheck size={14} className="text-brand-primary" />}
          </div>
          <div className="flex items-center gap-1 text-gray-400">
            <MapPin size={12} />
            <span className="text-xs">{listing.distance}mi</span>
          </div>
        </div>
      </div>
    </div>
  );
};