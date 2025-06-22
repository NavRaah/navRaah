import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  Image,
  ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { AuthContext } from '../../context/AuthContext';
import InputField from '../../components/InputField';
import { styles } from '../../styles/authStyles';
import images from '../../assests/images/index';

const RegisterScreen = ({ navigation }) => {
  const { register, loading } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    // Enhanced validation
    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim() || !confirmPassword.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'All fields are required',
      });
      return;
    }

    // Name validation
    if (name.trim().length < 2) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Name must be at least 2 characters long',
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

    // Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone.trim().replace(/\s+/g, ''))) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please enter a valid 10-digit phone number',
      });
      return;
    }

    // Password validation
    if (password.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Password must be at least 6 characters long',
      });
      return;
    }

    // Password confirmation
    if (password !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Passwords do not match',
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await register(name.trim(), email.trim(), password, phone.trim());
      
      // Check response
      if (response && response.status >= 200 && response.status < 300) {
        Toast.show({
          type: 'success',
          text1: 'Registration Successful',
          text2: 'You can now login with your credentials',
        });
        
        // Clear form
        setName('');
        setEmail('');
        setPhone('');
        setPassword('');
        setConfirmPassword('');
        
        // Navigate to login
        navigation.navigate('login');
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle different types of errors
      let errorTitle = 'Registration Failed';
      let errorMessage = 'Please try again later';

      if (error.isNetworkError) {
        errorTitle = 'Network Error';
        errorMessage = 'Please check your internet connection';
      } else if (error.response?.status === 409) {
        errorMessage = 'User with this email already exists';
      } else if (error.response?.status === 422) {
        errorMessage = 'Invalid data provided';
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
            <Image source={images.logo} resizeMode="contain" style={styles.logo} />
            <Text style={styles.logoText}>NAVRAAH</Text>
            <Text style={styles.tagline}>Join Our Transportation Network</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to get started</Text>

            <InputField 
              label="Full Name" 
              placeholder="Enter your full name" 
              value={name} 
              onChangeText={setName}
              autoCapitalize="words"
              autoCorrect={false}
            />
            
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
              label="Phone Number" 
              placeholder="Enter your phone number" 
              value={phone} 
              onChangeText={setPhone}
              keyboardType="phone-pad"
              maxLength={10}
            />
            
            <InputField
              label="Password"
              placeholder="Create a password (min 6 characters)"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
            />

            <InputField
              label="Confirm Password"
              placeholder="Confirm your password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              autoCapitalize="none"
            />

            <TouchableOpacity 
              style={[styles.button, (isLoading || loading) && styles.buttonDisabled]} 
              onPress={handleRegister}
              disabled={isLoading || loading}
            >
              {isLoading || loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator color="#fff" size="small" />
                  <Text style={[styles.buttonText, { marginLeft: 8 }]}>Creating Account...</Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Already have an account?</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity 
              onPress={() => navigation.navigate('login')}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>Sign In Instead</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Toast />
    </SafeAreaView>
  );
};

export default RegisterScreen;
