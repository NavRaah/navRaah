import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';

import InputField from '../../components/InputField';
import { AuthContext } from '../../context/AuthContext';
import { styles } from '../../styles/authStyles';
import images from '../../assests/images/index';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();
  const { login, loading } = useContext(AuthContext);

  const handleLogin = async () => {
    // Enhanced validation
    if (!email.trim() || !password.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please fill in all fields',
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please enter a valid email address',
      });
      return;
    }

    try {
      setIsLoading(true);
      const user = await login(email.trim(), password);
      
      // Check if user data is received
      if (!user) {
        throw new Error('Login failed: No user data received');
      }

      const role = user?.role;

      Toast.show({
        type: 'success',
        text1: 'Login Successful',
        text2: `Welcome back, ${user.name || user.email}!`,
      });

      console.log('User Role:', role);
      console.log('User Data:', user);

      // Role-based navigation
      if (role === 'admin') {
        navigation.replace('AdminHome');
      } else if (role === 'driver') {
        navigation.replace('DriverHome');
      } else if (role === 'user') {
        navigation.replace('UserHome');
      } else {
        console.warn('Unknown role:', role);
        Toast.show({
          type: 'info',
          text1: 'Unknown Role',
          text2: 'Navigating to default home screen.',
        });
        navigation.replace('UserHome'); // Default to user home
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle different types of errors
      let errorTitle = 'Login Failed';
      let errorMessage = 'Please check your credentials and try again';

      if (error.isNetworkError) {
        errorTitle = 'Network Error';
        errorMessage = 'Please check your internet connection';
      } else if (error.response?.status === 401) {
        errorMessage = 'Invalid email or password';
      } else if (error.response?.status === 429) {
        errorMessage = 'Too many login attempts. Please try again later';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      Toast.show({
        type: 'error',
        text1: errorTitle,
        text2: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (!email.trim()) {
      Toast.show({
        type: 'info',
        text1: 'Enter Email',
        text2: 'Please enter your email address first',
      });
      return;
    }

    Toast.show({
      type: 'info',
      text1: 'Forgot Password',
      text2: 'Password reset feature coming soon...',
    });
    // TODO: Implement forgot password flow
    // navigation.navigate('ForgotPassword', { email });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoWrapper}>
            <Image
              source={images.logo}
              resizeMode="contain"
              style={styles.logo}
            />
            <Text style={styles.logoText}>NAVRAAH</Text>
            <Text style={styles.tagline}>Your Smart Transportation Partner</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>

            <InputField
              label="Email Address"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            
            <InputField
              label="Password"
              placeholder="Enter your password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
            />

            <TouchableOpacity 
              style={[styles.button, (isLoading || loading) && styles.buttonDisabled]} 
              onPress={handleLogin}
              disabled={isLoading || loading}
            >
              {isLoading || loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator color="#fff" size="small" />
                  <Text style={[styles.buttonText, { marginLeft: 8 }]}>Signing In...</Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={handleForgotPassword}
              style={styles.forgotButton}
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity 
              onPress={() => navigation.navigate('register')}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>Create New Account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Toast />
    </SafeAreaView>
  );
};

export default LoginScreen;
