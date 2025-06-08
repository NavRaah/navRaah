import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Alert } from 'react-native';
import { API_URL } from '@env';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [userData, setUserData] = useState(null);

  const saveStorage = async (key, value) => {
    await AsyncStorage.setItem(key, value);
  };

  const getStorage = async (key) => {
    return await AsyncStorage.getItem(key);
  };

  const removeStorage = async (key) => {
    await AsyncStorage.removeItem(key);
  };

  useEffect(() => {
    const loadTokens = async () => {
      try {
        const storedAccess = await getStorage('accessToken');
        const storedUser = await getStorage('userInfo');

        if (storedAccess) {
          setAccessToken(storedAccess);
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUserInfo(parsedUser);
            setUserData(parsedUser);
          }
        }
      } catch (error) {
        console.error('Error loading tokens:', error);
      } finally {
        setLoading(false);
      }
    };
    loadTokens();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/users/login`, {
        email,
        password,
      });

      const receivedAccessToken = response.data.accessToken;
      const user = response.data.user;

      setUserData(user);
      setUserInfo(user);
      setAccessToken(receivedAccessToken);

      await saveStorage('accessToken', receivedAccessToken);
      await saveStorage('userInfo', JSON.stringify(user));

      return user; // ✅ return the user to be used directly
    } catch (error) {
      console.error('Login Error:', error.response?.data || error.message);
      Alert.alert('Login Failed', error.response?.data?.message || 'Something went wrong');
      throw error;
    }
  };

  const register = async (name, email, password, phone) => {
    try {
      const response = await axios.post(`${API_URL}/api/users/register`, {
        name,
        email,
        password,
        phone,
      });

      return response;
    } catch (error) {
      if (error.response) {
        Alert.alert('Register Failed', error.response.data?.message || 'Something went wrong');
      } else {
        Alert.alert('Register Failed', error.message || 'Something went wrong');
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      const token = accessToken || (await getStorage('accessToken'));
      await axios.post(`${API_URL}/api/users/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.warn('Logout Error (ignored):', error.message);
    } finally {
      await removeStorage('accessToken');
      await removeStorage('userInfo');
      setAccessToken(null);
      setUserInfo(null);
      setUserData(null);
    }
  };

  const forgotPassword = async (email) => {
    try {
      return await axios.post(`${API_URL}/api/users/forgot-password`, { email });
    } catch (error) {
      console.error('Forgot Password Error:', error.message);
      Alert.alert('Failed', 'Unable to send reset link.');
      throw error;
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      return await axios.post(`${API_URL}/api/users/reset-password`, {
        token,
        newPassword,
      });
    } catch (error) {
      console.error('Reset Password Error:', error.message);
      Alert.alert('Failed', 'Unable to reset password.');
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        login,
        logout,
        register,
        forgotPassword,
        resetPassword,
        loading,
        userInfo,
        userData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
