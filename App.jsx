import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/Auth/LoginScreen.jsx';

import { AuthProvider } from './src/context/AuthContext.jsx';
import RegisterScreen from './src/screens/Auth/RegisterScreen.jsx';
import UserHome from './src/screens/User/UserHome.jsx';

import LandingScreen from './src/screens/LandingScreen';
import AdminHome from './src/screens/Admin/AdminHome.jsx';
import DriverHome from './src/screens/Driver/DriverHome.jsx';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="landing">
          <Stack.Screen name="landing" component={LandingScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="register" component={RegisterScreen} options={{ headerShown: false }} />
          <Stack.Screen name="UserHome" component={UserHome} options={{ headerShown: false }} />
          <Stack.Screen name="AdminHome" component={AdminHome} options={{ headerShown: false }} />
          <Stack.Screen name="DriverHome" component={DriverHome} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>

  );
};

export default App;
