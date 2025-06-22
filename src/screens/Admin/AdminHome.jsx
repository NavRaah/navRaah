import React, { useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { AuthContext } from '../../context/AuthContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const AdminHome = () => {
  const navigation = useNavigation();
  const { logout } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await logout();
      Toast.show({
        type: 'success',
        text1: 'Logout Successful',
        text2: 'You have been logged out successfully',
      });
      navigation.navigate('landing');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Logout Failed',
        text2: error?.message || 'Something went wrong',
      });
    }
  };

  const adminServices = [
    {
      id: 1,
      title: 'Route Management System',
      subtitle: 'Transportation Network Management',
      description: 'Advanced route planning and optimization system for efficient bus network management. Create, modify, and optimize routes with real-time traffic considerations.',
      price: 'Active',
      experience: '15+ Routes Managed',
      details: '+91 9876543210',
      color: '#28a745',
      icon: '🛣️',
      features: ['Real-time Route Optimization', 'Traffic Integration', 'Multi-stop Planning', 'GPS Tracking']
    },
    {
      id: 2,
      title: 'Schedule Management Portal',
      subtitle: 'Time & Resource Optimization',
      description: 'Comprehensive scheduling system to manage bus timings, driver assignments, and resource allocation for maximum efficiency.',
      price: 'Operational',
      experience: '24/7 Schedule Monitoring',
      details: 'Last Updated: 2 hrs ago',
      color: '#ffc107',
      icon: '📅',
      features: ['Automated Scheduling', 'Driver Management', 'Peak Hour Analysis', 'Delay Notifications']
    },
    {
      id: 3,
      title: 'Bus Stop Management',
      subtitle: 'Infrastructure & Location Services',
      description: 'Centralized management of bus stops, passenger facilities, and location-based services for enhanced passenger experience.',
      price: 'Maintained',
      experience: '50+ Bus Stops',
      details: 'Coverage: City-wide',
      color: '#17a2b8',
      icon: '🚏',
      features: ['Digital Signage', 'Accessibility Features', 'Passenger Amenities', 'Safety Monitoring']
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
      <Text style={styles.headerSubtitle}>Manage your buses, routes, schedules, and stops.</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {adminServices.map((service) => (
          <View key={service.id} style={styles.serviceCard}>
            <View style={styles.serviceHeader}>
              <View style={styles.serviceIconContainer}>
                <Text style={styles.serviceIcon}>{service.icon}</Text>
              </View>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceTitle}>{service.title}</Text>
                <Text style={styles.serviceSubtitle}>{service.subtitle}</Text>
                <View style={styles.serviceMetrics}>
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>Status</Text>
                    <Text style={[styles.metricValue, { color: service.color }]}>{service.price}</Text>
                  </View>
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>Scale</Text>
                    <Text style={styles.metricValue}>{service.experience}</Text>
                  </View>
                </View>
                <Text style={styles.contactInfo}>{service.details}</Text>
              </View>
            </View>

            <View style={styles.serviceContent}>
              <Text style={styles.serviceDescription}>{service.description}</Text>

              <View style={styles.actionButtons}>
                <TouchableOpacity style={[styles.actionBtn, styles.manageBtn]}>
                  <Text style={styles.manageBtnText}>Manage Service</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, styles.viewBtn]}>
                  <Text style={styles.viewBtnText}>View Details</Text>
            </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
        
        <View style={styles.adminInfo}>
          <Text style={styles.adminInfoTitle}>System Information</Text>
          <Text style={styles.adminInfoText}>
            Manage your buses, routes, schedules, and stops.
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
  logoutBtn: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    marginTop: 8,
  },
  logoutText: {
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
  serviceCard: {
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
  serviceHeader: {
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  serviceIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  serviceIcon: {
    fontSize: 32,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  serviceSubtitle: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 12,
  },
  serviceMetrics: {
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
  contactInfo: {
    fontSize: 12,
    color: '#6c757d',
  },
  serviceContent: {
    padding: 20,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#495057',
    lineHeight: 22,
    marginBottom: 16,
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
  adminInfo: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    marginTop: 10,
  },
  adminInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  adminInfoText: {
    fontSize: 13,
    color: '#6c757d',
    lineHeight: 20,
  },
});

export default AdminHome;
