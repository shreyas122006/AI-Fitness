import axios from 'axios';
import { SearchType, Exercise } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 seconds timeout for AI generation
});

export const searchExercises = async (searchType: SearchType, keyword: string): Promise<Exercise[]> => {
  try {
    const response = await apiClient.post<Exercise[]>('/search', {
      search_type: searchType,
      keyword: keyword,
    });
    return response.data;
  } catch (error: any) {
    console.error('API Search Error:', error);
    if (error.response && error.response.data && error.response.data.detail) {
      throw new Error(error.response.data.detail);
    }
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      throw new Error('API Request timed out. Please check your connection or try again.');
    }
    throw new Error('Failed to connect to AI Fitness backend server. Ensure FastAPI is running.');
  }
};

export const checkHealthStatus = async (): Promise<boolean> => {
  try {
    const response = await apiClient.get('/');
    return response.data.message === 'API Running';
  } catch (error) {
    return false;
  }
};
