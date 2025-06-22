import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, Modal } from 'react-native';
import Toast from 'react-native-toast-message';

const StopManagement = () => {
  const [stops, setStops] = useState([
    {
      id: 1,
      name: 'Central Bus Station',
      code: 'CBS-001',
      description: 'Main central bus station with all amenities and facilities for comfortable passenger experience.',
      location: 'City Center, Downtown',
      routes: 12,
      dailyPassengers: '2,500+',
      status: 'Active',
      facilities: ['Digital Display', 'Waiting Shelter', 'CCTV Security', 'Wheelchair Access']
    },
    {
      id: 2,
      name: 'Airport Terminal Stop',
      code: 'ATS-002', 
      description: 'Premium bus stop at airport terminal with express services and traveler facilities.',
      location: 'Airport Terminal 1',
      routes: 5,
      dailyPassengers: '800+',
      status: 'Active',
      facilities: ['Luggage Storage', 'WiFi Zone', 'Information Desk', 'Covered Waiting']
    },
    {
      id: 3,
      name: 'University Main Gate',
      code: 'UMG-003',
      description: 'Student-focused bus stop with high frequency services during academic hours.',
      location: 'University Campus',
      routes: 8,
      dailyPassengers: '1,200+',
      status: 'Active',
      facilities: ['Student Seating', 'Book Stands', 'Safety Lighting', 'Emergency Call']
    }
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStop, setSelectedStop] = useState(null);

  const renderStopCard = (stop) => (
    <View key={stop.id} style={styles.stopCard}>
      <View style={styles.stopHeader}>
        <View style={styles.stopIconContainer}>
          <Text style={styles.stopIcon}>🚏</Text>
        </View>
        <View style={styles.stopInfo}>
          <Text style={styles.stopTitle}>{stop.name}</Text>
          <Text style={styles.stopCode}>Stop Code: {stop.code}</Text>
          <View style={styles.stopMetrics}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Location</Text>
              <Text style={styles.metricValue}>{stop.location}</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Daily Passengers</Text>
              <Text style={styles.metricValue}>{stop.dailyPassengers}</Text>
            </View>
          </View>
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: '#28a745' }]} />
            <Text style={styles.statusText}>{stop.status}</Text>
          </View>
        </View>
      </View>

      <View style={styles.stopContent}>
        <Text style={styles.stopDescription}>{stop.description}</Text>
        
        <View style={styles.stopStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stop.routes}</Text>
            <Text style={styles.statLabel}>Routes</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>4.8</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>24/7</Text>
            <Text style={styles.statLabel}>Service</Text>
          </View>
        </View>

        <Text style={styles.facilitiesTitle}>Stop Facilities:</Text>
        <View style={styles.facilitiesList}>
          {stop.facilities.map((facility, index) => (
            <View key={index} style={styles.facilityItem}>
              <View style={styles.facilityDot} />
              <Text style={styles.facilityText}>{facility}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={[styles.actionBtn, styles.manageBtn]}>
            <Text style={styles.manageBtnText}>Edit Stop</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.viewBtn]}>
            <Text style={styles.viewBtnText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Stop Management</Text>
          <Text style={styles.headerSubtitle}>
            Manage your bus stops.
          </Text>
        </View>
        <TouchableOpacity style={styles.addBtn}>
          <Text style={styles.addBtnText}>+ Add Stop</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {stops.map(renderStopCard)}
        
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Bus Stop Management System</Text>
          <Text style={styles.infoText}>
            Manage your bus stops.
        </Text>
      </View>
      </ScrollView>

      <Toast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerContent: {
    flex: 1,
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6c757d',
    lineHeight: 20,
  },
  addBtn: {
    backgroundColor: '#17a2b8',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    marginTop: 8,
  },
  addBtnText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  stopCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  stopHeader: {
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  stopIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#e6f3ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stopIcon: {
    fontSize: 32,
  },
  stopInfo: {
    flex: 1,
  },
  stopTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  stopCode: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 12,
  },
  stopMetrics: {
    marginBottom: 8,
  },
  metricItem: {
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#28a745',
    fontWeight: '600',
  },
  stopContent: {
    padding: 20,
  },
  stopDescription: {
    fontSize: 14,
    color: '#495057',
    lineHeight: 22,
    marginBottom: 16,
  },
  stopStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6c757d',
  },
  facilitiesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  facilitiesList: {
    marginBottom: 20,
  },
  facilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  facilityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#17a2b8',
    marginRight: 10,
  },
  facilityText: {
    fontSize: 13,
    color: '#495057',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  manageBtn: {
    backgroundColor: '#87ceeb',
  },
  manageBtnText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  viewBtn: {
    backgroundColor: '#2196f3',
  },
  viewBtnText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    marginTop: 10,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 13,
    color: '#6c757d',
    lineHeight: 20,
  },
});

export default StopManagement;