import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, Modal } from 'react-native';
import Toast from 'react-native-toast-message';

const RouteManagement = () => {
  const [routes, setRoutes] = useState([
    {
      id: 1,
      name: 'City Center Route',
      code: 'CCR-001',
      description: 'Main route connecting all major city center locations with optimized stops for maximum passenger convenience.',
      stops: 15,
      distance: '25.5 km',
      duration: '45 mins',
      price: '₹25',
      status: 'Active',
      features: ['GPS Tracking', 'Real-time Updates', 'Wheelchair Accessible', 'Air Conditioned']
    },
    {
      id: 2,
      name: 'Airport Express',
      code: 'AEX-002', 
      description: 'Express route to airport with minimal stops and premium services for travelers and commuters.',
      stops: 8,
      distance: '35.2 km',
      duration: '35 mins',
      price: '₹45',
      status: 'Active',
      features: ['Luggage Space', 'WiFi Available', 'Express Service', 'Premium Seating']
    },
    {
      id: 3,
      name: 'University Circuit',
      code: 'UC-003',
      description: 'Educational route covering major universities and colleges with student-friendly timings and affordable fares.',
      stops: 20,
      distance: '18.7 km', 
      duration: '40 mins',
      price: '₹15',
      status: 'Active',
      features: ['Student Discount', 'Book Storage', 'Frequent Service', 'Safety Cameras']
    }
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);

  const renderRouteCard = (route) => (
    <View key={route.id} style={styles.routeCard}>
      <View style={styles.routeHeader}>
        <View style={styles.routeIconContainer}>
          <Text style={styles.routeIcon}>🛣️</Text>
        </View>
        <View style={styles.routeInfo}>
          <Text style={styles.routeTitle}>{route.name}</Text>
          <Text style={styles.routeCode}>Route Code: {route.code}</Text>
          <View style={styles.routeMetrics}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Fare</Text>
              <Text style={styles.metricValue}>{route.price}</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Duration</Text>
              <Text style={styles.metricValue}>{route.duration}</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Distance</Text>
              <Text style={styles.metricValue}>{route.distance}</Text>
            </View>
          </View>
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: '#28a745' }]} />
            <Text style={styles.statusText}>{route.status}</Text>
          </View>
        </View>
      </View>

      <View style={styles.routeContent}>
        <Text style={styles.routeDescription}>{route.description}</Text>
        
        <View style={styles.routeStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{route.stops}</Text>
            <Text style={styles.statLabel}>Bus Stops</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>24/7</Text>
            <Text style={styles.statLabel}>Availability</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>5.0</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        <Text style={styles.featuresTitle}>Route Features:</Text>
        <View style={styles.featuresList}>
          {route.features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={styles.featureDot} />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionBtn, styles.manageBtn]}
            onPress={() => {
              setSelectedRoute(route);
              setModalVisible(true);
            }}
          >
            <Text style={styles.manageBtnText}>Edit Route</Text>
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
          <Text style={styles.headerTitle}>Route Management</Text>
          <Text style={styles.headerSubtitle}>
            Manage your bus routes.
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.addBtn}
          onPress={() => {
            setSelectedRoute(null);
            setModalVisible(true);
          }}
        >
          <Text style={styles.addBtnText}>+ Add Route</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {routes.map(renderRouteCard)}
        
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Route Management System</Text>
          <Text style={styles.infoText}>
            Our comprehensive route management system allows you to create, modify, and optimize bus routes with real-time traffic considerations and passenger demand analysis.
        </Text>
      </View>
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {selectedRoute ? 'Edit Route' : 'Add New Route'}
            </Text>
            <TouchableOpacity 
              style={styles.closeBtn}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Route Name</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter route name"
                defaultValue={selectedRoute?.name}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Route Code</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter route code"
                defaultValue={selectedRoute?.code}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Enter route description"
                multiline
                numberOfLines={4}
                defaultValue={selectedRoute?.description}
              />
            </View>
            
            <TouchableOpacity style={styles.saveBtn}>
              <Text style={styles.saveBtnText}>Save Route</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>

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
    backgroundColor: '#28a745',
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
  routeCard: {
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
  routeHeader: {
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  routeIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#e8f5e8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  routeIcon: {
    fontSize: 32,
  },
  routeInfo: {
    flex: 1,
  },
  routeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  routeCode: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 12,
  },
  routeMetrics: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  metricItem: {
    marginRight: 20,
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
  routeContent: {
    padding: 20,
  },
  routeDescription: {
    fontSize: 14,
    color: '#495057',
    lineHeight: 22,
    marginBottom: 16,
  },
  routeStats: {
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
  featuresTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  featuresList: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#28a745',
    marginRight: 10,
  },
  featureText: {
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
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  closeBtn: {
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  closeBtnText: {
    color: '#dc3545',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    backgroundColor: '#ffffff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveBtn: {
    backgroundColor: '#2196f3',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  saveBtnText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default RouteManagement;
