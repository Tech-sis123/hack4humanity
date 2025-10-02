import axios from 'axios';

// Use environment variable for API base URL or default to localhost
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';



// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Token management functions
export const getToken = () => {
  return localStorage.getItem('hopechain_token');
};

export const setToken = (token) => {
  localStorage.setItem('hopechain_token', token);
};

export const removeToken = () => {
  localStorage.removeItem('hopechain_token');
};

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;
  
  try {
    // Basic token validation (check if it's not expired)
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch (error) {
    return false;
  }
};

// Auth API calls
export const authService = {
  // Register new user
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.token) {
        setToken(response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || error.response?.data?.error || 'Registration failed');
    }
  },

  // Login user
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.token) {
        console.log(response.data.token);
        setToken(response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || error.response?.data?.error || 'Login failed');
    }
  },

  // Logout user
  logout() {
    removeToken();
    window.location.href = '/login';
  },

  // Get current user
  async getCurrentUser() {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || error.response?.data?.error || 'Failed to get user data');
    }
  },

  // Get user profile
  async getProfile() {
    try {
      const response = await api.get('/users/profile');
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || error.response?.data?.error || 'Failed to get profile');
    }
  },

  // Update user profile
  async updateProfile(profileData) {
    try {
      const response = await api.put('/users/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || error.response?.data?.error || 'Failed to update profile');
    }
  }
};

export default api;