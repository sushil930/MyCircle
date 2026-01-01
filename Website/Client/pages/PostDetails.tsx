import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, Heart, Share2, MapPin, ShieldCheck, 
    MessageSquare, Star, Send, Clock, AlertCircle, CheckCircle, Flag, X, CornerDownRight
} from 'lucide-react';
import { MOCK_LISTINGS } from '../constants';
import { useSavedListings } from '../hooks/useSavedListings';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useToast } from '../contexts/ToastContext';
import { Review, Reply } from '../types';

export const PostDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isSaved, toggleSave } = useSavedListings();
    const { user } = useCurrentUser();
    const { showToast } = useToast();

    const listing = MOCK_LISTINGS.find(l => l.id === id);
    
    // Reviews State
    const [reviews, setReviews] = useState<Review[]>([]);
    const [newComment, setNewComment] = useState('');
    const [newRating, setNewRating] = useState(5);

    // Reply State
    const [replyingToId, setReplyingToId] = useState<string | null>(null);
    const [replyText, setReplyText] = useState('');

    // Report Modal State
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [reportReason, setReportReason] = useState('');

    const REPORT_REASONS = [
        "Inappropriate Content",
        "Scam or Fraud",
        "Duplicate Listing",
        "Item Sold / Unavailable",
        "Wrong Category",
        "Other"
    ];

    useEffect(() => {
        window.scrollTo(0, 0);
        if (listing && listing.reviews) {
            setReviews(listing.reviews);
        }
    }, [listing, id]); // Added id dependency to ensure scroll on route change

    // Calculate Similar Listings
    const similarListings = useMemo(() => {
        if (!listing) return [];
        return MOCK_LISTINGS
            .filter(l => l.category === listing.category && l.id !== listing.id)
            .sort((a, b) => a.distance - b.distance) // Sort by proximity
            .slice(0, 4);
    }, [listing]);

    const hasReviewed = useMemo(() => {
        return reviews.some(r => r.authorId === user.id);
    }, [reviews, user.id]);

    if (!listing) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <AlertCircle size={48} className="text-gray-300 mb-4" />
                <h2 className="text-xl font-bold text-brand-dark">Listing not found</h2>
                <button 
                    onClick={() => navigate('/feed')}
                    className="mt-4 text-brand-primary font-medium hover:underline"
                >
                    Return to Feed
                </button>
            </div>
        );
    }

    const saved = isSaved(listing.id);

    const handleToggleSave = () => {
        toggleSave(listing.id);
        showToast(saved ? "Removed from favorites" : "Added to favorites", saved ? 'info' : 'success');
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        showToast("Link copied to clipboard", "info");
    };

    const handleSubmitReview = () => {
        if (!newComment.trim()) return;

        const review: Review = {
            id: Math.random().toString(36).substr(2, 9),
            authorId: user.id,
            authorName: user.name,
            authorAvatar: user.avatar,
            rating: newRating,
            content: newComment,
            createdAt: 'Just now',
            replies: []
        };

        setReviews([review, ...reviews]);
        setNewComment('');
        showToast("Review posted successfully", "success");
    };

    const handleSubmitReply = (reviewId: string) => {
        if (!replyText.trim()) return;

        const newReply: Reply = {
            id: Math.random().toString(36).substr(2, 9),
            authorId: user.id,
            authorName: user.name,
            authorAvatar: user.avatar,
            content: replyText,
            createdAt: 'Just now'
        };

        setReviews(prevReviews => prevReviews.map(review => {
            if (review.id === reviewId) {
                return {
                    ...review,
                    replies: [...(review.replies || []), newReply]
                };
            }
            return review;
        }));

        setReplyingToId(null);
        setReplyText('');
        showToast("Reply posted", "success");
    };

    const handleReportSubmit = () => {
        setIsReportModalOpen(false);
        showToast("Report submitted. Thank you for looking out for the neighborhood.", "success");
        setReportReason('');
    };

    const getRatingLabel = (r: number) => {
        switch(r) {
            case 5: return 'Excellent';
            case 4: return 'Good';
            case 3: return 'Average';
            case 2: return 'Fair';
            case 1: return 'Poor';
            default: return '';
        }
    };

    return (
        <div className="min-h-screen bg-brand-cream/30 pb-32 md:pb-24">
            
            {/* Header / Nav */}
            <div className="fixed top-0 left-0 md:left-64 right-0 z-40 bg-white/80 backdrop-blur-xl border-b border-brand-sand/50 px-4 py-3 md:px-8 md:py-4 flex items-center justify-between transition-all">
                <button 
                    onClick={() => navigate(-1)}
                    className="p-2.5 rounded-full bg-white border border-brand-sand hover:bg-gray-50 text-brand-dark transition-all shadow-sm"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="flex gap-3">
                    <button 
                        onClick={() => setIsReportModalOpen(true)}
                        className="p-2.5 rounded-full bg-white border border-brand-sand hover:bg-red-50 hover:text-red-500 hover:border-red-100 text-gray-600 transition-all shadow-sm"
                        title="Report this post"
                    >
                        <Flag size={20} />
                    </button>
                    <button 
                        onClick={handleShare}
                        className="p-2.5 rounded-full bg-white border border-brand-sand hover:bg-gray-50 text-gray-600 transition-all shadow-sm"
                    >
                        <Share2 size={20} />
                    </button>
                    <button 
                        onClick={handleToggleSave}
                        className={`p-2.5 rounded-full bg-white border border-brand-sand hover:bg-gray-50 transition-all shadow-sm ${saved ? 'text-red-500' : 'text-gray-600'}`}
                    >
                        <Heart size={20} className={saved ? 'fill-current' : ''} />
                    </button>
                </div>
            </div>

            <main className="pt-24 max-w-6xl mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
                    
                    {/* Left Col: Image (Sticky on Desktop) */}
                    <div className="space-y-6 lg:sticky lg:top-28 transition-all">
                        <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl shadow-brand-dark/5 bg-gray-100 border border-white/50 group">
                            <img 
                                src={listing.image} 
                                alt={listing.title} 
                                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                            />
                             <div className="absolute top-6 left-6">
                                <span className="bg-white/95 backdrop-blur-md text-brand-dark px-5 py-2 rounded-full text-sm font-bold tracking-wide shadow-sm border border-white/50 uppercase">
                                    {listing.category}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right Col: Details */}
                    <div className="flex flex-col space-y-10 animate-in slide-in-from-bottom-8 duration-500">
                        
                        {/* Title & Price Header */}
                        <div>
                            <h1 className="text-3xl md:text-5xl font-serif font-bold text-brand-dark leading-[1.1] mb-6 tracking-tight">
                                {listing.title}
                            </h1>
                            
                            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-brand-slate bg-white p-2 pr-6 rounded-2xl shadow-sm border border-brand-sand/50 inline-flex w-full md:w-auto">
                                <div className="bg-brand-primary/5 px-6 py-3 rounded-xl border border-brand-primary/10">
                                    <span className="text-3xl font-bold text-brand-primary tracking-tight">
                                        {typeof listing.price === 'number' ? `$${listing.price}` : listing.price}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm font-medium pl-2">
                                    <Clock size={18} className="text-brand-primary/60" />
                                    <span>{listing.createdAt}</span>
                                </div>
                                <div className="hidden md:block h-6 w-px bg-brand-sand" />
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <MapPin size={18} className="text-brand-primary/60" />
                                    <span>{listing.distance} miles away</span>
                                </div>
                            </div>
                        </div>

                        {/* Author Card */}
                        <div className="bg-white rounded-3xl p-3 pr-6 border border-brand-sand/50 shadow-sm hover:shadow-md hover:border-brand-primary/20 transition-all cursor-pointer group flex items-center gap-4 w-full">
                            <div className="relative">
                                <img src={listing.author.avatar} alt={listing.author.name} className="w-16 h-16 rounded-2xl object-cover shadow-sm" />
                                {listing.author.isVerified && (
                                    <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-sm border border-gray-50">
                                        <ShieldCheck size={16} className="text-brand-primary fill-brand-accent" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-brand-dark text-lg truncate group-hover:text-brand-primary transition-colors">{listing.author.name}</span>
                                    <span className="bg-brand-primary/10 text-brand-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                        Neighbor
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-500">
                                    <span className="truncate">{listing.author.neighborhood}</span>
                                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                    <span className="flex items-center gap-1 font-bold text-brand-dark">
                                        <Star size={12} className="fill-brand-primary text-brand-primary" />
                                        {listing.author.rating}
                                    </span>
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-full border border-brand-sand flex items-center justify-center text-brand-slate group-hover:bg-brand-dark group-hover:text-white transition-all transform group-hover:translate-x-1">
                                <ArrowLeft size={20} className="rotate-180" />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="prose prose-lg prose-slate max-w-none">
                            <h3 className="text-xs font-bold text-brand-slate/40 uppercase tracking-[0.2em] mb-4">Description</h3>
                            <p className="text-brand-dark leading-relaxed whitespace-pre-line font-light text-lg">
                                {listing.description}
                            </p>
                        </div>

                        <div className="w-full h-px bg-brand-sand/30" />

                        {/* Reviews Section */}
                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-serif font-bold text-brand-dark">
                                    Neighbor Reviews
                                </h2>
                                <span className="text-sm font-bold text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full">
                                    {reviews.length}
                                </span>
                            </div>

                            {/* Review Input */}
                            {!hasReviewed ? (
                                <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-brand-sand/50">
                                    <div className="flex flex-col gap-6">
                                        <div>
                                            <h3 className="font-bold text-brand-dark text-lg mb-1">Rate your experience</h3>
                                            <p className="text-sm text-brand-slate mb-4">Your feedback helps build trust in the circle.</p>
                                            
                                            <div className="flex items-center gap-2 mb-2">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <button 
                                                        key={s} 
                                                        onClick={() => setNewRating(s)} 
                                                        className="group focus:outline-none transition-transform active:scale-95"
                                                    >
                                                        <Star 
                                                            size={32} 
                                                            className={`transition-all duration-200 ${s <= newRating ? "fill-yellow-400 text-yellow-400 scale-110" : "text-gray-200 group-hover:text-yellow-200"}`} 
                                                        />
                                                    </button>
                                                ))}
                                                <span className="ml-3 text-sm font-bold text-brand-primary min-w-[80px]">
                                                    {getRatingLabel(newRating)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="relative">
                                            <textarea
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                                placeholder="Share details about the item condition, communication, or pickup..."
                                                className="w-full p-4 pb-14 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-brand-primary/30 focus:ring-4 focus:ring-brand-primary/5 outline-none transition-all resize-none min-h-[120px] text-sm leading-relaxed"
                                            />
                                            <div className="absolute bottom-3 right-3 flex items-center gap-3">
                                                <button 
                                                    onClick={handleSubmitReview}
                                                    disabled={!newComment.trim()}
                                                    className="bg-brand-dark text-white px-6 py-2.5 rounded-xl shadow-lg hover:bg-brand-primary hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold text-xs flex items-center gap-2"
                                                >
                                                    Post Review <Send size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-brand-primary/5 rounded-[2rem] p-8 text-center border border-brand-primary/10">
                                    <div className="w-12 h-12 bg-white text-brand-primary rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                                        <CheckCircle size={24} />
                                    </div>
                                    <h3 className="font-bold text-brand-dark text-lg">Feedback Shared</h3>
                                    <p className="text-sm text-brand-slate mt-1">Thank you for contributing to the community trust score.</p>
                                </div>
                            )}

                            {/* Reviews List */}
                            <div className="space-y-6">
                                {reviews.length > 0 ? reviews.map((review) => (
                                    <div key={review.id} className="bg-white p-6 rounded-3xl border border-brand-sand/30 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex gap-4">
                                            <img src={review.authorAvatar} alt={review.authorName} className="w-10 h-10 rounded-full object-cover border border-gray-100" />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h4 className="font-bold text-brand-dark text-sm">{review.authorName}</h4>
                                                    <span className="text-xs text-gray-400 font-medium">{review.createdAt}</span>
                                                </div>
                                                <div className="flex mb-3">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={12} className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
                                                    ))}
                                                </div>
                                                <p className="text-brand-slate text-sm leading-relaxed mb-3">
                                                    "{review.content}"
                                                </p>
                                                
                                                {/* Reply Button */}
                                                <button 
                                                    onClick={() => setReplyingToId(replyingToId === review.id ? null : review.id)}
                                                    className="text-xs font-bold text-brand-primary hover:text-brand-dark transition-colors flex items-center gap-1"
                                                >
                                                   <CornerDownRight size={14} /> Reply
                                                </button>

                                                {/* Reply Input */}
                                                {replyingToId === review.id && (
                                                    <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                                                        <div className="flex gap-3">
                                                            <div className="flex-1">
                                                                <input
                                                                    type="text"
                                                                    value={replyText}
                                                                    onChange={(e) => setReplyText(e.target.value)}
                                                                    placeholder="Write a reply..."
                                                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-brand-primary outline-none text-sm transition-all"
                                                                    autoFocus
                                                                />
                                                            </div>
                                                            <button 
                                                                onClick={() => handleSubmitReply(review.id)}
                                                                disabled={!replyText.trim()}
                                                                className="px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                            >
                                                                Post
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Nested Replies */}
                                                {review.replies && review.replies.length > 0 && (
                                                    <div className="mt-4 space-y-4 pl-4 border-l-2 border-brand-sand/50">
                                                        {review.replies.map(reply => (
                                                            <div key={reply.id} className="flex gap-3">
                                                                <img src={reply.authorAvatar} alt={reply.authorName} className="w-8 h-8 rounded-full object-cover border border-gray-100" />
                                                                <div className="flex-1 bg-gray-50 p-3 rounded-2xl rounded-tl-none">
                                                                    <div className="flex items-center justify-between mb-1">
                                                                        <h5 className="font-bold text-brand-dark text-xs">{reply.authorName}</h5>
                                                                        <span className="text-[10px] text-gray-400">{reply.createdAt}</span>
                                                                    </div>
                                                                    <p className="text-brand-slate text-xs leading-relaxed">
                                                                        {reply.content}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-[2rem]">
                                        <MessageSquare size={32} className="mx-auto mb-3 text-gray-300" />
                                        <p className="font-medium">No reviews yet.</p>
                                        <p className="text-xs mt-1">Be the first to ask about this item!</p>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>

                {/* Similar Listings Section */}
                {similarListings.length > 0 && (
                    <div className="mt-16 border-t border-brand-sand/50 pt-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-serif font-bold text-brand-dark">Similar Listings</h3>
                            <span className="text-xs font-medium text-brand-primary bg-brand-primary/10 px-2.5 py-1 rounded-full">
                                Based on category
                            </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
                            {similarListings.map(item => (
                                <div 
                                    key={item.id} 
                                    onClick={() => navigate(`/post/${item.id}`)} 
                                    className="group cursor-pointer bg-white rounded-2xl p-3 border border-brand-sand/30 hover:border-brand-primary/20 hover:shadow-soft transition-all"
                                >
                                    <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 mb-3 relative">
                                        <img 
                                            src={item.image} 
                                            alt={item.title} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                        />
                                        <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded-lg text-xs font-bold text-brand-dark shadow-sm">
                                            {typeof item.price === 'number' ? `$${item.price}` : item.price}
                                        </div>
                                    </div>
                                    <h4 className="font-bold text-brand-dark text-sm truncate mb-0.5 group-hover:text-brand-primary transition-colors">
                                        {item.title}
                                    </h4>
                                    <div className="flex items-center gap-1 text-xs text-brand-slate">
                                        <MapPin size={10} className="text-brand-primary" />
                                        <span>{item.distance} miles away</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            {/* Sticky Action Footer */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-xl border-t border-brand-sand/50 pb-safe z-50">
                <div className="max-w-4xl mx-auto flex gap-4">
                    <button 
                        onClick={() => {
                            showToast(`Message sent to ${listing.author.name}`, 'success');
                            navigate('/messages');
                        }}
                        className="flex-1 bg-brand-dark text-white font-bold py-4 rounded-2xl shadow-lg shadow-brand-dark/20 hover:bg-brand-primary hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-lg"
                    >
                        <MessageSquare size={20} />
                        Message Seller
                    </button>
                    {typeof listing.price === 'number' && (
                        <button className="flex-1 bg-white text-brand-dark font-bold py-4 rounded-2xl border-2 border-brand-sand hover:border-brand-dark hover:bg-gray-50 transition-all text-lg">
                            Make Offer
                        </button>
                    )}
                </div>
            </div>

            {/* Report Post Modal */}
            {isReportModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    <div 
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200" 
                        onClick={() => setIsReportModalOpen(false)} 
                    />
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in slide-in-from-bottom-8 zoom-in-95 duration-200">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-brand-dark flex items-center gap-2">
                                    <Flag size={20} className="text-red-500" />
                                    Report Listing
                                </h3>
                                <button 
                                    onClick={() => setIsReportModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            
                            <p className="text-sm text-gray-500 mb-6">
                                Help us keep the neighborhood safe. Why are you reporting this post?
                            </p>

                            <div className="space-y-3 mb-6">
                                {REPORT_REASONS.map((reason) => (
                                    <label 
                                        key={reason} 
                                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                                            reportReason === reason 
                                                ? 'bg-red-50 border-red-200' 
                                                : 'bg-white border-gray-100 hover:bg-gray-50'
                                        }`}
                                    >
                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                            reportReason === reason 
                                                ? 'border-red-500' 
                                                : 'border-gray-300'
                                        }`}>
                                            {reportReason === reason && (
                                                <div className="w-2 h-2 rounded-full bg-red-500" />
                                            )}
                                        </div>
                                        <input 
                                            type="radio" 
                                            name="reportReason" 
                                            value={reason} 
                                            checked={reportReason === reason}
                                            onChange={(e) => setReportReason(e.target.value)}
                                            className="hidden"
                                        />
                                        <span className={`text-sm font-medium ${reportReason === reason ? 'text-red-700' : 'text-gray-700'}`}>
                                            {reason}
                                        </span>
                                    </label>
                                ))}
                            </div>

                            <button 
                                onClick={handleReportSubmit}
                                disabled={!reportReason}
                                className="w-full py-3 bg-red-500 text-white rounded-xl font-bold shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                            >
                                Submit Report
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};