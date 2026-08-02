import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
  timeout: 30000,
});

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
  API.post('/chat', { message, language }, { timeout: 25000 });

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
