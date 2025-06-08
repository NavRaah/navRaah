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
} from 'react-native';
import Toast from 'react-native-toast-message';
import { AuthContext } from '../../context/AuthContext';
import InputField from '../../components/InputField';
import { styles } from '../../styles/authStyles';
import images from '../../assests/images/index';

const RegisterScreen = ({ navigation }) => {
  const { register } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !phone || !password) {
      setTimeout(() => {
        Toast.show({
          type: 'error',
          text1: 'All fields are required',
        });
      }, 1000);
      return;
    }

    try {
      await register(name, email, password, phone);
      setTimeout(() => {
        Toast.show({
          type: 'success',
          text1: 'Registration Successful',
        });
      }, 1000);
      navigation.navigate('login');
    } catch (error) {
      setTimeout(() => {
        Toast.show({
          type: 'error',
          text1: 'Registration Failed',
          text2: error?.response?.data?.message || 'Try again later',
        });
      }, 1000);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' || Platform.OS === 'android' ? 'padding' : null}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <View style={styles.logoWrapper}>
            <Image source={images.logo} resizeMode="contain" style={styles.logo} />
            <Text style={styles.logoText}>NAVRAAH</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Register</Text>

            <InputField label="Name" placeholder="Enter your name" value={name} onChangeText={setName} />
            <InputField label="Email" placeholder="Enter your email" value={email} onChangeText={setEmail} />
            <InputField label="Phone" placeholder="Enter your phone" value={phone} onChangeText={setPhone} />
            <InputField
              label="Password"
              placeholder="Enter your password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('login')}>
              <Text style={styles.forgotText}>Already have an account? Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Toast />
    </SafeAreaView>
  );
};

export default RegisterScreen;
