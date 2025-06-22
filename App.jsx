import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useContext } from 'react';

import LoginScreen from './src/screens/Auth/LoginScreen.jsx';
import { AuthProvider, AuthContext } from './src/context/AuthContext.jsx';
import RegisterScreen from './src/screens/Auth/RegisterScreen.jsx';
import UserHome from './src/screens/User/UserHome.jsx';
import LandingScreen from './src/screens/LandingScreen';
import AdminDashboard from './src/screens/Admin/AdminDashboard.jsx';
import DriverHome from './src/screens/Driver/DriverHome.jsx';

const Stack = createNativeStackNavigator();

// Loading screen component
const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#002F6C" />
    <Text style={styles.loadingText}>🔐 Checking authentication...</Text>
    <Text style={styles.loadingSubtext}>Please wait</Text>
  </View>
);

// Navigation component that handles routing based on auth state
const AppNavigator = () => {
  const { loading, isAuthenticated, userInfo } = useContext(AuthContext);

  // Show loading screen while checking authentication
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated && userInfo ? (
          // User is authenticated - show authenticated screens based on role
          <>
            {userInfo.role === 'admin' && (
              <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
            )}
            {userInfo.role === 'driver' && (
              <Stack.Screen name="DriverHome" component={DriverHome} />
            )}
            {userInfo.role === 'user' && (
              <Stack.Screen name="UserHome" component={UserHome} />
            )}
            {/* Fallback for any other role */}
            {!['admin', 'driver', 'user'].includes(userInfo.role) && (
              <Stack.Screen name="UserHome" component={UserHome} />
            )}
          </>
        ) : (
          // User is not authenticated - show auth screens
          <>
            <Stack.Screen name="landing" component={LandingScreen} />
            <Stack.Screen name="login" component={LoginScreen} />
            <Stack.Screen name="register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#002F6C',
    marginTop: 16,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default App;
