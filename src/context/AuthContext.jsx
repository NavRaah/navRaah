import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import apiClient, { API_ENDPOINTS } from '../api/apiConfig';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const saveTokens = async (accessToken, refreshToken = null) => {
    try {
      await AsyncStorage.setItem('accessToken', accessToken);
      if (refreshToken) {
        await AsyncStorage.setItem('refreshToken', refreshToken);
      }
      console.log('✅ Tokens saved to storage');
    } catch (error) {
      console.error('❌ Error saving tokens:', error);
    }
  };

  const saveUserInfo = async (userInfo) => {
    try {
      await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
      console.log('✅ User info saved to storage');
    } catch (error) {
      console.error('❌ Error saving user info:', error);
    }
  };

  const getStoredData = async () => {
    try {
      const [storedAccessToken, storedRefreshToken, storedUserInfo] = await AsyncStorage.multiGet([
        'accessToken',
        'refreshToken', 
        'userInfo'
      ]);
      
      return {
        accessToken: storedAccessToken[1],
        refreshToken: storedRefreshToken[1],
        userInfo: storedUserInfo[1] ? JSON.parse(storedUserInfo[1]) : null
      };
    } catch (error) {
      console.error('❌ Error getting stored data:', error);
      return { accessToken: null, refreshToken: null, userInfo: null };
    }
  };

  // Clear all auth data
  const clearAuthData = async () => {
    try {
      console.log('🧹 Clearing all authentication data...');
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'userInfo']);
      setAccessToken(null);
      setRefreshToken(null);
      setUserInfo(null);
      setUserData(null);
      setIsAuthenticated(false);
      console.log('✅ Auth data cleared successfully');
    } catch (error) {
      console.error('❌ Error clearing auth data:', error);
    }
  };

  // Initialize authentication state on app startup
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('🚀 Initializing authentication...');
        setLoading(true);

        const { accessToken: storedAccessToken, refreshToken: storedRefreshToken, userInfo: storedUserInfo } = await getStoredData();

        if (storedAccessToken && storedUserInfo) {
          console.log('📱 Found stored credentials, restoring auth state...');
          
          // Trust stored tokens (validation will happen on first API call with auto-refresh)
          setAccessToken(storedAccessToken);
          setRefreshToken(storedRefreshToken);
          setUserInfo(storedUserInfo);
          setUserData(storedUserInfo);
          setIsAuthenticated(true);
          console.log('✅ Authentication restored for:', storedUserInfo.email);
        } else {
          console.log('📱 No stored credentials found');
        }
      } catch (error) {
        console.error('❌ Error initializing auth:', error);
        await clearAuthData();
      } finally {
        setLoading(false);
        console.log('🏁 Authentication initialization complete');
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      console.log('🔐 Starting login request for:', email);
      
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });

      console.log('✅ Login response received:', response.status);

      const { accessToken, refreshToken, user } = response.data;

      if (!accessToken || !user) {
        throw new Error('Invalid response: missing token or user data');
      }

      // Update state
      setAccessToken(accessToken);
      if (refreshToken) setRefreshToken(refreshToken);
      setUserInfo(user);
      setUserData(user);
      setIsAuthenticated(true);

      // Save to storage
      await saveTokens(accessToken, refreshToken);
      await saveUserInfo(user);

      console.log('✅ Login successful for user:', user.email);
      console.log('✅ Authentication state updated');
      
      return user;
    } catch (error) {
      console.error('❌ Login Error:', error.response?.data || error.message);
      
      // Better error handling for network errors
      if (error.isNetworkError || error.code === 'NETWORK_ERROR') {
        Alert.alert('Network Error', 'Please check your internet connection and try again.');
      } else {
        const errorMessage = error.response?.data?.message || 'Invalid credentials';
        Alert.alert('Login Failed', errorMessage);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, phone) => {
    try {
      setLoading(true);
      console.log('📝 Starting registration request for:', email);
      
      const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, {
        name,
        email,
        password,
        phone,
      });

      console.log('✅ Registration response received:', response.status);
      return response;
    } catch (error) {
      console.error('❌ Register Error:', error.response?.data || error.message);
      
      if (error.isNetworkError || error.code === 'NETWORK_ERROR') {
        Alert.alert('Network Error', 'Please check your internet connection and try again.');
      } else {
        const errorMessage = error.response?.data?.message || 'Registration failed';
        Alert.alert('Registration Failed', errorMessage);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 Starting logout...');
      setLoading(true);
      
      // Get current tokens
      const currentAccessToken = accessToken || (await AsyncStorage.getItem('accessToken'));
      
      if (currentAccessToken) {
        console.log('📤 Notifying backend of logout...');
        try {
          await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, {}, {
            headers: { Authorization: `Bearer ${currentAccessToken}` }
          });
          console.log('✅ Backend logout successful');
        } catch (error) {
          console.warn('⚠️ Backend logout failed (continuing anyway):', error.message);
        }
      }
    } catch (error) {
      console.warn('⚠️ Logout Error (ignored):', error.message);
    } finally {
      // Always clear local data regardless of backend response
      await clearAuthData();
      console.log('✅ Logout complete - all local data cleared');
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      console.log('🔑 Sending password reset for:', email);
      const response = await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
      console.log('✅ Password reset email sent');
      return response;
    } catch (error) {
      console.error('❌ Forgot Password Error:', error.response?.data || error.message);
      
      if (error.isNetworkError || error.code === 'NETWORK_ERROR') {
        Alert.alert('Network Error', 'Please check your internet connection and try again.');
      } else {
        const errorMessage = error.response?.data?.message || 'Unable to send reset link';
        Alert.alert('Failed', errorMessage);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      setLoading(true);
      console.log('🔄 Resetting password with token');
      const response = await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
        token,
        newPassword,
      });
      console.log('✅ Password reset successful');
      return response;
    } catch (error) {
      console.error('❌ Reset Password Error:', error.response?.data || error.message);
      
      if (error.isNetworkError || error.code === 'NETWORK_ERROR') {
        Alert.alert('Network Error', 'Please check your internet connection and try again.');
      } else {
        const errorMessage = error.response?.data?.message || 'Unable to reset password';
        Alert.alert('Failed', errorMessage);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Refresh access token
  const refreshAccessToken = async () => {
    try {
      const storedRefreshToken = refreshToken || (await AsyncStorage.getItem('refreshToken'));
      
      if (!storedRefreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {}, {
        headers: { Authorization: `Bearer ${storedRefreshToken}` }
      });

      const newAccessToken = response.data.accessToken;
      await saveTokens(newAccessToken, storedRefreshToken);
      setAccessToken(newAccessToken);
      
      console.log('✅ Access token refreshed successfully');
      return newAccessToken;
    } catch (error) {
      console.error('❌ Token refresh failed:', error);
      await clearAuthData();
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        // State
        accessToken,
        refreshToken,
        userInfo,
        userData,
        loading,
        isAuthenticated,
        
        // Actions
        login,
        logout,
        register,
        forgotPassword,
        resetPassword,
        refreshAccessToken,
        clearAuthData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
