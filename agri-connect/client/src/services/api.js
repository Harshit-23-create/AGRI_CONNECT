import axios from 'axios';

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

    // Only retry GET requests or specific endpoints (chat/crop)
    const isRetryableUrl = config.url.includes('/chat') || config.url.includes('/crop/recommend') || config.method === 'get';
    const isRetryableError = !error.response || error.response.status >= 500 || error.code === 'ECONNABORTED';

    if (config && isRetryableUrl && isRetryableError) {
      config._retryCount = config._retryCount || 0;
      const maxRetries = 3;

      if (config._retryCount < maxRetries) {
        config._retryCount += 1;
        
        // Exponential backoff: 2s, 4s, 8s
        const backoff = Math.pow(2, config._retryCount) * 1000;
        console.warn(`[API] Retrying request to ${config.url} in ${backoff}ms (Attempt ${config._retryCount}/${maxRetries})`);
        
        await new Promise((resolve) => setTimeout(resolve, backoff));
        return API(config);
      }
    }
    
    // Check if offline
    if (!navigator.onLine) {
      error.message = 'You appear to be offline. Please check your internet connection.';
    }

    return Promise.reject(error);
  }
);

// Auth
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

// Chat
export const sendChatMessage = (message, language = 'en') =>
  API.post('/chat', { message, language }, { timeout: 60000 });

// Crop
export const getCropRecommendation = (data) => API.post('/crop/recommend', data);

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

export default API;
