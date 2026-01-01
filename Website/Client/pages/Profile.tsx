import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_LISTINGS, MOCK_USER, CATEGORIES } from '../constants';
import { BadgeCheck, Star, MapPin, Clock, ShieldCheck, Award, Heart, LayoutGrid, Camera, Upload, Trash2, AlertTriangle, X, Save, Pencil, Plus, CheckCircle2, LogOut, MessageSquare } from 'lucide-react';
import { ListingCard } from '../components/ListingCard';
import { EditListingModal } from '../components/EditListingModal';
import { EditProfileModal } from '../components/EditProfileModal';
import { Review, Listing, Category, User } from '../types';
import { useSavedListings } from '../hooks/useSavedListings';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useToast } from '../contexts/ToastContext';

type Tab = 'listings' | 'saved' | 'reviews';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('listings');
  const { user, updateAvatar, updateProfile } = useCurrentUser();
  const [reviews, setReviews] = useState<Review[]>(user.reviews || []);
  
  // State for My Listings to handle deletion and editing
  const [myListings, setMyListings] = useState<Listing[]>([]);
  
  // State for Visual Feedback
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // State for Deletion Modal
  const [itemToDelete, setItemToDelete] = useState<Listing | null>(null);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

  // State for Edit Listing Modal
  const [editingListing, setEditingListing] = useState<Listing | null>(null);

  // State for Edit Profile Modal
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const { savedIds, isSaved, toggleSave } = useSavedListings();
  const { showToast } = useToast();

  // Initialize My Listings with mock data
  useEffect(() => {
    // In a real app, we would fetch by user.id
    // Here we seed it with some mock data if empty
    if (myListings.length === 0) {
      const seedListings = MOCK_LISTINGS.slice(0, 2).map(l => ({ ...l, author: user }));
      setMyListings(seedListings);
    }
  }, [user]);

  const savedListings = useMemo(() => MOCK_LISTINGS.filter(l => savedIds.includes(l.id)), [savedIds]);

  // Dynamic calculations
  const averageRating = useMemo(() => {
    if (reviews.length === 0) return "0";
    const total = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  }, [reviews]);

  // Updated Top Neighbor Criteria: 4.5+ stars AND 10+ reviews
  const isTopNeighbor = parseFloat(averageRating) >= 4.5 && reviews.length >= 10;

  const handleVerifyAddress = () => {
    // Simulate verification process
    const confirmed = window.confirm("MyCircle needs to access your location to verify you live in this neighborhood. Proceed?");
    if (confirmed) {
        updateProfile({ isVerified: true });
        showToast("Success! Address verified. You are now a Verified Resident.", "success");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      updateAvatar(e.target.files[0]);
      showToast("Profile picture updated", "success");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('mycircle_user');
    showToast("You have been logged out.", "info");
    navigate('/signin');
  };

  const handleToggleSave = (id: string) => {
    const wasSaved = isSaved(id);
    toggleSave(id);
    showToast(wasSaved ? "Removed from favorites" : "Added to favorites", wasSaved ? 'info' : 'success');
  };

  // Delete Handlers
  const handleDeleteClick = (listing: Listing) => {
    setItemToDelete(listing);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      setDeletingId(itemToDelete.id);
      
      // Delay removal to allow animation to play
      setTimeout(() => {
        setMyListings(prev => prev.filter(l => l.id !== itemToDelete.id));
        setDeletingId(null);
        setItemToDelete(null);
        showToast("Listing deleted successfully", "success");
      }, 400);
    }
  };

  const handleDeleteAccount = () => {
      // Close all modals
      setShowDeleteAccountModal(false);
      setIsEditingProfile(false);
      
      // Simulate API call
      showToast("Account scheduled for deletion.", "info");
      
      // Redirect
      setTimeout(() => {
          navigate('/');
      }, 1500);
  };

  // Edit Listing Handlers
  const handleEditClick = (listing: Listing) => {
    setEditingListing(listing);
  };

  const handleSaveEdit = (updatedListing: Listing) => {
    setMyListings(prev => prev.map(l => l.id === updatedListing.id ? updatedListing : l));
    setEditingListing(null);
    
    // Visual feedback for update
    setHighlightedId(updatedListing.id);
    setTimeout(() => setHighlightedId(null), 2000);
    
    showToast("Listing updated successfully", "success");
  };

  // Edit Profile Handler
  const handleSaveProfile = (updates: Partial<User>) => {
    updateProfile(updates);
    setIsEditingProfile(false);
    showToast("Profile updated successfully", "success");
  };

  return (
    <>
      <div className="min-h-screen pt-4 pb-24 md:pt-10 px-4 max-w-5xl mx-auto">
        
        {/* Profile Header */}
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-brand-sand mb-8 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden mt-2 md:mt-0">
          
          {/* Top Neighbor Badge Banner */}
          {isTopNeighbor && (
            <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-100 to-transparent pl-8 pr-4 py-2 rounded-bl-3xl flex items-center gap-2 text-amber-800 border-b border-l border-amber-200/50 shadow-sm z-10">
              <Award size={18} className="text-amber-600 fill-amber-600" />
              <div className="flex flex-col">
                  <span className="text-xs font-bold tracking-wide uppercase leading-none">Top Neighbor</span>
                  <span className="text-[9px] font-medium opacity-80 leading-none mt-0.5">Top Rated</span>
              </div>
            </div>
          )}

          <div className="relative group">
            <div className="w-32 h-32 rounded-full p-1 border-4 border-brand-cream shadow-md bg-white">
                <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
            </div>
            
            {/* Upload Button Overlay */}
            <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10">
               <Camera size={24} />
               <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>

            <div className={`absolute bottom-1 right-1 p-1.5 rounded-full border-2 border-white z-20 pointer-events-none ${user.isVerified ? 'bg-blue-500 text-white' : 'bg-gray-400 text-white'}`}>
              <ShieldCheck size={20} />
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-5">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2 flex-wrap">
                <h1 className="text-3xl font-serif font-bold text-brand-dark">{user.name}</h1>
                
                {/* Verified Resident Badge / Button */}
                {user.isVerified ? (
                    <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100/50 shadow-sm" title="Address Verified">
                        <BadgeCheck size={16} className="fill-blue-100 text-blue-600" />
                        <span className="text-xs font-bold uppercase tracking-wide">Verified Resident</span>
                    </div>
                ) : (
                    <button 
                        onClick={handleVerifyAddress}
                        className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs font-bold transition-colors border border-gray-200"
                    >
                        <MapPin size={12} />
                        Verify Address
                    </button>
                )}
              </div>

              <p className="text-brand-slate flex items-center justify-center md:justify-start gap-1.5 text-sm">
                <MapPin size={14} className="text-gray-400" />
                <span className="font-medium">{user.neighborhood}</span> 
                <span className="text-gray-300">•</span> 
                <span className="text-gray-500">Active since {user.joinedDate || '2021'}</span>
              </p>
            </div>

            {/* Enhanced Reputation Stats */}
            <div className="flex items-center justify-center md:justify-start gap-6 divide-x divide-gray-200 bg-brand-cream/30 p-4 rounded-2xl border border-brand-sand/30 inline-flex">
              <div className="flex flex-col items-center md:items-start pr-4">
                  <div className="flex items-center gap-1.5 font-bold text-2xl text-brand-dark">
                    {averageRating} <Star size={20} className="fill-yellow-400 text-yellow-400" />
                  </div>
                  <span className="text-xs font-bold text-brand-slate uppercase tracking-wide opacity-70">Average Rating</span>
              </div>
              <div className="flex flex-col items-center md:items-start pl-6">
                  <div className="flex items-center gap-1.5 font-bold text-2xl text-brand-dark">
                    {reviews.length}
                  </div>
                   <span className="text-xs font-bold text-brand-slate uppercase tracking-wide opacity-70">Total Reviews</span>
              </div>
              <div className="flex flex-col items-center md:items-start pl-6 hidden sm:flex">
                  <div className="flex items-center gap-1.5 font-bold text-2xl text-brand-dark">
                    <Clock size={20} className="text-brand-primary" />
                    &lt;1h
                  </div>
                   <span className="text-xs font-bold text-brand-slate uppercase tracking-wide opacity-70">Response Time</span>
              </div>
            </div>

            <p className="text-gray-600 max-w-lg italic leading-relaxed">
              "{user.bio || "No bio yet... share something about yourself!"}"
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full md:w-auto">
            <button 
              onClick={() => setIsEditingProfile(true)}
              className="w-full md:w-auto px-6 py-2.5 bg-brand-dark text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all"
            >
              Edit Profile
            </button>
            <button 
              onClick={handleLogout}
              className="w-full md:w-auto px-6 py-2.5 bg-white border border-gray-200 text-red-600 rounded-full font-medium hover:bg-red-50 hover:border-red-100 transition-all flex items-center justify-center gap-2"
            >
              <LogOut size={18} />
              Log Out
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-8 mb-6 border-b border-gray-200 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setActiveTab('listings')}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 transition-colors border-b-2 whitespace-nowrap ${activeTab === 'listings' ? 'text-brand-dark border-brand-dark' : 'text-gray-400 border-transparent hover:text-brand-slate'}`}
          >
            <LayoutGrid size={18} />
            My Listings <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full ml-1">{myListings.length}</span>
          </button>
          <button 
            onClick={() => setActiveTab('saved')}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 transition-colors border-b-2 whitespace-nowrap ${activeTab === 'saved' ? 'text-brand-dark border-brand-dark' : 'text-gray-400 border-transparent hover:text-brand-slate'}`}
          >
            <Heart size={18} />
            Saved <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full ml-1">{savedIds.length}</span>
          </button>
          <button 
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 transition-colors border-b-2 whitespace-nowrap ${activeTab === 'reviews' ? 'text-brand-dark border-brand-dark' : 'text-gray-400 border-transparent hover:text-brand-slate'}`}
          >
            <Star size={18} />
            Reviews <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full ml-1">{reviews.length}</span>
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'listings' && (
            <div className="space-y-4 animate-in fade-in duration-300">
                {/* Add New Button */}
                <button 
                    onClick={() => navigate('/create')}
                    className="w-full p-4 bg-white border-2 border-dashed border-brand-sand rounded-2xl flex items-center justify-center gap-2 text-brand-slate font-medium hover:bg-brand-primary/5 hover:border-brand-primary/50 hover:text-brand-primary transition-all group shadow-sm"
                >
                    <div className="w-8 h-8 rounded-full bg-brand-sand/50 text-brand-slate group-hover:bg-brand-primary group-hover:text-white flex items-center justify-center transition-colors">
                      <Plus size={18} />
                    </div>
                    <span>Create New Listing</span>
                </button>

                {myListings.length > 0 ? (
                  myListings.map(listing => (
                    <div 
                        key={listing.id}
                        onClick={() => navigate(`/post/${listing.id}`)}
                        className={`
                          bg-white rounded-2xl p-3 border transition-all duration-500 ease-in-out flex gap-4 cursor-pointer hover:shadow-md
                          ${deletingId === listing.id ? 'opacity-0 translate-x-10 pointer-events-none' : 'opacity-100 translate-x-0'}
                          ${highlightedId === listing.id ? 'border-brand-primary bg-brand-primary/5 ring-1 ring-brand-primary/10' : 'border-brand-sand hover:border-brand-primary/30'}
                        `}
                    >
                        {/* Small Preview Image */}
                        <div className="w-24 h-24 sm:w-32 sm:h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 relative group">
                          <img src={listing.image} alt={listing.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="font-bold text-brand-dark text-lg truncate pr-2">{listing.title}</h3>
                                <span className="font-bold text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded-lg text-sm whitespace-nowrap">
                                  {typeof listing.price === 'number' ? `$${listing.price}` : listing.price}
                                </span>
                            </div>
                            
                            <p className="text-brand-slate text-sm line-clamp-1 mb-2 font-light">{listing.description}</p>
                            
                            <div className="flex items-center gap-4 text-xs text-gray-400 font-medium">
                              <span className="flex items-center gap-1"><Heart size={12} className={listing.likes > 0 ? "text-red-400 fill-red-400" : ""} /> {listing.likes}</span>
                              <span className="flex items-center gap-1"><Clock size={12} /> {listing.createdAt}</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col justify-center gap-2 border-l border-gray-100 pl-2 sm:pl-4">
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleEditClick(listing); }}
                              className="p-2 text-gray-400 hover:text-brand-primary hover:bg-brand-primary/10 rounded-xl transition-colors"
                              title="Edit Listing"
                            >
                              <Pencil size={18} />
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleDeleteClick(listing); }}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                              title="Delete Listing"
                            >
                              <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 flex flex-col items-center text-center text-gray-400 border-2 border-dashed border-gray-100 rounded-2xl">
                    <p className="font-medium">No active listings.</p>
                    <p className="text-xs mt-1">Share something with your neighbors!</p>
                  </div>
                )}
            </div>
          )}

          {activeTab === 'saved' && (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
               {savedListings.length > 0 ? (
                 savedListings.map(listing => (
                   <ListingCard 
                       key={listing.id} 
                       listing={listing} 
                       onClick={() => navigate(`/post/${listing.id}`)}
                       isSaved={true}
                       onToggleSave={() => handleToggleSave(listing.id)}
                   />
                 ))
               ) : (
                 <div className="col-span-full py-12 flex flex-col items-center text-center text-gray-400">
                   <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                     <Heart size={32} className="text-gray-300" />
                   </div>
                   <p className="font-medium">No saved listings yet.</p>
                   <p className="text-xs mt-1">Items you favorite will appear here.</p>
                 </div>
               )}
             </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4 animate-in fade-in duration-300">
               {reviews.length > 0 ? reviews.map((review) => (
                  <div key={review.id} className="bg-white p-6 rounded-2xl border border-brand-sand hover:shadow-sm transition-all">
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <img src={review.authorAvatar} alt={review.authorName} className="w-10 h-10 rounded-full object-cover border border-gray-100" />
                          <div>
                              <h4 className="text-sm font-bold text-brand-dark leading-none mb-1">{review.authorName}</h4>
                              <span className="text-xs text-gray-400">{review.createdAt}</span>
                          </div>
                        </div>
                        <div className="flex gap-0.5 bg-yellow-50 px-2 py-1 rounded-lg">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={12} 
                              className={`${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} 
                            />
                          ))}
                        </div>
                    </div>
                    <div className="pl-13 ml-0 md:ml-13">
                       <p className="text-brand-slate text-sm leading-relaxed mb-3">"{review.content}"</p>
                       {review.replies && review.replies.length > 0 && (
                          <div className="bg-gray-50 rounded-xl p-3 text-xs border border-gray-100">
                             <div className="flex items-center gap-2 mb-1 text-brand-dark font-bold">
                               <MessageSquare size={12} /> Response:
                             </div>
                             <p className="text-gray-600">{review.replies[0].content}</p>
                          </div>
                       )}
                    </div>
                  </div>
                )) : (
                  <div className="py-12 flex flex-col items-center text-center text-gray-400 border-2 border-dashed border-gray-100 rounded-2xl">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                      <Star size={32} className="text-gray-300" />
                    </div>
                    <p className="font-medium">No reviews yet.</p>
                    <p className="text-xs mt-1">Complete transactions to earn reputation.</p>
                  </div>
                )}
            </div>
          )}
        </div>
      </div>
      
      {/* Delete Confirmation Modal for Listing */}
      {itemToDelete && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200" 
              onClick={() => setItemToDelete(null)} 
            />
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full animate-in zoom-in-95 duration-200 scale-100 opacity-100">
                 <div className="flex flex-col items-center text-center">
                     <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-5 border-4 border-red-50">
                        <Trash2 size={28} />
                     </div>
                     <h3 className="text-xl font-bold text-brand-dark mb-2">Delete Listing?</h3>
                     <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                        Are you sure you want to delete <span className="font-semibold text-brand-dark">"{itemToDelete.title}"</span>? This action cannot be undone.
                     </p>
                     <div className="flex gap-3 w-full">
                        <button 
                            onClick={() => setItemToDelete(null)}
                            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleConfirmDelete}
                            className="flex-1 px-4 py-3 rounded-xl bg-red-600 font-bold text-white hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
                        >
                            Delete
                        </button>
                     </div>
                 </div>
            </div>
        </div>
      )}

      {/* Delete Confirmation Modal for Account */}
      {showDeleteAccountModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center px-4">
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200" 
              onClick={() => setShowDeleteAccountModal(false)} 
            />
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full animate-in zoom-in-95 duration-200 scale-100 opacity-100">
                 <div className="flex flex-col items-center text-center">
                     <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-5 border-4 border-red-50">
                        <AlertTriangle size={28} />
                     </div>
                     <h3 className="text-xl font-bold text-brand-dark mb-2">Delete Account?</h3>
                     <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                        This will permanently delete your profile, reputation score, and all active listings. <br/><span className="font-bold text-red-600">This action cannot be undone.</span>
                     </p>
                     <div className="flex gap-3 w-full">
                        <button 
                            onClick={() => setShowDeleteAccountModal(false)}
                            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleDeleteAccount}
                            className="flex-1 px-4 py-3 rounded-xl bg-red-600 font-bold text-white hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
                        >
                            Confirm Delete
                        </button>
                     </div>
                 </div>
            </div>
        </div>
      )}

      {/* Edit Listing Modal */}
      {editingListing && (
        <EditListingModal 
          listing={editingListing}
          isOpen={!!editingListing}
          onClose={() => setEditingListing(null)}
          onSave={handleSaveEdit}
        />
      )}

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <EditProfileModal 
          user={user}
          isOpen={isEditingProfile}
          onClose={() => setIsEditingProfile(false)}
          onSave={handleSaveProfile}
          onDelete={() => setShowDeleteAccountModal(true)}
        />
      )}
    </>
  );
};