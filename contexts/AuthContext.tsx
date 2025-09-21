import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { storage, StorageKeys } from '../lib/storage';

export type UserRole = 'user' | 'admin' | 'driver';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  profileImage?: string;
  isActive?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isOnboarded: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: Omit<User, 'id'> & { password: string; role: UserRole }) => Promise<boolean>;
  logout: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  getUserRole: () => UserRole | null;
  isUserRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState(false);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      setIsLoading(true);
      
      // Check if user has completed onboarding
      const onboarded = await storage.getItem<boolean>(StorageKeys.ONBOARDED);
      setIsOnboarded(onboarded === false);
      
      // Check if user is logged in
      const userData = await storage.getItem<User>(StorageKeys.USER);
      if (userData) {
        setUser(userData);
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, determine role based on email
      let role: UserRole = 'user';
      if (email.includes('admin')) {
        role = 'admin';
      } else if (email.includes('driver')) {
        role = 'driver';
      }
      
      const userData: User = {
        id: Date.now().toString(),
        email,
        firstName: role === 'admin' ? 'Admin' : role === 'driver' ? 'Driver' : 'John',
        lastName: 'User',
        role,
        phone: '+1234567890',
        isActive: true,
      };
      
      await storage.setItem(StorageKeys.USER, userData);
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (userData: Omit<User, 'id'> & { password: string; role: UserRole }): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        phone: userData.phone,
        isActive: true,
      };
      
      await storage.setItem(StorageKeys.USER, newUser);
      setUser(newUser);
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await storage.removeItem(StorageKeys.USER);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const completeOnboarding = async (): Promise<void> => {
    try {
      await storage.setItem(StorageKeys.ONBOARDED, true);
      setIsOnboarded(true);
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  const getUserRole = (): UserRole | null => {
    return user?.role || null;
  };

  const isUserRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isOnboarded,
    login,
    signup,
    logout,
    completeOnboarding,
    getUserRole,
    isUserRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
