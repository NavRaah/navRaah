import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../contexts';
import "../global.css";

export default function Index() {
  const { user, isLoading, isOnboarded } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!isOnboarded) {
        // User hasn't completed onboarding - show onboarding first
        router.replace('/onboarding');
      } else if (!user) {
        // User completed onboarding but not logged in - show login
        router.replace('/(auth)/login');
      } else {
        // User is logged in - redirect based on role
        switch (user.role) {
          case 'user':
            router.replace('/dashboards/user' as any);
            break;
          case 'admin':
            router.replace('/dashboards/admin' as any);
            break;
          case 'driver':
            router.replace('/dashboards/driver' as any);
            break;
          default:
            router.replace('/dashboards/user' as any);
        }
      }
    }
  }, [user, isLoading, isOnboarded]);

  // Show loading screen while checking auth state
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <ActivityIndicator size="large" color="#3B82F6" />
    </View>
  );
}
