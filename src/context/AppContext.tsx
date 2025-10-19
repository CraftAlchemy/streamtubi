import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Video, Category, AppContextType, Theme } from '@/types';
import { api } from '@/services/apiService';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State
  const [theme, setThemeState] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'system');
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('currentUser');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) { return null; }
  });
  const [videos, setVideos] = useState<Video[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  
  // Loading & Error State
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Initial Data Fetch
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [fetchedVideos, fetchedCategories, fetchedUsers] = await Promise.all([
          api.getVideos(),
          api.getCategories(),
          api.getUsers(),
        ]);
        setVideos(fetchedVideos);
        setCategories(fetchedCategories);
        const usersWithoutPasswords = fetchedUsers.map(({ password, ...user }) => user);
        setAllUsers(usersWithoutPasswords);
      } catch (error: any) {
        setApiError(error.message || "Failed to load initial data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Theme effect
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    root.classList.add(theme === 'system' ? systemTheme : theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };
  
  // Centralized API call handler
  const handleApiCall = async <T,>(apiFunc: () => Promise<T>, options: { submission?: boolean } = {}): Promise<T | null> => {
    if (options.submission) setIsSubmitting(true);
    clearApiError();
    try {
      return await apiFunc();
    } catch (error: any) {
      setApiError(error.message || 'An unexpected error occurred.');
      return null;
    } finally {
      if (options.submission) setIsSubmitting(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    // Fix: Updated to correctly call the new api.login method and handle the response.
    const userWithPassword = await handleApiCall(() => api.login(email, password), { submission: true });
    if (userWithPassword) {
      // Fix: Destructuring now works as userWithPassword is correctly typed.
      const { password: _, ...userToStore } = userWithPassword;
      setCurrentUser(userToStore);
      localStorage.setItem('currentUser', JSON.stringify(userToStore));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateCurrentUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };
  
  const addToMyList = (videoId: string) => {
    if (currentUser && !currentUser.myList.includes(videoId)) {
      updateCurrentUser({ ...currentUser, myList: [...currentUser.myList, videoId] });
    }
  };

  const removeFromMyList = (videoId: string) => {
    if (currentUser) {
      updateCurrentUser({ ...currentUser, myList: currentUser.myList.filter(id => id !== videoId) });
    }
  };
  
  const upgradeToPremium = () => {
    if (currentUser) {
      updateCurrentUser({ ...currentUser, subscriptionPlan: 'Premium' });
    }
  };

  const addVideo = async (video: Omit<Video, 'id'>): Promise<void> => {
    // Fix: Correctly calls the new api.addVideo method.
    const newVideo = await handleApiCall(() => api.addVideo(video), { submission: true });
    if (newVideo) {
      setVideos(prev => [newVideo, ...prev]);
    }
  };

  const updateVideo = async (updatedVideo: Video): Promise<void> => {
    // Fix: Correctly calls the new api.updateVideo method.
    const result = await handleApiCall(() => api.updateVideo(updatedVideo), { submission: true });
    if (result) {
      setVideos(prev => prev.map(v => v.id === updatedVideo.id ? updatedVideo : v));
    }
  };
  
  const deleteVideo = async (videoId: string): Promise<void> => {
    // Fix: Correctly calls the new api.deleteVideo method and checks the response.
    const result = await handleApiCall(() => api.deleteVideo(videoId), { submission: true });
    if (result?.success) {
      setVideos(prev => prev.filter(v => v.id !== videoId));
    }
  };
  
  const getRecommendedVideos = () => {
    if (!currentUser || !currentUser.myList.length) {
      return videos.filter(v => v.category === 'Trending Now').slice(0, 10);
    }
    const myListVideos = videos.filter(v => currentUser.myList.includes(v.id));
    const favoriteCategories = new Set(myListVideos.map(v => v.category));
    const favoriteTags = new Set(myListVideos.flatMap(v => v.tags));
    return videos
      .filter(v => !currentUser.myList.includes(v.id))
      .map(video => {
        let score = 0;
        if (favoriteCategories.has(video.category)) score += 2;
        video.tags.forEach(tag => { if (favoriteTags.has(tag)) score += 1; });
        return { video, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.video)
      .slice(0, 10);
  };
  
  const clearApiError = () => setApiError(null);

  const value: AppContextType = {
    theme, setTheme,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.isAdmin ?? false,
    currentUser, login, logout,
    users: allUsers, videos, categories,
    getVideoById: (id: string) => videos.find(v => v.id === id),
    getVideosByCategory: (category: string) => videos.filter(v => v.category === category),
    getRecommendedVideos,
    addToMyList, removeFromMyList,
    isInMyList: (videoId: string) => currentUser?.myList.includes(videoId) ?? false,
    upgradeToPremium,
    addVideo, updateVideo, deleteVideo,
    // Fix: Provided the new state and error properties to match the AppContextType.
    isLoading, isSubmitting, apiError, clearApiError,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};