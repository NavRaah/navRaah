import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, Dimensions } from 'react-native';
import AdminHome from './AdminHome';
import BusStack from './BusStack';
import ScheduleManagement from './ScheduleManagement';
import RouteManagement from './RouteManagement';
import StopManagement from './StopManagement';
import Profile from './Profile';
import { PersonStandingIcon } from 'lucide-react-native';
const Tab = createBottomTabNavigator();
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const AdminDashboard = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { 
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e9ecef',
          height: SCREEN_WIDTH > 400 ? 80 : 70,
          paddingBottom: SCREEN_WIDTH > 400 ? 12 : 8,
          paddingTop: SCREEN_WIDTH > 400 ? 12 : 8,
          // marginBottom: SCREEN_WIDTH > 400 ? '15%' : '10%',
          paddingHorizontal: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.15,
          shadowRadius: 6,
          elevation: 10,
        },
        tabBarActiveTintColor: '#2196f3',
        tabBarInactiveTintColor: '#6c757d',
        tabBarLabelStyle: {
          fontSize: SCREEN_WIDTH > 400 ? 13 : 11,
          fontWeight: '600',
          marginTop: 4,
          marginBottom: 2,
        },
        tabBarIconStyle: {
          marginBottom: 0,
        },
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={AdminHome}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ 
              fontSize: focused ? (SCREEN_WIDTH > 400 ? 26 : 22) : (SCREEN_WIDTH > 400 ? 24 : 20), 
              color,
              marginBottom: 2,
            }}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Routes" 
        component={RouteManagement}
        options={{
          tabBarLabel: 'Routes',
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ 
              fontSize: focused ? (SCREEN_WIDTH > 400 ? 26 : 22) : (SCREEN_WIDTH > 400 ? 24 : 20), 
              color,
              marginBottom: 2 
            }}>🛣️</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Schedules" 
        component={ScheduleManagement}
        options={{
          tabBarLabel: 'Schedules',
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ 
              fontSize: focused ? (SCREEN_WIDTH > 400 ? 26 : 22) : (SCREEN_WIDTH > 400 ? 24 : 20), 
              color,
              marginBottom: 2 
            }}>📅</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Stops" 
        component={StopManagement}
        options={{
          tabBarLabel: 'Stops',
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ 
              fontSize: focused ? (SCREEN_WIDTH > 400 ? 26 : 22) : (SCREEN_WIDTH > 400 ? 24 : 20), 
              color,
              marginBottom: 2 
            }}>🚏</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Buses" 
        component={BusStack}
        options={{
          tabBarLabel: 'Buses',
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ 
              fontSize: focused ? (SCREEN_WIDTH > 400 ? 26 : 22) : (SCREEN_WIDTH > 400 ? 24 : 20), 
              color,
              marginBottom: 2 
            }}>🚌</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={Profile}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ 
              fontSize: focused ? (SCREEN_WIDTH > 400 ? 26 : 22) : (SCREEN_WIDTH > 400 ? 24 : 20), 
              color,
              marginBottom: 2 
            }}><PersonStandingIcon size={24} color={color} /></Text>  
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AdminDashboard; 