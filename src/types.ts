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

// Fix: Exported the Theme type to be used across the application.
export type Theme = 'light' | 'dark' | 'system';

export interface AppContextType {
  // Theme
  theme: Theme;
  setTheme: (theme: Theme) => void;

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
  getRecommendedVideos: () => Video[];
  
  // My List
  addToMyList: (videoId: string) => void;
  removeFromMyList: (videoId: string) => void;
  isInMyList: (videoId: string) => boolean;

  // Monetization
  upgradeToPremium: () => void;
  
  // Admin
  addVideo: (video: Omit<Video, 'id'>) => Promise<void>;
  updateVideo: (video: Video) => Promise<void>;
  deleteVideo: (videoId: string) => Promise<void>;
  
  // Fix: Added state and error handling properties to the context type.
  // State & Error Handling
  isLoading: boolean;
  isSubmitting: boolean;
  apiError: string | null;
  clearApiError: () => void;
}