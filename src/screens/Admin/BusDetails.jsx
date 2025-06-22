import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { BusService } from '../../services/busService';

const BusDetails = ({ route, navigation }) => {
  // Get the bus ID from route params
  const { busId } = route.params;
  
  // State for bus data and loading
  const [bus, setBus] = useState(null);
  const [isLoadingBus, setIsLoadingBus] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editForm, setEditForm] = useState({
    busNo: '',
    capacity: '',
    status: 'Active'
  });

  // Fetch bus details from backend
  const fetchBusDetails = useCallback(async () => {
    try {
      setIsLoadingBus(true);
      console.log('🚌 Fetching bus details for ID:', busId);
      
      const response = await BusService.getBusById(busId);
      console.log('🚌 Raw response from getBusById:', response);
      
      if (response && response.success && response.data) {
        const busData = response.data;
        console.log('🚌 Bus data from backend:', busData);
        
        // Transform the data to match UI expectations
        const transformedBus = {
          id: busData._id,
          _id: busData._id,
          busNo: busData.busNo,
          model: busData.model || 'Standard Bus Model',
          description: busData.description || `Transportation bus ${busData.busNo} with ${busData.capacity} passenger capacity`,
          capacity: busData.capacity,
          route: busData.route || 'Not Assigned',
          driver: busData.driver || 'Not Assigned',
          status: busData.status ? 'Active' : 'Inactive',
          lastService: busData.updatedAt ? new Date(busData.updatedAt).toLocaleDateString('en-GB', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric' 
          }) : 'Not Available',
        };

        setBus(transformedBus);
        console.log('✅ Transformed bus data:', transformedBus);

        // Update edit form with fetched data
        setEditForm({
          busNo: transformedBus.busNo,
          capacity: transformedBus.capacity.toString(),
          status: transformedBus.status
        });
        console.log('✅ Bus details loaded successfully');
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('❌ Error fetching bus details:', error);
      
      let errorMessage = 'Failed to load bus details';
      if (error.response?.status === 404) {
        errorMessage = 'Bus not found';
      } else if (error.response?.status === 401) {
        errorMessage = 'Authentication failed. Please login again.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage,
      });
      
      // Navigate back if bus not found
      if (error.response?.status === 404) {
        navigation.navigate('BusSchedule');
      }
    } finally {
      setIsLoadingBus(false);
    }
  }, [busId, navigation]);

  // Load bus details when component mounts
  useEffect(() => {
    if (busId) {
      fetchBusDetails();
    } else {
      console.error('❌ No bus ID provided');
      navigation.navigate('BusSchedule');
    }
  }, [busId, navigation, fetchBusDetails]);

  const deleteHandler = async () => {
    try {
      setIsLoading(true);
      
      console.log('🚌 DEBUG: About to delete bus');
      console.log('🚌 busId from params:', busId);
      console.log('🚌 bus object:', bus);
      console.log('🚌 bus._id:', bus?._id);
      console.log('🚌 bus.id:', bus?.id);
      
      // Use busId from params (which should be the MongoDB _id)
      const idToDelete = busId;
      console.log('🚌 Attempting to delete with ID:', idToDelete);
      
      const res = await BusService.deleteBus(idToDelete);
      console.log("✅ Bus deleted successfully:", res);
      
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Bus deleted successfully!',
      });
      navigation.navigate('BusSchedule');
    } catch (error) {
      console.error('❌ Delete error details:', {
        status: error.response?.status,
        message: error.response?.data?.message,
        url: error.config?.url,
        method: error.config?.method
      });
      
      let errorMessage = 'Failed to delete bus';
      if (error.response?.status === 401) {
        errorMessage = 'Authentication failed. Please login again.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Bus not found. It may have been already deleted.';
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
  }

  // Delete Bus Function
  const deleteBus = async () => {
    Alert.alert(
      'Delete Bus',
      `Are you sure you want to delete bus ${bus?.busNo}? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: deleteHandler,
        },
      ]
    );
  };

  // Edit Bus Function
  const editBus = async () => {
    try {
      // Validate form
      if (!editForm.busNo.trim()) {
        Toast.show({
          type: 'error',
          text1: 'Validation Error',
          text2: 'Bus number is required',
        });
        return;
      }

      if (!editForm.capacity.trim() || isNaN(editForm.capacity) || editForm.capacity <= 0) {
        Toast.show({
          type: 'error',
          text1: 'Validation Error',
          text2: 'Please enter a valid capacity',
        });
        return;
      }

      setIsLoading(true);
      
      const updateData = {
        busNo: editForm.busNo.trim(),
        capacity: editForm.capacity,
        status: editForm.status === 'Active'
      };

      await BusService.updateBus(busId, updateData);
      
      Toast.show({  
        type: 'success',
        text1: 'Success',
        text2: 'Bus updated successfully!',
      });
      
      setEditModalVisible(false);
      navigation.navigate('BusSchedule');
    } catch (error) {
      console.error('Error updating bus:', error);
      
      let errorMessage = 'Failed to update bus';
      if (error.response?.status === 401) {
        errorMessage = 'Authentication failed. Please login again.';
      } else if (error.response?.status === 400) {
        errorMessage = error.response?.data?.message || 'Invalid data provided';
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

  const resetEditForm = () => {
    if (bus) {
      setEditForm({
        busNo: bus.busNo,
        capacity: bus.capacity.toString(),
        status: bus.status
      });
    }
  };

  // Show loading spinner while fetching bus data
  if (isLoadingBus) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.navigate('BusSchedule')}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Bus Details</Text>
          <View style={styles.placeholder} />
        </View>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Loading bus details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error if bus data is not available
  if (!bus) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.navigate('BusSchedule')}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Bus Details</Text>
          <View style={styles.placeholder} />
        </View>
        
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>🚌</Text>
          <Text style={styles.errorTitle}>Bus Not Found</Text>
          <Text style={styles.errorText}>
            The bus you're looking for could not be found or may have been deleted.
          </Text>
          <TouchableOpacity 
            style={styles.errorButton}
            onPress={() => navigation.navigate('BusSchedule')}
          >
            <Text style={styles.errorButtonText}>Go Back to Bus List</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.navigate('BusSchedule')}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bus Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Bus Info Card */}
        <View style={styles.busCard}>
          <View style={styles.busHeader}>
            <View style={styles.busIconContainer}>
              <Text style={styles.busIcon}>🚌</Text>
            </View>
            <View style={styles.busInfo}>
              <Text style={styles.busTitle}>{bus.busNo}</Text>
              <Text style={styles.busModel}>{bus.model}</Text>
            </View>
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

          <Text style={styles.busDescription}>{bus.description}</Text>
        </View>

        {/* Specifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bus Specifications</Text>
          <View style={styles.specGrid}>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Capacity</Text>
              <Text style={styles.specValue}>{bus.capacity} seats</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Route</Text>
              <Text style={styles.specValue}>{bus.route}</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Driver</Text>
              <Text style={styles.specValue}>{bus.driver}</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Last Service</Text>
              <Text style={styles.specValue}>{bus.lastService}</Text>
            </View>
          </View>
        </View>

      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.assignBtn, isLoading && styles.buttonDisabled]}
          onPress={deleteBus}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text style={styles.assignBtnText}>Delete Bus</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.editBtn, isLoading && styles.buttonDisabled]}
          onPress={() => setEditModalVisible(true)}
          disabled={isLoading}
        >
          <Text style={styles.editBtnText}>Edit Bus</Text>
        </TouchableOpacity>
      </View>

      {/* Edit Bus Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Bus</Text>
            <TouchableOpacity 
              onPress={() => {
                setEditModalVisible(false);
                resetEditForm();
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
                value={editForm.busNo}
                onChangeText={(text) => setEditForm({...editForm, busNo: text})}
                autoCapitalize="characters"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Capacity *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 45"
                value={editForm.capacity}
                onChangeText={(text) => setEditForm({...editForm, capacity: text})}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Status</Text>
              <View style={styles.statusButtons}>
                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    editForm.status === 'Active' && styles.statusButtonActive
                  ]}
                  onPress={() => setEditForm({...editForm, status: 'Active'})}
                >
                  <Text style={[
                    styles.statusButtonText,
                    editForm.status === 'Active' && styles.statusButtonTextActive
                  ]}>
                    Active
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    editForm.status === 'Inactive' && styles.statusButtonInactive
                  ]}
                  onPress={() => setEditForm({...editForm, status: 'Inactive'})}
                >
                  <Text style={[
                    styles.statusButtonText,
                    editForm.status === 'Inactive' && styles.statusButtonTextInactive
                  ]}>
                    Inactive
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => {
                setEditModalVisible(false);
                resetEditForm();
              }}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveBtn, isLoading && styles.buttonDisabled]}
              onPress={editBus}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={styles.saveBtnText}>Save Changes</Text>
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
    alignItems: 'center',
    paddingHorizontal: '5%',
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: '#1a1a1a',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: '5%',
    paddingVertical: 20,
  },
  busCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: '5%',
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  busHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  busIconContainer: {
    width: '20%',
    aspectRatio: 1,
    borderRadius: 16,
    backgroundColor: '#e6f3ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '4%',
  },
  busIcon: {
    fontSize: 28,
  },
  busInfo: {
    flex: 1,
  },
  busTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
    flexShrink: 1,
  },
  busModel: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 8,
    flexShrink: 1,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  busDescription: {
    fontSize: 14,
    color: '#495057',
    lineHeight: 20,
    flexShrink: 1,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: '5%',
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  specGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  specItem: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    padding: '4%',
    borderRadius: 12,
    marginBottom: 16,
  },
  specLabel: {
    fontSize: 11,
    color: '#6c757d',
    marginBottom: 4,
  },
  specValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    flexShrink: 1,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: '5%',
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    gap: 12,
  },
  assignBtn: {
    flex: 1,
    backgroundColor: '#dc3545',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  assignBtnText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  editBtn: {
    flex: 1,
    backgroundColor: '#007bff',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  editBtnText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '5%',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    flexShrink: 1,
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
    paddingHorizontal: '5%',
    paddingTop: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    paddingHorizontal: '4%',
    paddingVertical: 12,
    fontSize: 14,
    backgroundColor: '#ffffff',
    color: '#1a1a1a',
    minHeight: 44,
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: '4%',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e9ecef',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    minHeight: 44,
  },
  statusButtonActive: {
    backgroundColor: '#28a745',
    borderColor: '#28a745',
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
  statusButtonTextInactive: {
    color: '#ffffff',
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: '5%',
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
  saveBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#007bff',
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '10%',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007bff',
    marginTop: 20,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '10%',
  },
  errorIcon: {
    fontSize: 48,
    color: '#dc3545',
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#dc3545',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#495057',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  errorButton: {
    paddingVertical: 16,
    paddingHorizontal: '8%',
    borderRadius: 12,
    backgroundColor: '#007bff',
  },
  errorButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default BusDetails; 