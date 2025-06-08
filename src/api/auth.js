import axios from 'axios';
import { LOGIN_URL } from '../constants/urls';

export const loginUser = async (studentId, password) => {
  try {
    const response = await axios.post(LOGIN_URL, {
      studentId,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Login failed';
  }
};
