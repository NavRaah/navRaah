import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Alert, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components';
import { useAuth } from '../../contexts';

export default function HomeScreen() {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login' as any);
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6">
        {/* Header */}
        <View className="flex-row justify-between items-center pt-4 pb-6">
          <View>
            <Text className="text-2xl font-bold text-gray-900">
              Welcome, {user?.firstName}!
            </Text>
            <Text className="text-gray-600">You're successfully logged in</Text>
          </View>
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="secondary"
            size="small"
            className="bg-red-500"
          />
        </View>

        {/* Main Content */}
        <View className="flex-1 justify-center items-center">
          <View className="items-center mb-8">
            <View className="w-24 h-24 bg-green-100 rounded-full items-center justify-center mb-6">
              <Ionicons name="checkmark-circle" size={48} color="#10B981" />
            </View>
            <Text className="text-3xl font-bold text-gray-900 mb-4">Success!</Text>
            <Text className="text-lg text-gray-600 text-center leading-6">
              You have successfully completed the authentication flow.{'\n'}
              This is your main app screen.
            </Text>
          </View>

          {/* Feature Cards */}
          <View className="w-full space-y-4">
            <View className="bg-blue-50 p-6 rounded-xl">
              <View className="flex-row items-center mb-3">
                <Ionicons name="shield-checkmark" size={24} color="#3B82F6" />
                <Text className="text-xl font-semibold text-gray-900 ml-3">Secure Authentication</Text>
              </View>
              <Text className="text-gray-600">
                Your account is protected with industry-standard security measures.
              </Text>
            </View>

            <View className="bg-green-50 p-6 rounded-xl">
              <View className="flex-row items-center mb-3">
                <Ionicons name="rocket" size={24} color="#10B981" />
                <Text className="text-xl font-semibold text-gray-900 ml-3">Ready to Go</Text>
              </View>
              <Text className="text-gray-600">
                Your app is now ready for you to start building amazing features.
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View className="pb-8">
          <Text className="text-center text-gray-500 text-sm">
            Built with React Native, Expo Router, and NativeWind
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
