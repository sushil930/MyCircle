import { Listing, User, Category, Review, Notification } from './types';

export const CATEGORIES: { label: string; value: Category; icon: string }[] = [
  { label: 'All', value: 'Marketplace', icon: 'Grid' }, // Acts as filter reset
  { label: 'For Sale', value: 'Marketplace', icon: 'ShoppingBag' },
  { label: 'Rentals', value: 'Rentals', icon: 'Key' },
  { label: 'Barter', value: 'Barter', icon: 'RefreshCw' },
  { label: 'Services', value: 'Services', icon: 'Briefcase' },
  { label: 'Free', value: 'Free', icon: 'Heart' },
];

const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1',
    authorId: 'u2',
    authorName: 'Sarah Jenkins',
    authorAvatar: 'https://picsum.photos/seed/user2/100/100',
    rating: 5,
    content: 'Alex was incredibly helpful! The item was exactly as described and he even helped me load it into my car.',
    createdAt: '2 days ago',
    replies: [
        {
            id: 'rep1',
            authorId: 'u1',
            authorName: 'Alex D.',
            authorAvatar: 'https://picsum.photos/seed/user1/100/100',
            content: 'Glad I could help, Sarah! Enjoy the chair.',
            createdAt: '1 day ago'
        }
    ]
  },
  {
    id: 'r2',
    authorId: 'u3',
    authorName: 'Mike Thompson',
    authorAvatar: 'https://picsum.photos/seed/user3/100/100',
    rating: 5,
    content: 'Great communication and very flexible with pickup times. A true asset to the Maplewood neighborhood.',
    createdAt: '1 week ago'
  },
  {
    id: 'r3',
    authorId: 'u4',
    authorName: 'Emily Rodriguez',
    authorAvatar: 'https://picsum.photos/seed/user4/100/100',
    rating: 4,
    content: 'Good experience overall. Item was in good condition.',
    createdAt: '3 weeks ago'
  },
  {
    id: 'r4',
    authorId: 'u5',
    authorName: 'David Lee',
    authorAvatar: 'https://picsum.photos/seed/user5/100/100',
    rating: 5,
    content: 'Traded some garden tools. Smooth transaction!',
    createdAt: '1 month ago'
  },
  {
    id: 'r5',
    authorId: 'u6',
    authorName: 'Jessica M.',
    authorAvatar: 'https://picsum.photos/seed/user6/100/100',
    rating: 5,
    content: 'Super friendly and reliable.',
    createdAt: '2 months ago'
  },
  {
    id: 'r6',
    authorId: 'u8',
    authorName: 'Tom H.',
    authorAvatar: 'https://picsum.photos/seed/user8/100/100',
    rating: 5,
    content: 'Verified neighbor check passed with flying colors. Highly recommend.',
    createdAt: '3 months ago'
  }
];

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Alex D.',
  avatar: 'https://picsum.photos/seed/user1/100/100',
  isVerified: true,
  rating: 4.9, // This will be recalculated in UI based on reviews
  neighborhood: 'Maplewood District',
  bio: "Love gardening and restoring vintage furniture. Always happy to lend a hand with heavy lifting!",
  joinedDate: '2021',
  reviews: MOCK_REVIEWS
};

// Helper to generate some listing-specific reviews
const LISTING_REVIEWS: Review[] = [
    {
        id: 'lr1',
        authorId: 'u9',
        authorName: 'Nancy K.',
        authorAvatar: 'https://picsum.photos/seed/user9/100/100',
        rating: 5,
        content: 'Exactly as pictured. Thanks neighbor!',
        createdAt: '1 hour ago',
        replies: []
    },
    {
        id: 'lr2',
        authorId: 'u10',
        authorName: 'Jim B.',
        authorAvatar: 'https://picsum.photos/seed/user10/100/100',
        rating: 4,
        content: 'Good condition, fair price.',
        createdAt: '5 hours ago',
        replies: [
            {
                id: 'lr2rep1',
                authorId: 'u2',
                authorName: 'Sarah J.',
                authorAvatar: 'https://picsum.photos/seed/user2/100/100',
                content: 'Thanks Jim! Hope it serves you well.',
                createdAt: '4 hours ago'
            }
        ]
    }
];

