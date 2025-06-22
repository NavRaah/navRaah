import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BusSchedule from './BusSchedule';
import BusDetails from './BusDetails';

const Stack = createStackNavigator();

const BusStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="BusSchedule" 
        component={BusSchedule}
      />
      <Stack.Screen 
        name="BusDetails" 
        component={BusDetails}
      />
    </Stack.Navigator>
  );
};

export default BusStack; 