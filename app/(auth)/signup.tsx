import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input } from '../../components';
import { useAuth } from '../../contexts';
import { validateForm } from '../../lib';

export default function SignUpScreen() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const { signup } = useAuth();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFormValidation = () => {
    const validation = validateForm(formData);
    
    if (!validation.isValid) {
      Alert.alert('Validation Error', validation.errors.join('\n'));
      return false;
    }

    if (!agreeToTerms) {
      Alert.alert('Error', 'Please agree to the Terms and Conditions');
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    if (!handleFormValidation()) return;

    setIsLoading(true);
    
    try {
      const success = await signup({
        firstName: formData.name,
        lastName: '', // Not required, using empty string
        email: formData.email,
        password: formData.password,
        role: 'user', // Default role for all new registrations
        phone: formData.phone,
      });
      
      if (success) {
        Alert.alert('Success', 'Account created successfully!', [
          { text: 'OK', onPress: () => router.replace('/' as any) }
        ]);
      } else {
        Alert.alert('Error', 'Failed to create account. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    router.push('/(auth)/login' as any);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="px-6 bg-white">
            {/* Illustration */}
            <View className="items-center pt-8 pb-6">
              <View className="w-64 h-48 rounded-2xl items-center justify-center">
                <Image 
                  source={require('../../assets/pics/bus.png')} 
                  className="w-48 h-48 rounded-xl"
                  resizeMode="cover"
                />
              </View>
            </View>

            {/* Header */}
            <View className="items-center pb-8">
              <Text className="text-3xl font-bold text-gray-900 mb-2">Sign Up</Text>
              <Text className="text-gray-600 text-center">Fill all the details to continue.</Text>
            </View>

            {/* Form */}
            <View className="pb-8">
              {/* Name Field */}
              <Input
                label="Full name"
                placeholder="Enter your full name"
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                autoCapitalize="words"
                icon="person-outline"
              />

              <Input
                label="Email address"
                placeholder="Enter your email"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                icon="mail-outline"
              />

              <Input
                label="Phone Number"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChangeText={(value) => handleInputChange('phone', value)}
                keyboardType="phone-pad"
                icon="call-outline"
              />

              <Input
                label="Password"
                placeholder="Create a password"
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                secureTextEntry={!showPassword}
                icon="lock-closed-outline"
                rightIcon={showPassword ? "eye-off-outline" : "eye-outline"}
                onRightIconPress={() => setShowPassword(!showPassword)}
              />

              <Input
                label="Confirm Password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChangeText={(value) => handleInputChange('confirmPassword', value)}
                secureTextEntry={!showConfirmPassword}
                icon="lock-closed-outline"
                rightIcon={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
              />


              {/* Terms and Conditions */}
              <TouchableOpacity 
                onPress={() => setAgreeToTerms(!agreeToTerms)}
                className="flex-row items-center mb-6"
              >
                <View className={`w-5 h-5 rounded border-2 mr-3 items-center justify-center ${
                  agreeToTerms ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                }`}>
                  {agreeToTerms && <Text className="text-white text-xs">✓</Text>}
                </View>
                <Text className="text-gray-600 flex-1">
                  By signing up, you are agree to our{' '}
                  <Text className="text-blue-500 font-medium">Terms & Conditions</Text>
                  {' '}and{' '}
                  <Text className="text-blue-500 font-medium">Privacy Policy</Text>
                </Text>
              </TouchableOpacity>

              {/* Sign Up Button */}
              <Button
                title={isLoading ? 'Creating Account...' : 'Create Account'}
                onPress={handleSignUp}
                disabled={isLoading}
                loading={isLoading}
                className="mb-6"
              />

            </View>

            {/* Login Link */}
            <View className="flex-row justify-center items-center pb-8">
              <Text className="text-gray-600">Already have an Account? </Text>
              <TouchableOpacity onPress={handleLogin}>
                <Text className="text-blue-500 font-semibold">Sign in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