export const MOCK_LISTINGS: Listing[] = [
  {
    id: '1',
    title: 'Vintage Mid-Century Chair',
    description: 'Beautiful restored teak chair. Perfect for a reading nook. New upholstery in a neutral oatmeal linen. Frame is solid teak with no wobbles. There is a small scratch on the back leg but barely noticeable. Pick up only.',
    price: 150,
    category: 'Marketplace',
    image: 'https://picsum.photos/seed/chair/400/300',
    images: [
      'https://picsum.photos/seed/chair/400/300',
      'https://picsum.photos/seed/chairdetail1/400/300',
      'https://picsum.photos/seed/chairdetail2/400/300'
    ],
    distance: 0.2,
    author: { ...MOCK_USER, id: 'u2', name: 'Sarah J.', avatar: 'https://picsum.photos/seed/user2/100/100' },
    createdAt: '2 hrs ago',
    likes: 12,
    reviews: LISTING_REVIEWS
  },
  {
    id: '2',
    title: 'Professional Power Drill',
    description: 'Renting out my DeWalt drill. Comes with bit set and two charged batteries. Perfect for weekend DIY projects. $15/day or $25 for the whole weekend.',
    price: 15,
    category: 'Rentals',
    image: 'https://picsum.photos/seed/drill/400/300',
    images: ['https://picsum.photos/seed/drill/400/300', 'https://picsum.photos/seed/drillbits/400/300'],
    distance: 0.5,
    author: { ...MOCK_USER, id: 'u3', name: 'Mike T.', avatar: 'https://picsum.photos/seed/user3/100/100' },
    createdAt: '4 hrs ago',
    likes: 5,
    reviews: []
  },
  {
    id: '3',
    title: 'Dog Walking - Weekends',
    description: 'Experienced dog lover available for walks on Sat/Sun mornings. I have experience with big dogs and leash training. $25 per 45 min walk.',
    price: 25,
    category: 'Services',
    image: 'https://picsum.photos/seed/dog/400/300',
    distance: 0.1,
    author: { ...MOCK_USER, id: 'u4', name: 'Emily R.', avatar: 'https://picsum.photos/seed/user4/100/100' },
    createdAt: '1 day ago',
    likes: 24,
    reviews: [LISTING_REVIEWS[0]]
  },
  {
    id: '4',
    title: 'Moving Boxes (Heavy Duty)',
    description: 'Just finished moving. Have about 15 large boxes and 10 medium ones. Wardrobe boxes included. Free to pick up!',
    price: 'Free',
    category: 'Free',
    image: 'https://picsum.photos/seed/boxes/400/300',
    distance: 0.8,
    author: { ...MOCK_USER, id: 'u5', name: 'David L.', avatar: 'https://picsum.photos/seed/user5/100/100' },
    createdAt: '30 mins ago',
    likes: 45,
    reviews: []
  },
  {
    id: '5',
    title: 'Homemade Sourdough Starter',
    description: 'Trading active starter (San Francisco origin) for some garden herbs, fresh eggs, or just a friendly chat! I have too much.',
    price: 'Barter',
    category: 'Barter',
    image: 'https://picsum.photos/seed/bread/400/300',
    distance: 1.2,
    author: { ...MOCK_USER, id: 'u6', name: 'Jessica M.', avatar: 'https://picsum.photos/seed/user6/100/100' },
    createdAt: '5 hrs ago',
    likes: 8,
    reviews: [LISTING_REVIEWS[1]]
  },
  {
    id: '6',
    title: 'Sony A7III Camera Kit',
    description: 'Barely used. Includes 28-70mm lens, strap, and 64GB card. Shutter count < 5000. Looking for a quick sale to fund an upgrade.',
    price: 1400,
    category: 'Marketplace',
    image: 'https://picsum.photos/seed/camera/400/300',
    images: ['https://picsum.photos/seed/camera/400/300', 'https://picsum.photos/seed/lens/400/300', 'https://picsum.photos/seed/bag/400/300'],
    distance: 2.5,
    author: { ...MOCK_USER, id: 'u7', name: 'Chris P.', avatar: 'https://picsum.photos/seed/user7/100/100' },
    createdAt: '1 day ago',
    likes: 31,
    reviews: []
  }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'like',
    actor: {
      name: 'Sarah J.',
      avatar: 'https://picsum.photos/seed/user2/100/100'
    },
    content: 'liked your listing "Vintage Mid-Century Chair"',
    targetImage: 'https://picsum.photos/seed/chair/100/100',
    timestamp: '2m',
    isRead: false,
    linkTo: '/post/1'
  },
  {
    id: 'n2',
    type: 'review',
    actor: {
      name: 'Mike T.',
      avatar: 'https://picsum.photos/seed/user3/100/100'
    },
    content: 'left you a 5-star review: "Great communication..."',
    timestamp: '1h',
    isRead: false,
    linkTo: '/profile'
  },
  {
    id: 'n3',
    type: 'like',
    actor: {
      name: 'Emily R.',
      avatar: 'https://picsum.photos/seed/user4/100/100'
    },
    content: 'liked your listing "Vintage Mid-Century Chair"',
    targetImage: 'https://picsum.photos/seed/chair/100/100',
    timestamp: '3h',
    isRead: true,
    linkTo: '/post/1'
  },
  {
    id: 'n4',
    type: 'review',
    actor: {
      name: 'David L.',
      avatar: 'https://picsum.photos/seed/user5/100/100'
    },
    content: 'commented on your post "Dog Walking"',
    targetImage: 'https://picsum.photos/seed/dog/100/100',
    timestamp: '1d',
    isRead: true,
    linkTo: '/post/3'
  }
];