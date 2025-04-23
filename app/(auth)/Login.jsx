import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import CheckBox from 'expo-checkbox';
import { Link } from 'expo-router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />


      <View style={styles.checkboxRow}>
        <CheckBox value={rememberMe} onValueChange={setRememberMe} />
        <Text style={styles.checkboxLabel}>Remember Me</Text>
      </View>

      <TouchableOpacity style={styles.buttonPrimary}>
        <Text style={styles.buttonText}>LOG IN</Text>
      </TouchableOpacity>

      <Text style={styles.forgotText}>Forgot password ?</Text>

      <Text style={styles.signupPrompt}>
              Create a new account?{" "}
              <Link href={"/SignUp"}>
                <Text style={styles.signupLink}>SignUp</Text>
              </Link>
            </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingHorizontal: 24,
    flex: 1,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 32,
    textTransform: 'lowercase',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 12,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 10,
    marginTop: 6,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginTop: 6,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 14,
  },
  buttonPrimary: {
    backgroundColor: '#4c6ef5',
    paddingVertical: 14,
    borderRadius: 6,
    marginTop: 24,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  signupPrompt: {
    marginTop: 24,
    textAlign: "center",
    fontSize: 14,
    color: "#666",
  },
  signupLink: {
    color: "#4c6ef5",
    fontWeight: "bold",
    fontSize: 16,
  },
  forgotText: {
    marginTop: 12,
    textAlign: 'center',
    fontSize: 14,
    color: '#888',
  },
  buttonOutline: {
    borderColor: '#4c6ef5',
    borderWidth: 1,
    paddingVertical: 14,
    borderRadius: 6,
    marginTop: 20,
    alignItems: 'center',
  },
  outlineText: {
    color: '#4c6ef5',
    fontWeight: 'bold',
  },
});
