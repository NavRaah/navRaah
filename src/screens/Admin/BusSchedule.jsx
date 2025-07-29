import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, Modal, ActivityIndicator, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { BusService } from '../../services/busService';
import { SearchIcon } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const BusSchedule = ({ navigation, route }) => {
   const [buses, setBuses] = useState([]);
  const [filteredBuses, setFilteredBuses] = useState([]);
  const [isLoadingBuses, setIsLoadingBuses] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Function to fetch all buses from backend
  const fetchBuses = useCallback(async () => {
    try {
      setIsLoadingBuses(true);
      const response = await BusService.getAllBuses();

      if (response && response.success && response.data) {
        // Transform backend data to match UI format
        const transformedBuses = response.data.map((bus, index) => ({
          id: bus._id || index + 1,
          busNo: bus.busNo,
          model: bus.model || 'Standard Bus Model',
          description: bus.description || `Transportation bus ${bus.busNo} with ${bus.capacity} passenger capacity`,
          capacity: bus.capacity,
          route: bus.route || 'Not Assigned',
          driver: bus.driver || 'Not Assigned',
          status: bus.status ? 'Active' : 'Inactive',
          lastService: bus.updatedAt ? new Date(bus.updatedAt).toLocaleDateString('en-GB', { 
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          }) : 'Not Available',
        }));
        setBuses(transformedBuses);
        setFilteredBuses(transformedBuses);
      } else {
        setBuses([]);
        setFilteredBuses([]);
      }
    } catch (error) {
      console.error('Error fetching buses:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load buses from server',
      });
      setBuses([]);
      setFilteredBuses([]);
    } finally {
      setIsLoadingBuses(false);
    }
  }, []);

  // Search function
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredBuses(buses);
    } else {
      const filtered = buses.filter(bus => 
        bus.busNo.toLowerCase().includes(query.toLowerCase()) ||
        bus.model.toLowerCase().includes(query.toLowerCase()) ||
        bus.route.toLowerCase().includes(query.toLowerCase()) ||
        bus.driver.toLowerCase().includes(query.toLowerCase()) ||
        bus.status.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredBuses(filtered);
    }
  }, [buses]);

  // Load buses on component mount
  useEffect(() => {
    fetchBuses();
  }, [fetchBuses]);

  // Refresh buses when screen comes into focus (when returning from other screens)
  useFocusEffect(
    useCallback(() => {
      fetchBuses();
    }, [fetchBuses])
  );

  // Listen for route params to refresh when returning from other screens
  useEffect(() => {
    if (route.params?.refresh) {
      fetchBuses();
      // Clear the refresh parameter
      navigation.setParams({ refresh: false });
    }
  }, [route.params?.refresh, fetchBuses, navigation]);

  // Update filtered buses when buses change
  useEffect(() => {
    handleSearch(searchQuery);
  }, [buses, searchQuery, handleSearch]);

  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [busForm, setBusForm] = useState({
    busNo: '',
    capacity: '',
    status: 'Active'
  });

  const resetForm = () => {
    setBusForm({
      busNo: '',
      capacity: '',
      status: 'Active'
    });
  };

  const validateForm = () => {
    if (!busForm.busNo.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Bus number is required',
      });
      return false;
    }

    if (!busForm.capacity.trim() || isNaN(busForm.capacity) || busForm.capacity <= 0) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please enter a valid capacity',
      });
      return false;
    }

    // Check if bus number already exists
    const existingBus = buses.find(bus => bus.busNo.toLowerCase() === busForm.busNo.toLowerCase());
    if (existingBus) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Bus with this number already exists',
      });
      return false;
    }

    return true;
  };

  const addBusHandler = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      
      const busData = {
        busNo: busForm.busNo.trim(),
        capacity: busForm.capacity,
        status: busForm.status === 'Active'
      };

      const response = await BusService.addBus(busData);

      if (response && (response.success || response.data)) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Bus added successfully!',
        });

        resetForm();
        setModalVisible(false);
        await fetchBuses();
      } else {
        throw new Error('Failed to add bus - Invalid response format');
      }
    } catch (error) {
      console.error('Error adding bus:', error);

      let errorMessage = 'Failed to add bus';

      if (error.response?.status === 401) {
        errorMessage = 'Authentication failed. Please login again.';
      } else if (error.response?.status === 400) {
        errorMessage = error.response?.data?.message || 'Invalid data provided';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please try again.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderBusCard = (bus) => (
    <View key={bus.id} style={styles.busCard}>
      <View style={styles.busHeader}>

        <View style={styles.busContent}>
          <View style={styles.busInfo}>
            <Text style={styles.busTitle}>{bus.busNo}</Text>
            <View style={styles.busDetails}>
              <Text style={styles.capacityText}>Capacity: {bus.capacity} seats</Text>
              <View style={styles.statusContainer}>
                <View style={[
                  styles.statusDot,
                  { backgroundColor: bus.status === 'Active' ? '#28a745' : '#dc3545' }
                ]} />
                <Text style={[
                  styles.statusText,
                  { color: bus.status === 'Active' ? '#28a745' : '#dc3545' }
                ]}>
                  {bus.status}
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.viewMoreBtn}
            onPress={() => {
              const busIdToPass = bus._id || bus.id;
              navigation.navigate('BusDetails', { busId: busIdToPass });
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.viewMoreText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Bus Management</Text>
          <Text style={styles.headerSubtitle}>
            Manage your buses.
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn} 
          onPress={() => setModalVisible(true)}
          disabled={isLoading}  
        >
          <Text style={styles.addBtnText}>+ Add Bus</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Text style={styles.searchIcon}><SearchIcon/></Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search buses by number"
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor="#6c757d"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={() => handleSearch('')}
            >
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {isLoadingBuses ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007bff" />
            <Text style={styles.loadingText}>Loading buses...</Text>
          </View>
        ) : buses.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🚌</Text>
            <Text style={styles.emptyTitle}>No Buses Found</Text>
            <Text style={styles.emptyText}>
              No buses are currently registered in the system. Add your first bus to get started.
            </Text>
            <TouchableOpacity 
              style={styles.emptyButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.emptyButtonText}>Add First Bus</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {searchQuery.length > 0 && (
              <View style={styles.searchResultsHeader}>
                <Text style={styles.searchResultsText}>
                  {filteredBuses.length} result{filteredBuses.length !== 1 ? 's' : ''} found for "{searchQuery}"
                </Text>
              </View>
            )}
            {filteredBuses.map(renderBusCard)}
          </>
        )}
      </ScrollView>

      {/* Add Bus Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New Bus</Text>
            <TouchableOpacity 
              onPress={() => {
                setModalVisible(false);
                resetForm();
              }}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Bus Number *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., MH-12-AB-1234"
                value={busForm.busNo}
                onChangeText={(text) => setBusForm({...busForm, busNo: text})}
                autoCapitalize="characters"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Capacity *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 45"
                value={busForm.capacity}
                onChangeText={(text) => setBusForm({...busForm, capacity: text})}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Status</Text>
              <View style={styles.statusButtons}>
                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    busForm.status === 'Active' && styles.statusButtonActive
                  ]}
                  onPress={() => setBusForm({...busForm, status: 'Active'})}
                >
                  <Text style={[
                    styles.statusButtonText,
                    busForm.status === 'Active' && styles.statusButtonTextActive
                  ]}>
                    Active
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    busForm.status === 'Inactive' && styles.statusButtonInactive
                  ]}
                  onPress={() => setBusForm({...busForm, status: 'Inactive'})}
                >
                  <Text style={[
                    styles.statusButtonText,
                    busForm.status === 'Inactive' && styles.statusButtonTextInactive
                  ]}>
                    Inactive
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.cancelBtn]}
              onPress={() => {
                setModalVisible(false);
                resetForm();
              }}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitBtn, isLoading && styles.submitBtnDisabled]}
              onPress={addBusHandler}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={styles.submitBtnText}>Add Bus</Text>
              )}
            </TouchableOpacity>
          </View>
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
  addBtn: {
    backgroundColor: '#007bff',
    paddingHorizontal: SCREEN_WIDTH > 400 ? 20 : 16,
    paddingVertical: SCREEN_WIDTH > 400 ? 12 : 10,
    borderRadius: 30,
    marginTop: SCREEN_WIDTH > 400 ? 8 : 0,
    alignSelf: SCREEN_WIDTH > 400 ? 'flex-start' : 'center',
    minWidth: 120,
    alignItems: 'center',
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addBtnText: {
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
  busCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  busHeader: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },
  busIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#e6f3ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  busIcon: {
    fontSize: 24,
  },
  busContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  busInfo: {
    flex: 1,
    marginRight: 15,
  },
  busTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  busDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  capacityText: {
    fontSize: 12,
    color: '#6c757d',
    marginRight: 12,
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
    fontWeight: '600',
  },
  viewMoreBtn: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 100,
  },
  viewMoreText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
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
  
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#6c757d',
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#1a1a1a',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e9ecef',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  statusButtonActive: {
    backgroundColor: '#28a745',
    borderColor: '#28a745',
  },
  statusButtonMaintenance: {
    backgroundColor: '#ffc107',
    borderColor: '#ffc107',
  },
  statusButtonInactive: {
    backgroundColor: '#dc3545',
    borderColor: '#dc3545',
  },
  statusButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6c757d',
  },
  statusButtonTextActive: {
    color: '#ffffff',
  },
  statusButtonTextMaintenance: {
    color: '#ffffff',
  },
  statusButtonTextInactive: {
    color: '#ffffff',
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  cancelBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6c757d',
  },
  submitBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#007bff',
  },
  submitBtnDisabled: {
    backgroundColor: '#9ca3af',
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007bff',
    marginTop: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyIcon: {
    fontSize: 48,
    color: '#007bff',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  emptyButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  searchContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  searchIcon: {
    fontSize: 18,
    color: '#6c757d',
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
  },
  clearButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6c757d',
  },
  searchResultsHeader: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  searchResultsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
});

export default BusSchedule;