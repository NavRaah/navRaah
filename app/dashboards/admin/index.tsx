import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../../components';
import { useAuth } from '../../../contexts';

export default function AdminDashboard() {
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

  const adminFeatures = [
    {
      id: 1,
      title: 'User Management',
      description: 'Manage users, drivers, and permissions',
      icon: 'people-outline',
      color: 'bg-blue-50',
      iconColor: '#3B82F6',
    },
    {
      id: 2,
      title: 'Analytics',
      description: 'View app usage and performance metrics',
      icon: 'analytics-outline',
      color: 'bg-green-50',
      iconColor: '#10B981',
    },
    {
      id: 3,
      title: 'Ride Management',
      description: 'Monitor and manage all rides',
      icon: 'car-outline',
      color: 'bg-purple-50',
      iconColor: '#8B5CF6',
    },
    {
      id: 4,
      title: 'Financial Reports',
      description: 'View revenue and financial data',
      icon: 'bar-chart-outline',
      color: 'bg-orange-50',
      iconColor: '#F59E0B',
    },
    {
      id: 5,
      title: 'Support Tickets',
      description: 'Handle customer support requests',
      icon: 'chatbubbles-outline',
      color: 'bg-red-50',
      iconColor: '#EF4444',
    },
    {
      id: 6,
      title: 'System Settings',
      description: 'Configure app settings and features',
      icon: 'settings-outline',
      color: 'bg-gray-50',
      iconColor: '#6B7280',
    },
  ];

  const stats = [
    { label: 'Total Users', value: '1,234', icon: 'people', color: '#3B82F6' },
    { label: 'Active Drivers', value: '89', icon: 'car', color: '#10B981' },
    { label: 'Rides Today', value: '456', icon: 'time', color: '#8B5CF6' },
    { label: 'Revenue', value: '$12.5K', icon: 'cash', color: '#F59E0B' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <View className="px-6">
          {/* Header */}
          <View className="flex-row justify-between items-center pt-4 pb-6">
            <View>
              <Text className="text-2xl font-bold text-gray-900">
                Admin Panel
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

          {/* Stats Grid */}
          <View className="mb-8">
            <Text className="text-xl font-semibold text-gray-900 mb-4">Overview</Text>
            <View className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
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
                <Ionicons name="add-circle" size={24} color="white" />
                <Text className="text-white font-semibold mt-2">Add User</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 bg-green-500 p-4 rounded-lg">
                <Ionicons name="document-text" size={24} color="white" />
                <Text className="text-white font-semibold mt-2">Reports</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Admin Features */}
          <View className="mb-8">
            <Text className="text-xl font-semibold text-gray-900 mb-4">Management</Text>
            <View className="space-y-4">
              {adminFeatures.map((feature) => (
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
