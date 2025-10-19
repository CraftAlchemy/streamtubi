
export interface User {
  id: string;
  email: string;
  isAdmin: boolean;
  myList: string[];
  subscriptionPlan: 'Free' | 'Premium';
  watchTimeMinutes: number;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: number;
  category: string;
  tags: string[];
  ageRating: string;
  cast: string[];
  adBreaks: number[]; // Timestamps in seconds
}

export interface Category {
  id:string;
  name: string;
}

export interface AppContextType {
  // Theme
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;

  // Auth
  isAuthenticated: boolean;
  isAdmin: boolean;
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;

  // Data
  users: User[];
  videos: Video[];
  categories: Category[];
  getVideoById: (id: string) => Video | undefined;
  getVideosByCategory: (category: string) => Video[];
  getRecommendedVideos: () => Video[]; // New
  
  // My List
  addToMyList: (videoId: string) => void;
  removeFromMyList: (videoId: string) => void;
  isInMyList: (videoId: string) => boolean;

  // Monetization
  upgradeToPremium: () => void;
  
  // Admin
  addVideo: (video: Omit<Video, 'id'>) => void;
  updateVideo: (video: Video) => void;
  deleteVideo: (videoId: string) => void;
}
