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
            Manage your buses, routes, schedules, and stops efficiently with our comprehensive admin dashboard.
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
    alignItems: SCREEN_WIDTH > 400 ? 'flex-start' : 'stretch',
    paddingHorizontal: SCREEN_WIDTH > 400 ? 24 : 16,
    paddingTop: SCREEN_WIDTH > 400 ? '15%' : '10%',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerContent: {
    flex: 1,
    marginRight: SCREEN_WIDTH > 400 ? 15 : 0,
    marginBottom: SCREEN_WIDTH > 400 ? 0 : 15,
  },
  headerTitle: {
    fontSize: SCREEN_WIDTH > 400 ? 28 : 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: SCREEN_WIDTH > 400 ? 16 : 14,
    color: '#6c757d',
    lineHeight: SCREEN_WIDTH > 400 ? 24 : 20,
  },
  logoutBtn: {
    backgroundColor: '#dc3545',
    paddingHorizontal: SCREEN_WIDTH > 400 ? 20 : 16,
    paddingVertical: SCREEN_WIDTH > 400 ? 12 : 10,
    borderRadius: 30,
    marginTop: SCREEN_WIDTH > 400 ? 8 : 0,
    alignSelf: SCREEN_WIDTH > 400 ? 'flex-start' : 'center',
    minWidth: 100,
    alignItems: 'center',
    shadowColor: '#dc3545',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: SCREEN_WIDTH > 400 ? 16 : 14,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: SCREEN_WIDTH > 400 ? 24 : 16,
    paddingBottom: 100,
  },
  serviceCard: {
    backgroundColor: '#ffffff',
    borderRadius: SCREEN_WIDTH > 400 ? 20 : 16,
    marginBottom: SCREEN_WIDTH > 400 ? 24 : 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  },
  serviceHeader: {
    flexDirection: SCREEN_WIDTH > 350 ? 'row' : 'column',
    padding: SCREEN_WIDTH > 400 ? 24 : 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
    alignItems: SCREEN_WIDTH > 350 ? 'flex-start' : 'center',
  },
  serviceIconContainer: {
    width: SCREEN_WIDTH > 400 ? 90 : 80,
    height: SCREEN_WIDTH > 400 ? 90 : 80,
    borderRadius: SCREEN_WIDTH > 400 ? 18 : 12,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SCREEN_WIDTH > 350 ? 20 : 0,
    marginBottom: SCREEN_WIDTH > 350 ? 0 : 16,
  },
  serviceIcon: {
    fontSize: SCREEN_WIDTH > 400 ? 36 : 32,
  },
  serviceInfo: {
    flex: 1,
    alignItems: SCREEN_WIDTH > 350 ? 'flex-start' : 'center',
  },
  serviceTitle: {
    fontSize: SCREEN_WIDTH > 400 ? 20 : 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 6,
    textAlign: SCREEN_WIDTH > 350 ? 'left' : 'center',
  },
  serviceSubtitle: {
    fontSize: SCREEN_WIDTH > 400 ? 16 : 14,
    color: '#6c757d',
    marginBottom: SCREEN_WIDTH > 400 ? 16 : 12,
    textAlign: SCREEN_WIDTH > 350 ? 'left' : 'center',
  },
  serviceMetrics: {
    flexDirection: SCREEN_WIDTH > 350 ? 'row' : 'column',
    marginBottom: SCREEN_WIDTH > 400 ? 12 : 8,
    alignItems: SCREEN_WIDTH > 350 ? 'flex-start' : 'center',
  },
  metricItem: {
    marginRight: SCREEN_WIDTH > 350 ? 24 : 0,
    marginBottom: SCREEN_WIDTH > 350 ? 0 : 8,
    alignItems: SCREEN_WIDTH > 350 ? 'flex-start' : 'center',
  },
  metricLabel: {
    fontSize: SCREEN_WIDTH > 400 ? 13 : 12,
    color: '#6c757d',
    marginBottom: 3,
    fontWeight: '500',
  },
  metricValue: {
    fontSize: SCREEN_WIDTH > 400 ? 16 : 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  contactInfo: {
    fontSize: SCREEN_WIDTH > 400 ? 13 : 12,
    color: '#6c757d',
    fontStyle: 'italic',
  },
  serviceContent: {
    padding: SCREEN_WIDTH > 400 ? 24 : 20,
  },
  serviceDescription: {
    fontSize: SCREEN_WIDTH > 400 ? 16 : 14,
    color: '#495057',
    lineHeight: SCREEN_WIDTH > 400 ? 26 : 22,
    marginBottom: SCREEN_WIDTH > 400 ? 24 : 20,
  },
  actionButtons: {
    flexDirection: SCREEN_WIDTH > 350 ? 'row' : 'column',
    gap: SCREEN_WIDTH > 400 ? 12 : 10,
  },
  actionBtn: {
    flex: SCREEN_WIDTH > 350 ? 1 : 0,
    paddingVertical: SCREEN_WIDTH > 400 ? 14 : 12,
    paddingHorizontal: SCREEN_WIDTH > 400 ? 24 : 20,
    borderRadius: SCREEN_WIDTH > 400 ? 12 : 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: SCREEN_WIDTH > 400 ? 50 : 44,
  },
  manageBtn: {
    backgroundColor: '#2196f3',
    shadowColor: '#2196f3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  manageBtnText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: SCREEN_WIDTH > 400 ? 16 : 14,
  },
  viewBtn: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#2196f3',
  },
  viewBtnText: {
    color: '#2196f3',
    fontWeight: '600',
    fontSize: SCREEN_WIDTH > 400 ? 16 : 14,
  },
  adminInfo: {
    backgroundColor: '#ffffff',
    borderRadius: SCREEN_WIDTH > 400 ? 20 : 16,
    padding: SCREEN_WIDTH > 400 ? 24 : 20,
    marginTop: SCREEN_WIDTH > 400 ? 12 : 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  adminInfoTitle: {
    fontSize: SCREEN_WIDTH > 400 ? 20 : 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: SCREEN_WIDTH > 400 ? 12 : 10,
  },
  adminInfoText: {
    fontSize: SCREEN_WIDTH > 400 ? 16 : 14,
    color: '#495057',
    lineHeight: SCREEN_WIDTH > 400 ? 26 : 22,
  },
});

export default AdminHome;
