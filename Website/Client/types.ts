export type Category = 'Marketplace' | 'Rentals' | 'Barter' | 'Services' | 'Free';

export interface Reply {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
}

export interface Review {
  id: string;
  authorId: string; // Added to track unique user reviews
  authorName: string;
  authorAvatar: string;
  rating: number; // 1-5
  content: string;
  createdAt: string;
  replies?: Reply[];
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  isVerified: boolean;
  rating: number;
  neighborhood: string;
  bio?: string; // Added bio field
  reviews?: Review[]; // Optional for backward compatibility, but we will populate it
  joinedDate?: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number | 'Free' | 'Barter';
  category: Category;
  image: string; // Primary image (kept for backward compatibility)
  images?: string[]; // Array of all images
  distance: number; // in miles
  author: User;
  createdAt: string;
  likes: number;
  reviews?: Review[]; // Added reviews for specific listings
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  otherUser: User;
  lastMessage: string;
  unread: number;
}

export type NotificationType = 'like' | 'review' | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  actor: {
    name: string;
    avatar: string;
  };
  content: string; // "liked your post", "left a review"
  targetImage?: string; // Optional image of the item being interacted with
  timestamp: string;
  isRead: boolean;
  linkTo: string; // route to navigate to
}