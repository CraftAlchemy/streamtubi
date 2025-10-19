import { USERS, VIDEOS, CATEGORIES } from '@/data/mockData';
import { User, Video, Category } from '@/types';

// --- API Simulation ---
const API_DELAY = 500;
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// --- Rate Limiting Simulation ---
let requestCount = 0;
const RATE_LIMIT = 20; // Allow more requests
const RATE_LIMIT_WINDOW = 5000; // 5 seconds

setInterval(() => {
  requestCount = 0;
}, RATE_LIMIT_WINDOW);

const checkRateLimit = () => {
  requestCount++;
  if (requestCount > RATE_LIMIT) {
    throw new Error("Too many requests. Please try again in a few seconds.");
  }
};

// --- API Service ---
// Fix: Implemented missing API functions (login, addVideo, updateVideo, deleteVideo).
export const api = {
  login: async (email: string, password: string): Promise<(User & { password: string })> => {
    checkRateLimit();
    await delay(API_DELAY);
    const user = USERS.find(u => u.email === email && u.password === password);
    if (user) return user;
    throw new Error("Invalid email or password.");
  },

  getUsers: async (): Promise<(User & { password: string })[]> => {
    await delay(API_DELAY);
    return JSON.parse(JSON.stringify(USERS)); // deep copy to avoid mutation issues
  },

  getVideos: async (): Promise<Video[]> => {
    await delay(API_DELAY * 2); // Slower initial load
    return JSON.parse(JSON.stringify(VIDEOS));
  },

  getCategories: async (): Promise<Category[]> => {
    await delay(API_DELAY * 2);
    return JSON.parse(JSON.stringify(CATEGORIES));
  },

  addVideo: async (video: Omit<Video, 'id'>): Promise<Video> => {
    checkRateLimit();
    await delay(API_DELAY);
    const newVideo = { ...video, id: String(Date.now() + Math.random()) };
    // In a real API, this would be added to the database.
    console.log("API: Adding video", newVideo);
    return newVideo;
  },

  updateVideo: async (video: Video): Promise<Video> => {
    checkRateLimit();
    await delay(API_DELAY);
    console.log("API: Updating video", video);
    // In a real API, this would be updated in the database.
    return video;
  },

  deleteVideo: async (videoId: string): Promise<{ success: boolean }> => {
    checkRateLimit();
    await delay(API_DELAY);
    console.log("API: Deleting video", videoId);
    // In a real API, this would be deleted from the database.
    return { success: true };
  },
};