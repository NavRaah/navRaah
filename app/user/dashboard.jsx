import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';

const BUS_SCHEDULES = [
  { id: '1', route: 'Saloh ➝ Una ➝ IIIT Una', time: '08:00 AM' },
  { id: '2', route: 'IIIT Una ➝ Una ➝ Saloh', time: '02:30 PM' },
  { id: '3', route: 'Jajon Morh ➝ IIIT Una', time: '09:15 AM' },
  { id: '4', route: 'Una ➝ Jajon Morh ➝ IIIT Una', time: '01:00 PM' },
  { id: '5', route: 'Mehatpur ➝ Una ➝ IIIT Una', time: '07:30 AM' },
];

export default function BusSchedule() {
  const [search, setSearch] = useState('');
  const [filteredBuses, setFilteredBuses] = useState(BUS_SCHEDULES);
  const router = useRouter();
  const baseURL = process.env.EXPO_PUBLIC_API_URL;

  const handleSearch = (text) => {
    setSearch(text);
    const filtered = BUS_SCHEDULES.filter((bus) =>
      bus.route.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredBuses(filtered);
  };

  const handleLogout = async () => {
    try {
      const res = await fetch(`${baseURL}/api/users/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert('Success', 'Logout successful');
        router.replace('/Login');
      } else {
        Alert.alert('Logout Failed', data.message || 'Unable to logout');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Error', 'An error occurred while logging out.');
    }
  };

  const handleBusTap = (route, time) => {
    Alert.alert('Bus Details', `${route}\nDeparture: ${time}`);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.busCard}
      onPress={() => handleBusTap(item.route, item.time)}
    >
      <Text style={styles.routeText}>{item.route}</Text>
      <Text style={styles.timeText}>Departure: {item.time}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🚌 Passenger Dashboard</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search for stop or route..."
        value={search}
        onChangeText={handleSearch}
      />

      <FlatList
        data={filteredBuses}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No buses found</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f3f4f6' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1f2937' },
  logoutBtn: {
    backgroundColor: '#dc2626',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  logoutText: { color: '#fff', fontWeight: 'bold' },
  searchInput: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 16,
    borderColor: '#d1d5db',
    borderWidth: 1,
  },
  busCard: {
    backgroundColor: '#ffffff',
    padding: 18,
    marginVertical: 6,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  routeText: { fontSize: 17, fontWeight: '600', color: '#111827' },
  timeText: { fontSize: 14, color: '#6b7280', marginTop: 4 },
  emptyText: { textAlign: 'center', color: '#9ca3af', marginTop: 20 },
});
