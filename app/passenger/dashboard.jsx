import React from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const PassengerDashboard = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch('http://10.21.2.176:3000/api/users/logout', {
        method: 'POST',
        credentials: 'include',
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert('Success', 'Logout successful');
        router.replace('/Login'); // Use your actual login screen route here
      } else {
        Alert.alert('Logout Failed', data.message || 'Unable to logout');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Error', 'An error occurred while logging out.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Passenger Dashboard</Text>
        <Text style={styles.subtitle}>Welcome to your dashboard!</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PassengerDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#4b5563',
    marginBottom: 24,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#dc2626',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
