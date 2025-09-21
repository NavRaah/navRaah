import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input } from '../../components';
import { useAuth } from '../../contexts';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        router.replace('/dashboards' as any);
      } else {
        Alert.alert('Error', 'Invalid email or password');
      }
    } catch (error) {
      Alert.alert('Error', 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = () => {
    router.push('/(auth)/signup' as any);
  };

  const handleForgotPassword = () => {
    router.push('/(auth)/forget-password' as any);
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
            <View className="w-64 h-48 rounded-2xl items-center justify-center ">
              <Image 
                source={require('../../assets/pics/bus.png')} 
                className="w-48 h-48 rounded-xl"
                resizeMode="cover"
              />
            </View>
          </View>

          {/* Header */}
          <View className="items-center pb-8">
            <Text className="text-3xl font-bold text-gray-900 mb-2">Sign In</Text>
            <Text className="text-gray-600 text-center">Enter valid user name & password to continue.</Text>
          </View>

          {/* Form */}
          <View className="flex-1">
            <Input
              label="User name"
              placeholder="Enter your username"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              icon="person-outline"
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              icon="lock-closed-outline"
              rightIcon={showPassword ? "eye-off-outline" : "eye-outline"}
              onRightIconPress={() => setShowPassword(!showPassword)}
            />

            {/* Forgot Password */}
            <TouchableOpacity onPress={handleForgotPassword} className="self-end mb-8">
              <Text className="text-blue-500 font-medium">Forget password</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <Button
              title={isLoading ? 'Signing In...' : 'Login'}
              onPress={handleLogin}
              disabled={isLoading}
              loading={isLoading}
              className="mb-6"
            />

          </View>

          {/* Sign Up Link */}
          <View className="flex-row justify-center items-center pb-8">
            <Text className="text-gray-600">Haven't any account? </Text>
            <TouchableOpacity onPress={handleSignUp}>
              <Text className="text-blue-500 font-semibold">Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
