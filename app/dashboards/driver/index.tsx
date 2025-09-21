import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../../components';
import { useAuth } from '../../../contexts';

export default function DriverDashboard() {
  const { logout, user } = useAuth();
  const [isOnline, setIsOnline] = useState(false);

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

  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline);
    Alert.alert(
      isOnline ? 'Going Offline' : 'Going Online',
      isOnline ? 'You are now offline and won\'t receive ride requests.' : 'You are now online and ready to receive ride requests.'
    );
  };

  const driverFeatures = [
    {
      id: 1,
      title: 'Ride Requests',
      description: 'View and accept incoming ride requests',
      icon: 'car-outline',
      color: 'bg-blue-50',
      iconColor: '#3B82F6',
    },
    {
      id: 2,
      title: 'Earnings',
      description: 'View your daily and weekly earnings',
      icon: 'cash-outline',
      color: 'bg-green-50',
      iconColor: '#10B981',
    },
    {
      id: 3,
      title: 'Ride History',
      description: 'View your completed rides',
      icon: 'time-outline',
      color: 'bg-purple-50',
      iconColor: '#8B5CF6',
    },
    {
      id: 4,
      title: 'Profile',
      description: 'Update your driver profile and documents',
      icon: 'person-outline',
      color: 'bg-orange-50',
      iconColor: '#F59E0B',
    },
  ];

  const todayStats = [
    { label: 'Rides Completed', value: '12', icon: 'checkmark-circle', color: '#10B981' },
    { label: 'Earnings Today', value: '$156', icon: 'cash', color: '#F59E0B' },
    { label: 'Rating', value: '4.8', icon: 'star', color: '#8B5CF6' },
    { label: 'Online Time', value: '6h 30m', icon: 'time', color: '#3B82F6' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <View className="px-6">
          {/* Header */}
          <View className="flex-row justify-between items-center pt-4 pb-6">
            <View>
              <Text className="text-2xl font-bold text-gray-900">
                Driver Dashboard
              </Text>
              <Text className="text-gray-600">Welcome, {user?.firstName}</Text>
            </View>
            <Button
              title="Logout"
              onPress={handleLogout}
              variant="secondary"
              size="small"
              className="bg-red-500"
            />
          </View>

          {/* Online Status */}
          <View className="mb-8">
            <View className={`${isOnline ? 'bg-green-500' : 'bg-gray-500'} p-6 rounded-xl`}>
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-white text-lg font-semibold">
                    {isOnline ? 'You\'re Online' : 'You\'re Offline'}
                  </Text>
                  <Text className="text-white/80">
                    {isOnline ? 'Ready to accept rides' : 'Not receiving ride requests'}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={toggleOnlineStatus}
                  className={`${isOnline ? 'bg-white/20' : 'bg-white/20'} px-4 py-2 rounded-lg`}
                >
                  <Text className="text-white font-medium">
                    {isOnline ? 'Go Offline' : 'Go Online'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Today's Stats */}
          <View className="mb-8">
            <Text className="text-xl font-semibold text-gray-900 mb-4">Today's Performance</Text>
            <View className="grid grid-cols-2 gap-4">
              {todayStats.map((stat, index) => (
                <View key={index} className="bg-gray-50 p-4 rounded-lg">
                  <View className="flex-row items-center justify-between">
                    <View>
                      <Text className="text-2xl font-bold text-gray-900">{stat.value}</Text>
                      <Text className="text-gray-600 text-sm">{stat.label}</Text>
                    </View>
                    <Ionicons name={stat.icon as any} size={24} color={stat.color} />
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Quick Actions */}
          <View className="mb-8">
            <Text className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</Text>
            <View className="flex-row space-x-3">
              <TouchableOpacity className="flex-1 bg-blue-500 p-4 rounded-lg">
                <Ionicons name="car" size={24} color="white" />
                <Text className="text-white font-semibold mt-2">Start Ride</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 bg-green-500 p-4 rounded-lg">
                <Ionicons name="cash" size={24} color="white" />
                <Text className="text-white font-semibold mt-2">Withdraw</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Driver Features */}
          <View className="mb-8">
            <Text className="text-xl font-semibold text-gray-900 mb-4">Services</Text>
            <View className="space-y-4">
              {driverFeatures.map((feature) => (
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
            <Text className="text-xl font-semibold text-gray-900 mb-4">Recent Rides</Text>
            <View className="bg-gray-50 p-4 rounded-lg">
              <Text className="text-gray-600 text-center">
                No recent rides found. Go online to start receiving ride requests!
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
