import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../../components';
import { useAuth } from '../../../contexts';

export default function UserDashboard() {
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

  const userFeatures = [
    {
      id: 1,
      title: 'Book a Ride',
      description: 'Request a ride to your destination',
      icon: 'car-outline',
      color: 'bg-blue-50',
      iconColor: '#3B82F6',
    },
    {
      id: 2,
      title: 'Ride History',
      description: 'View your past rides and receipts',
      icon: 'time-outline',
      color: 'bg-green-50',
      iconColor: '#10B981',
    },
    {
      id: 3,
      title: 'Payment Methods',
      description: 'Manage your payment options',
      icon: 'card-outline',
      color: 'bg-purple-50',
      iconColor: '#8B5CF6',
    },
    {
      id: 4,
      title: 'Support',
      description: 'Get help and contact support',
      icon: 'help-circle-outline',
      color: 'bg-orange-50',
      iconColor: '#F59E0B',
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <View className="px-6">
          {/* Header */}
          <View className="flex-row justify-between items-center pt-4 pb-6">
            <View>
              <Text className="text-2xl font-bold text-gray-900">
                Welcome, {user?.firstName}!
              </Text>
              <Text className="text-gray-600">User Dashboard</Text>
            </View>
            <Button
              title="Logout"
              onPress={handleLogout}
              variant="secondary"
              size="small"
              className="bg-red-500"
            />
          </View>

          {/* Quick Actions */}
          <View className="mb-8">
            <Text className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</Text>
            <View className="flex-row space-x-3">
              <TouchableOpacity className="flex-1 bg-blue-500 p-4 rounded-lg">
                <Ionicons name="car" size={24} color="white" />
                <Text className="text-white font-semibold mt-2">Book Ride</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 bg-green-500 p-4 rounded-lg">
                <Ionicons name="location" size={24} color="white" />
                <Text className="text-white font-semibold mt-2">Find Nearby</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Features Grid */}
          <View className="mb-8">
            <Text className="text-xl font-semibold text-gray-900 mb-4">Services</Text>
            <View className="space-y-4">
              {userFeatures.map((feature) => (
                <TouchableOpacity
                  key={feature.id}
                  className={`${feature.color} p-6 rounded-xl`}
                >
                  <View className="flex-row items-center">
                    <View className="w-12 h-12 rounded-full bg-white items-center justify-center mr-4">
                      <Ionicons name={feature.icon as any} size={24} color={feature.iconColor} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-lg font-semibold text-gray-900">
                        {feature.title}
                      </Text>
                      <Text className="text-gray-600">
                        {feature.description}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#6B7280" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Recent Activity */}
          <View className="mb-8">
            <Text className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</Text>
            <View className="bg-gray-50 p-4 rounded-lg">
              <Text className="text-gray-600 text-center">
                No recent rides found. Book your first ride to get started!
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
