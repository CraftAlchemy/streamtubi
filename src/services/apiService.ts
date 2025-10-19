// Fix: Restored correct file content and updated import paths to use the '@' alias.
import { USERS, VIDEOS, CATEGORIES } from '@/data/mockData';
import { User, Video, Category } from '@/types';

// Simulate API delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const api = {
  getUsers: async (): Promise<(User & { password: string })[]> => {
    await delay(100);
    return USERS;
  },
  getVideos: async (): Promise<Video[]> => {
    await delay(100);
    return VIDEOS;
  },
  getCategories: async (): Promise<Category[]> => {
    await delay(100);
    return CATEGORIES;
  },
};