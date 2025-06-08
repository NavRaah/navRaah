import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/HomeScreen.jsx';
import DetailsScreen from './src/screens/DetailsScreen.jsx';
import LoginScreen from './src/screens/Auth/LoginScreen.jsx';

import { AuthProvider } from './src/context/AuthContext.jsx';
import RegisterScreen from './src/screens/Auth/RegisterScreen.jsx';
import UserHome from './src/screens/User/UserHome.jsx';

import LandingScreen from './src/screens/LandingScreen'; 

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Landing">
          <Stack.Screen name="home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="details" component={DetailsScreen} options={{ headerShown: false }} />
          <Stack.Screen name="login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="register" component={RegisterScreen} options={{ headerShown: false }} />
          <Stack.Screen name="UserHome" component={UserHome} options={{ headerShown: false }} />
          <Stack.Screen name="Landing" component={LandingScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>

  );
};

export default App;
