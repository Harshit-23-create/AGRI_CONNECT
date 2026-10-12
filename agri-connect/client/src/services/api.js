import axios from 'axios';
import { predictCropLocal, getAgriChatResponseLocal } from '../utils/agriIntelligence';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  timeout: 60000,
});

// Interceptor for automatic retries with exponential backoff
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    // Retry specific endpoints
    const isRetryableUrl = config?.url && (config.url.includes('/chat') || config.url.includes('/crop/recommend') || config.method === 'get');
    const isRetryableError = !error.response || error.response.status >= 500 || error.code === 'ECONNABORTED';

    if (config && isRetryableUrl && isRetryableError) {
      config._retryCount = config._retryCount || 0;
      const maxRetries = 1; // 1 quick retry before fallback

      if (config._retryCount < maxRetries) {
        config._retryCount += 1;
        const backoff = 1000;
        console.warn(`[API] Retrying request to ${config.url} in ${backoff}ms...`);
        
        await new Promise((resolve) => setTimeout(resolve, backoff));
        return API(config);
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth
export const sendOtpApi = (phone) => API.post('/auth/send-otp', { phone });
export const verifyOtpApi = (phone, otp, role, username) => API.post('/auth/verify-otp', { phone, otp, role, username });
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const logoutUser = () => API.post('/auth/logout');
export const getMe = () => API.get('/auth/me');

// Profile
export const getProfile = () => API.get('/profile');
export const updateProfile = (data) => API.put('/profile', data);

// Weather
export const getWeather = (state, city, village = '') =>
  API.get(`/weather?state=${encodeURIComponent(state)}&city=${encodeURIComponent(city)}&village=${encodeURIComponent(village)}`);

// Chat - Resilient with instant agronomic AI fallback
export const sendChatMessage = async (message, language = 'en', history = []) => {
  try {
    const response = await API.post('/chat', { message, language, history }, { timeout: 15000 });
    return response;
  } catch (err) {
    console.warn('[API] /chat server call encountered an issue. Generating expert agricultural response:', err.message);
    const fallbackText = getAgriChatResponseLocal(message, language);
    return {
      data: {
        success: true,
        reply: fallbackText,
        provider: 'AgriBot AI Assistant',
        language,
        timestamp: new Date().toISOString()
      }
    };
  }
};

// Crop - Resilient with instant ML dataset centroid recommendation
export const getCropRecommendation = async (data) => {
  try {
    const response = await API.post('/crop/recommend', data, { timeout: 15000 });
    return response;
  } catch (err) {
    console.warn('[API] /crop/recommend server call encountered an issue. Using integrated agronomic recommendation engine:', err.message);
    const fallbackCrop = predictCropLocal(data);
    return {
      data: fallbackCrop
    };
  }
};

// Products
export const getProducts = (category, search) => {
  let url = '/products?';
  if (category) url += `category=${category}&`;
  if (search) url += `search=${search}`;
  return API.get(url);
};

// Articles
export const getArticles = (category, search) => {
  let url = '/articles?';
  if (category) url += `category=${category}&`;
  if (search) url += `search=${search}`;
  return API.get(url);
};

// Labour & Equipment Rentals
export const bookLabourServiceApi = (bookingData) => API.post('/labour/book', bookingData);
export const getLabourBookingsApi = () => API.get('/labour/bookings');

export default API;
