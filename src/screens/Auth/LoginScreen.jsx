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

  const navigation = useNavigation();
  const { login } = useContext(AuthContext); // removed userData

  const handleLogin = async () => {
    try {
      const user = await login(email, password); // ✅ user returned from context
      const role = user?.role;

      Toast.show({
        type: 'success',
        text1: 'Login Successful',
      });

      console.log('User Role:', role);

      if (role === 'admin') {
        navigation.replace('AdminHome');
      } else if (role === 'driver') {
        navigation.replace('DriverHome');
      } else if (role === 'user') {
        navigation.replace('UserHome');
      } else {
        Toast.show({
          type: 'info',
          text1: 'Unknown Role',
          text2: 'Navigating to default home screen.',
        });
        navigation.replace('Home'); // ✅ make sure this route exists
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: error?.message || 'Please check your credentials',
      });
    }
  };

  const handleForgotPassword = () => {
    Toast.show({
      type: 'info',
      text1: 'Forgot Password?',
      text2: 'Redirecting to recovery screen...',
    });
    navigation.navigate('ForgotPassword');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' || Platform.OS === 'android' ? 'padding' : null}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoWrapper}>
            <Image
              source={images.logo}
              resizeMode="contain"
              style={styles.logo}
            />
            <Text style={styles.logoText}>NAVRAAH</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Login</Text>

            <InputField
              label="Email"
              placeholder="Enter your Email"
              value={email}
              onChangeText={setEmail}
            />
            <InputField
              label="Password"
              placeholder="Enter your password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('register')}>
              <Text style={styles.forgotText}>Create an account? Register</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Toast />
    </SafeAreaView>
  );
};

export default LoginScreen;
