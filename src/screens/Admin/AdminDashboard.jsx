import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import AdminHome from './AdminHome';
import BusStack from './BusStack';
import ScheduleManagement from './ScheduleManagement';
import RouteManagement from './RouteManagement';
import StopManagement from './StopManagement';
import Profile from './Profile';

const Tab = createBottomTabNavigator();

const AdminDashboard = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { 
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e9ecef',
          height: 70,
          paddingBottom: 8,
          paddingTop: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 8,
        },
        tabBarActiveTintColor: '#2196f3',
        tabBarInactiveTintColor: '#6c757d',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginBottom: -2,
        },
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={AdminHome}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ fontSize: focused ? 22 : 20, color }}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Routes" 
        component={RouteManagement}
        options={{
          tabBarLabel: 'Routes',
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ fontSize: focused ? 22 : 20, color }}>🛣️</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Schedules" 
        component={ScheduleManagement}
        options={{
          tabBarLabel: 'Schedules',
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ fontSize: focused ? 22 : 20, color }}>📅</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Stops" 
        component={StopManagement}
        options={{
          tabBarLabel: 'Stops',
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ fontSize: focused ? 22 : 20, color }}>🚏</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Buses" 
        component={BusStack}
        options={{
          tabBarLabel: 'Buses',
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ fontSize: focused ? 22 : 20, color }}>🚌</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AdminDashboard; 