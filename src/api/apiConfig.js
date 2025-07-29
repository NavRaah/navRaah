import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';
console.log('API_URL', API_URL);
// Create axios instance with base configuration for cloud backend
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 0, // No timeout - wait indefinitely for response
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token refresh function
const refreshToken = async () => {
  try {
    const refreshTokenStored = await AsyncStorage.getItem('refreshToken');
    if (!refreshTokenStored) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post(`${API_URL}/api/users/refresh-token`, {}, {
      headers: {
        'Authorization': `Bearer ${refreshTokenStored}`
      }
    });

    const { accessToken } = response.data;
    await AsyncStorage.setItem('accessToken', accessToken);
    console.log('✅ Token refreshed successfully');
    return accessToken;
  } catch (error) {
    console.error('❌ Token refresh failed:', error);
    // Clear all tokens if refresh fails
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'userInfo']);
    throw error;
  }
};

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Log the complete request being made
      console.log('API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        headers: {
          ...config.headers,
          Authorization: config.headers.Authorization ? '[TOKEN_PRESENT]' : '[NO_TOKEN]'
        },
        data: config.data ? '[DATA_PRESENT]' : '[NO_DATA]'
      });
    } catch (error) {
      console.error('Error getting token from storage:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors and token refresh
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response Success:', {
      status: response.status,
      url: response.config.url,
      data: response.data ? '[DATA_RECEIVED]' : '[NO_DATA]'
    });
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    console.error('API Error Details:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      baseURL: error.config?.baseURL,
    });
    
    // Handle token expiration and refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const newToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        console.log('🔄 Retrying request with new token');
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error('❌ Token refresh failed, redirecting to login');
        // Clear all auth data
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'userInfo']);
        // You might want to emit an event here to redirect to login
        return Promise.reject(refreshError);
      }
    }
    
    // Handle network issues
    if (error.code === 'NETWORK_ERROR' || !error.response) {
      console.warn('🌐 Network error - check connection');
      error.isNetworkError = true;
    }
    
    return Promise.reject(error);
  }
);

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/users/login',
    REGISTER: '/api/users/register',
    LOGOUT: '/api/users/logout',
    REFRESH_TOKEN: '/api/users/refresh-token',
    FORGOT_PASSWORD: '/api/users/forgot-password',
    RESET_PASSWORD: '/api/users/reset-password',
  },
  BUS: {
    ADD_BUS: '/api/bus',
    UPDATE_BUS: '/api/bus',
    DELETE_BUS: '/api/bus',
    GET_ALL_BUSES: '/api/bus',
    GET_BUS_BY_ID: '/api/bus',
  },
  ROUTE: {
    CREATE_ROUTE: '/api/route',
    UPDATE_ROUTE: '/api/route',
    DELETE_ROUTE: '/api/route',
    GET_ALL_ROUTES: '/api/route',
    GET_ROUTE_BY_ID: '/api/route',
  },
  STOP: {
    ADD_STOP: '/api/stop',
    UPDATE_STOP: '/api/stop',
    DELETE_STOP: '/api/stop',
    GET_ALL_STOPS: '/api/stop',
    GET_STOP_BY_ID: '/api/stop',
    UPDATE_ACTUAL_ARRIVAL: '/api/stop',
  },
};
export default apiClient;
