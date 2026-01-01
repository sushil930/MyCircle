import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES, MOCK_LISTINGS } from '../constants';
import { ListingCard } from '../components/ListingCard';
import { SkeletonListingCard } from '../components/SkeletonListingCard';
import { SlidersHorizontal, MapPin, Search, X } from 'lucide-react';
import { Category } from '../types';
import { useSavedListings } from '../hooks/useSavedListings';
import { useToast } from '../contexts/ToastContext';
import { useCurrentUser } from '../hooks/useCurrentUser';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxDistance, setMaxDistance] = useState(50);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { isSaved, toggleSave } = useSavedListings();
  const { showToast } = useToast();
  const { user } = useCurrentUser();

  // Simulate data fetching
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // 1.5 second delay to show skeleton
    return () => clearTimeout(timer);
  }, []);

  const filteredListings = useMemo(() => {
    return MOCK_LISTINGS.filter(item => {
      const matchesCategory = selectedCategory === 'All' || 
                              (selectedCategory === 'Marketplace' && item.category === 'Marketplace') || 
                              item.category === selectedCategory;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDistance = item.distance <= maxDistance;

      return matchesCategory && matchesSearch && matchesDistance;
    });
  }, [selectedCategory, searchQuery, maxDistance]);

  const handleToggleSave = (id: string) => {
    const wasSaved = isSaved(id);
    toggleSave(id);
    showToast(wasSaved ? "Removed from favorites" : "Added to favorites", wasSaved ? 'info' : 'success');
  };

  return (
    <>
      <div className="min-h-screen pt-4 pb-24 md:pt-10 px-4 md:px-8 max-w-7xl mx-auto">
        
        {/* Hero / Welcome */}
        <header className="mb-8 md:mb-10 mt-2 md:mt-0">
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-brand-dark mb-4">
            Welcome back, {user.name}.
          </h1>
          <p className="text-brand-slate max-w-xl text-lg font-light">
            Discover what's happening in <span className="font-medium text-brand-primary border-b border-brand-primary/30">Maplewood District</span> today.
          </p>
        </header>

        {/* Controls */}
        <div className="sticky top-0 z-40 bg-brand-cream/95 backdrop-blur-xl py-4 -mx-4 px-4 md:-mx-8 md:px-8 mb-6 border-b border-brand-sand transition-all shadow-sm">
          <div className="flex flex-col">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center z-10">
              
              {/* Categories */}
              <div className="w-full md:w-auto overflow-x-auto no-scrollbar">
                <div className="flex gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.label}
                      onClick={() => setSelectedCategory(cat.value === 'Marketplace' && cat.label !== 'All' ? 'Marketplace' : cat.value === 'Marketplace' ? 'All' : cat.value)}
                      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                        (selectedCategory === cat.value && cat.label !== 'All') || (selectedCategory === 'All' && cat.label === 'All')
                          ? 'bg-brand-dark text-white border-brand-dark shadow-md'
                          : 'bg-white text-brand-slate border-gray-200 hover:border-brand-primary/50'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filters & Search */}
              <div className="flex w-full md:w-auto gap-3">
                <div className="relative flex-1 md:w-64">
                  <input 
                      type="text" 
                      placeholder="Search your circle..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary bg-white text-sm"
                  />
                  <div className="absolute right-3 top-2.5 text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                  </div>
                </div>
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-2 rounded-full border transition-colors ${showFilters ? 'bg-brand-dark text-white border-brand-dark shadow-inner' : 'bg-white border-gray-200 text-brand-slate hover:bg-gray-50'}`}
                >
                  {showFilters ? <X size={20} /> : <SlidersHorizontal size={20} />}
                </button>
              </div>
            </div>

            {/* Expanded Filter Panel (Smooth Animation) */}
            <div className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                showFilters ? 'max-h-80 opacity-100 mt-4 translate-y-0' : 'max-h-0 opacity-0 mt-0 -translate-y-2'
            }`}>
              <div className="bg-white rounded-2xl border border-brand-sand shadow-lg p-6">
                <div className="max-w-md mx-auto">
                   <div className="flex justify-between items-end mb-6">
                      <div>
                        <label className="text-base font-bold text-brand-dark flex items-center gap-2 mb-1">
                          <MapPin size={18} className="text-brand-primary" />
                          Distance Radius
                        </label>
                        <p className="text-xs text-brand-slate">Limit search to your immediate neighborhood.</p>
                      </div>
                      <div className="bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-lg">
                        <span className="text-xl font-bold">{maxDistance}</span>
                        <span className="text-xs font-medium ml-1">mi</span>
                      </div>
                   </div>

                   <div className="relative pt-2 pb-4 px-2">
                      <input
                        type="range"
                        min="1"
                        max="50"
                        step="1"
                        value={maxDistance}
                        onChange={(e) => setMaxDistance(parseInt(e.target.value))}
                        className="w-full h-3 bg-brand-sand rounded-full appearance-none cursor-pointer accent-brand-primary hover:accent-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
                      />

                      <div className="flex justify-between mt-3 text-brand-slate">
                        <div className="flex flex-col items-center">
                           <div className="h-1.5 w-px bg-gray-300 mb-1"></div>
                           <span className="text-xs font-semibold">1 mi</span>
                        </div>
                         <div className="flex flex-col items-center">
                           <div className="h-1.5 w-px bg-gray-300 mb-1"></div>
                           <span className="text-xs font-semibold">25 mi</span>
                        </div>
                         <div className="flex flex-col items-center">
                           <div className="h-1.5 w-px bg-gray-300 mb-1"></div>
                           <span className="text-xs font-semibold">50 mi</span>
                        </div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {[...Array(8)].map((_, i) => (
                <SkeletonListingCard key={i} />
              ))}
            </div>
        ) : filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredListings.map(listing => (
              <ListingCard 
                key={listing.id} 
                listing={listing} 
                onClick={() => navigate(`/post/${listing.id}`)}
                isSaved={isSaved(listing.id)}
                onToggleSave={() => handleToggleSave(listing.id)}
                currentUserId={user.id}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-brand-accent/30 rounded-full flex items-center justify-center mb-4 text-brand-primary">
              <Search size={32} />
            </div>
            <h3 className="text-xl font-medium text-brand-dark">No findings yet</h3>
            <p className="text-brand-slate max-w-xs mt-2">Try adjusting your radius or filters to see more listings.</p>
            {maxDistance < 50 && (
              <button 
                onClick={() => setMaxDistance(50)}
                className="mt-4 text-sm font-bold text-brand-primary hover:underline"
              >
                Expand radius to 50 miles
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
};