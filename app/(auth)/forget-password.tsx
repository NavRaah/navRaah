import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input } from '../../components';

export default function ForgetPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'OTP Sent', 
        'We have sent a verification code to your email address. Please check your inbox.',
        [
          { text: 'OK', onPress: () => router.back() }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = () => {
    router.push('/(auth)/login' as any);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 px-6 bg-white">
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
            <Text className="text-3xl font-bold text-gray-900 mb-2">Forget Password</Text>
            <Text className="text-gray-600 text-center">Don't worry it happens. Please enter the address associate with your account.</Text>
          </View>

          {/* Form */}
          <View className="flex-1">
            <Input
              label="Email address"
              placeholder="Enter your email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              icon="mail-outline"
            />

            {/* Send OTP Button */}
            <Button
              title={isLoading ? 'Sending...' : 'Send OTP'}
              onPress={handleSendOTP}
              disabled={isLoading}
              loading={isLoading}
            />
          </View>

          {/* Sign In Link */}
          <View className="flex-row justify-center items-center pb-8">
            <Text className="text-gray-600">You remember you password? </Text>
            <TouchableOpacity onPress={handleSignIn}>
              <Text className="text-blue-500 font-semibold">Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
