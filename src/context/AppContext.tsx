// Fix: Restored correct file content and updated import paths to use the '@' alias.
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Video, Category, AppContextType } from '@/types';
import { api } from '@/services/apiService';

type Theme = 'light' | 'dark' | 'system';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setThemeState] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    return savedTheme || 'system';
  });

  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('currentUser');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      return null;
    }
  });

  // Data state
  const [videos, setVideos] = useState<Video[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allUsersWithPasswords, setAllUsersWithPasswords] = useState<(User & { password: string })[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      setVideos(await api.getVideos());
      setCategories(await api.getCategories());
      const usersWithPasswords = await api.getUsers();
      setAllUsersWithPasswords(usersWithPasswords);
      const usersWithoutPasswords = usersWithPasswords.map(({ password, ...user }) => user);
      setAllUsers(usersWithoutPasswords);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem('theme', newTheme);
    setThemeState(newTheme);
  };
  
  const login = async (email: string, password: string): Promise<boolean> => {
    const user = allUsersWithPasswords.find(u => u.email === email && u.password === password);
    if (user) {
      const { password: _, ...userToStore } = user;
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

  const getVideoById = (id: string) => videos.find(v => v.id === id);

  const getVideosByCategory = (category: string) => videos.filter(v => v.category === category);

  const updateCurrentUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  }

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

  const isInMyList = (videoId: string) => currentUser?.myList.includes(videoId) ?? false;
  
  const upgradeToPremium = () => {
    if (currentUser) {
      updateCurrentUser({ ...currentUser, subscriptionPlan: 'Premium' });
    }
  };

  const addVideo = (video: Omit<Video, 'id'>) => {
    const newVideo = { ...video, id: String(Date.now() + Math.random()) };
    setVideos(prev => [newVideo, ...prev]);
  };

  const updateVideo = (updatedVideo: Video) => {
    setVideos(prev => prev.map(v => v.id === updatedVideo.id ? updatedVideo : v));
  };
  
  const deleteVideo = (videoId: string) => {
    setVideos(prev => prev.filter(v => v.id !== videoId));
  };
  
  const getRecommendedVideos = () => {
    if (!currentUser || !currentUser.myList.length) {
      // Fallback for new users: recommend trending videos
      return videos.filter(v => v.category === 'Trending Now').slice(0, 10);
    }

    const myListVideos = videos.filter(v => currentUser.myList.includes(v.id));
    const favoriteCategories = new Set(myListVideos.map(v => v.category));
    const favoriteTags = new Set(myListVideos.flatMap(v => v.tags));

    const recommendations = videos
      .filter(v => !currentUser.myList.includes(v.id)) // Exclude videos already in My List
      .map(video => {
        let score = 0;
        if (favoriteCategories.has(video.category)) {
          score += 2; // Higher score for matching category
        }
        video.tags.forEach(tag => {
          if (favoriteTags.has(tag)) {
            score += 1; // Score for each matching tag
          }
        });
        return { video, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.video);
      
    return recommendations.slice(0, 10);
  };


  const value: AppContextType = {
    theme,
    setTheme,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.isAdmin ?? false,
    currentUser,
    login,
    logout,
    users: allUsers,
    videos,
    categories,
    getVideoById,
    getVideosByCategory,
    getRecommendedVideos,
    addToMyList,
    removeFromMyList,
    isInMyList,
    upgradeToPremium,
    addVideo,
    updateVideo,
    deleteVideo,
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