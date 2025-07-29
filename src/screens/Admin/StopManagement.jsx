import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, Modal, Dimensions, ActivityIndicator, Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import { StopService } from '../../services/stopService';
import SearchSection from '../../components/SearchSection';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const StopManagement = () => {
  const [stops, setStops] = useState([]);
  const [filteredStops, setFilteredStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStop, setSelectedStop] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    latitude: '',
    longitude: '',
    tentativeArrivalTime: '',
    actualArrivalTime: ''
  });
  const [saving, setSaving] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedStopDetails, setSelectedStopDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Search states
  const [searchQuery, setSearchQuery] = useState('');

  // Search functionality
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredStops(stops);
      return;
    }

    const filtered = stops.filter(stop =>
      stop.name.toLowerCase().includes(query.toLowerCase()) ||
      stop.code.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredStops(filtered);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setFilteredStops(stops);
  };

  // Fetch stops from backend
  const fetchStops = async () => {
    try {
      setLoading(true);
      const response = await StopService.getAllStops();
      
      if (response.success) {
        // Map backend data to UI format - simplified for cards
        const mappedStops = response.data.map(stop => ({
          id: stop._id,
          name: stop.name,
          code: stop._id.slice(-6).toUpperCase(),
          // Store original backend data
          originalData: stop
        }));
        setStops(mappedStops);
        setFilteredStops(mappedStops);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: response.message || 'Failed to fetch stops'
        });
      }
    } catch (error) {
      console.error('Error fetching stops:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch stops. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch individual stop details from backend
  const fetchStopDetails = async (stopId) => {
    try {
      setLoadingDetails(true);
      const response = await StopService.getStopById(stopId);
      
      if (response.success) {
        const stop = response.data;
        const detailedStop = {
          id: stop._id,
          name: stop.name,
          code: stop._id.slice(-6).toUpperCase(),
          location: `Lat: ${stop.latitude}, Lng: ${stop.longitude}`,
          latitude: stop.latitude,
          longitude: stop.longitude,
          tentativeTime: StopService.formatTime(stop.tentativeArrivalTime),
          actualTime: StopService.formatTime(stop.actualArrivalTime),
          tentativeDate: new Date(stop.tentativeArrivalTime).toLocaleDateString(),
          actualDate: new Date(stop.actualArrivalTime).toLocaleDateString(),
          originalData: stop
        };
        setSelectedStopDetails(detailedStop);
        setDetailsModalVisible(true);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: response.message || 'Failed to fetch stop details'
        });
      }
    } catch (error) {
      console.error('Error fetching stop details:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch stop details. Please try again.'
      });
    } finally {
      setLoadingDetails(false);
    }
  };

  // Load stops on component mount
  useEffect(() => {
    fetchStops();
  }, []);

  // Update filtered stops when stops change
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredStops(stops);
    } else {
      const filtered = stops.filter(stop =>
        stop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stop.code.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredStops(filtered);
    }
  }, [stops, searchQuery]);

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Open modal for adding new stop
  const handleAddStop = () => {
    setSelectedStop(null);
    const now = new Date();
    const defaultTime = now.toISOString().slice(0, 16);
    
    setFormData({
      name: '',
      latitude: '',
      longitude: '',
      tentativeArrivalTime: defaultTime,
      actualArrivalTime: defaultTime
    });
    setModalVisible(true);
  };

  // Open modal for editing stop
  const handleEditStop = (stop) => {
    setSelectedStop(stop);
    const originalData = stop.originalData;
    setFormData({
      name: originalData.name || '',
      latitude: originalData.latitude.toString() || '',
      longitude: originalData.longitude.toString() || '',
      tentativeArrivalTime: StopService.formatDateForInput(originalData.tentativeArrivalTime),
      actualArrivalTime: StopService.formatDateForInput(originalData.actualArrivalTime)
    });
    setModalVisible(true);
  };

  // Handle view more button click
  const handleViewMore = (stop) => {
    fetchStopDetails(stop.originalData._id);
  };

  // Save stop (create or update)
  const handleSaveStop = async () => {
    try {
      setSaving(true);

      // Validate form data
      const validation = StopService.validateStopData(formData);
      if (!validation.isValid) {
        Toast.show({
          type: 'error',
          text1: 'Validation Error',
          text2: validation.errors.join(', ')
        });
        return;
      }

      let response;
      if (selectedStop) {
        // Update existing stop
        response = await StopService.updateStop(selectedStop.originalData._id, formData);
      } else {
        // Create new stop
        response = await StopService.addStop(formData);
      }

      if (response.success) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: response.message || `Stop ${selectedStop ? 'updated' : 'created'} successfully`
        });
        setModalVisible(false);
        fetchStops(); // Refresh the list
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: response.message || `Failed to ${selectedStop ? 'update' : 'create'} stop`
        });
      }
    } catch (error) {
      console.error('Error saving stop:', error);
      if (error.message && error.message.includes('Stop already exists')) {
        Toast.show({
          type: 'error',
          text1: 'Duplicate Stop',
          text2: 'A stop with this name already exists'
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: `Failed to ${selectedStop ? 'update' : 'create'} stop. Please try again.`
        });
      }
    } finally {
      setSaving(false);
    }
  };

  // Delete stop
  const handleDeleteStop = (stop) => {
    Alert.alert(
      'Delete Stop',
      `Are you sure you want to delete "${stop.name}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await StopService.deleteStop(stop.originalData._id);
              if (response.success) {
                Toast.show({
                  type: 'success',
                  text1: 'Success',
                  text2: 'Stop deleted successfully'
                });
                fetchStops(); // Refresh the list
              } else {
                Toast.show({
                  type: 'error',
                  text1: 'Error',
                  text2: response.message || 'Failed to delete stop'
                });
              }
            } catch (error) {
              console.error('Error deleting stop:', error);
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to delete stop. Please try again.'
              });
            }
          }
        }
      ]
    );
  };

  // Update actual arrival time
  const handleUpdateArrivalTime = (stop) => {
    Alert.alert(
      'Update Arrival Time',
      'Update the actual arrival time for this stop?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Update',
          onPress: async () => {
            try {
              const now = new Date().toISOString();
              const response = await StopService.updateActualArrivalTime(stop.originalData._id, now);
              if (response.success) {
                Toast.show({
                  type: 'success',
                  text1: 'Success',
                  text2: 'Arrival time updated successfully'
                });
                fetchStops(); // Refresh the list
                // If details modal is open, refresh it too
                if (detailsModalVisible && selectedStopDetails && selectedStopDetails.id === stop.originalData._id) {
                  fetchStopDetails(stop.originalData._id);
                }
              } else {
                Toast.show({
                  type: 'error',
                  text1: 'Error',
                  text2: response.message || 'Failed to update arrival time'
                });
              }
            } catch (error) {
              console.error('Error updating arrival time:', error);
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to update arrival time. Please try again.'
              });
            }
          }
        }
      ]
    );
  };

  // Simplified stop card component
  const renderStopCard = (stop) => (
    <View key={stop.id} style={styles.stopCard}>
      <View style={styles.stopHeader}>
        
        <View style={styles.stopContent}>
        <View style={styles.stopInfo}>
          <Text style={styles.stopTitle}>{stop.name}</Text>
          <Text style={styles.stopCode}>Code: {stop.code}</Text>
        </View>
        <TouchableOpacity 
            style={[styles.actionBtn, styles.viewBtn]}
            onPress={() => handleViewMore(stop)}
          >
            <Text style={styles.viewBtnText}>View Details</Text>
          </TouchableOpacity>
        </View>
        
      </View>

    </View>
  );

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#17a2b8" />
          <Text style={styles.loadingText}>Loading stops...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Stop Management</Text>
          <Text style={styles.headerSubtitle}>
            Manage your bus stops.
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.addBtn}
          onPress={handleAddStop}
        >
          <Text style={styles.addBtnText}>+ Add Stop</Text>
        </TouchableOpacity>
      </View>

      {/* Search Section */}
      <SearchSection
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        onClearFilters={clearSearch}
        searchPlaceholder="Search stops by name or code..."
        showFilters={false}
        showResultsCount={true}
        resultsCount={filteredStops.length}
        totalCount={stops.length}
      />
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filteredStops.length > 0 ? (
          filteredStops.map(renderStopCard)
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No Stops Found</Text>
            <Text style={styles.emptyStateText}>
              Start by adding your first bus stop using the "Add Stop" button above.
            </Text>
          </View>
        )}

      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {selectedStop ? 'Edit Stop' : 'Add New Stop'}
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
              <Text style={styles.inputLabel}>Stop Name *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter stop name"
                value={formData.name}
                onChangeText={(text) => handleInputChange('name', text)}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Latitude *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter latitude (-90 to 90)"
                value={formData.latitude}
                onChangeText={(text) => handleInputChange('latitude', text)}
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Longitude *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter longitude (-180 to 180)"
                value={formData.longitude}
                onChangeText={(text) => handleInputChange('longitude', text)}
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tentative Arrival Time *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="YYYY-MM-DDTHH:MM"
                value={formData.tentativeArrivalTime}
                onChangeText={(text) => handleInputChange('tentativeArrivalTime', text)}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Actual Arrival Time *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="YYYY-MM-DDTHH:MM"
                value={formData.actualArrivalTime}
                onChangeText={(text) => handleInputChange('actualArrivalTime', text)}
              />
            </View>
            
            <TouchableOpacity 
              style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
              onPress={handleSaveStop}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.saveBtnText}>
                  {selectedStop ? 'Update Stop' : 'Create Stop'}
                </Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Stop Details Modal */}
      <Modal
        visible={detailsModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Stop Details</Text>
            <TouchableOpacity 
              style={styles.closeBtn}
              onPress={() => setDetailsModalVisible(false)}
            >
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
          
          {loadingDetails ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#17a2b8" />
              <Text style={styles.loadingText}>Loading stop details...</Text>
            </View>
          ) : selectedStopDetails ? (
            <ScrollView style={styles.modalContent}>
              <View style={styles.detailsContainer}>
                {/* Stop Header Info */}
                <View style={styles.detailsHeader}>
                  <View style={styles.detailsIconContainer}>
                    <Text style={styles.detailsIcon}>🚏</Text>
                  </View>
                  <View style={styles.detailsHeaderInfo}>
                    <Text style={styles.detailsTitle}>{selectedStopDetails.name}</Text>
                    <Text style={styles.detailsCode}>Code: {selectedStopDetails.code}</Text>
                  </View>
                </View>

                {/* Detailed Information */}
                <View style={styles.detailsSection}>
                  <Text style={styles.sectionTitle}>Location Information</Text>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Coordinates:</Text>
                    <Text style={styles.detailValue}>{selectedStopDetails.location}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Latitude:</Text>
                    <Text style={styles.detailValue}>{selectedStopDetails.latitude}°</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Longitude:</Text>
                    <Text style={styles.detailValue}>{selectedStopDetails.longitude}°</Text>
                  </View>
                </View>

                <View style={styles.detailsSection}>
                  <Text style={styles.sectionTitle}>Arrival Times</Text>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Tentative Date:</Text>
                    <Text style={styles.detailValue}>{selectedStopDetails.tentativeDate}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Tentative Time:</Text>
                    <Text style={styles.detailValue}>{selectedStopDetails.tentativeTime}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Actual Date:</Text>
                    <Text style={styles.detailValue}>{selectedStopDetails.actualDate}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Actual Time:</Text>
                    <Text style={styles.detailValue}>{selectedStopDetails.actualTime}</Text>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.detailsActions}>
                  <TouchableOpacity 
                    style={[styles.actionBtn, styles.updateBtn]}
                    onPress={() => {
                      const stopToUpdate = { originalData: selectedStopDetails.originalData };
                      handleUpdateArrivalTime(stopToUpdate);
                    }}
                  >
                    <Text style={styles.updateBtnText}>Update Arrival</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.actionBtn, styles.editBtn]}
                    onPress={() => {
                      const stopToEdit = { originalData: selectedStopDetails.originalData };
                      setDetailsModalVisible(false);
                      handleEditStop(stopToEdit);
                    }}
                  >
                    <Text style={styles.editBtnText}>Edit Stop</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.actionBtn, styles.deleteBtn]}
                    onPress={() => {
                      const stopToDelete = { originalData: selectedStopDetails.originalData, name: selectedStopDetails.name };
                      setDetailsModalVisible(false);
                      handleDeleteStop(stopToDelete);
                    }}
                  >
                    <Text style={styles.deleteBtnText}>Delete Stop</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          ) : (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Failed to load stop details</Text>
            </View>
          )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6c757d',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 20,
  },
  viewBtn: {
    backgroundColor: '#007bff',
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  viewBtnText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: SCREEN_WIDTH > 400 ? 14 : 12,
  },
  updateBtn: {
    backgroundColor: '#ffc107',
    shadowColor: '#ffc107',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  updateBtnText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: SCREEN_WIDTH > 400 ? 14 : 12,
  },
  deleteBtn: {
    backgroundColor: '#dc3545',
    shadowColor: '#dc3545',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  deleteBtnText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: SCREEN_WIDTH > 400 ? 14 : 12,
  },
  editBtn: {
    backgroundColor: '#28a745',
    shadowColor: '#28a745',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  editBtnText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: SCREEN_WIDTH > 400 ? 14 : 12,
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
  saveBtn: {
    backgroundColor: '#17a2b8',
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
  saveBtnDisabled: {
    backgroundColor: '#6c757d',
  },
  // Details Modal Styles
  detailsContainer: {
    flex: 1,
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  detailsIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#e6f3ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  detailsIcon: {
    fontSize: 30,
  },
  detailsHeaderInfo: {
    flex: 1,
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  detailsCode: {
    fontSize: 16,
    color: '#6c757d',
  },
  detailsSection: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    paddingBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: '#1a1a1a',
    flex: 2,
    textAlign: 'right',
  },
  detailsActions: {
    flexDirection: SCREEN_WIDTH > 320 ? 'row' : 'column',
    gap: SCREEN_WIDTH > 400 ? 12 : 8,
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545',
    textAlign: 'center',
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
    backgroundColor: '#17a2b8',
    paddingHorizontal: SCREEN_WIDTH > 400 ? 20 : 16,
    paddingVertical: SCREEN_WIDTH > 400 ? 12 : 10,
    borderRadius: 30,
    marginTop: SCREEN_WIDTH > 400 ? 8 : 0,
    alignSelf: SCREEN_WIDTH > 400 ? 'flex-start' : 'center',
    minWidth: 120,
    alignItems: 'center',
    shadowColor: '#17a2b8',
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
    padding: 20,
  },
  stopCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 10,
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
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#e6f3ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stopIcon: {
    fontSize: 20,
  },
  stopInfo: {
    flex: 1,
    justifyContent: 'center',
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
  },
  stopContent: {
    padding: 5,
    flex: 1,
    flexDirection: 'row',
  },
  actionButtons: {
    flexDirection: SCREEN_WIDTH > 320 ? 'row' : 'column',
    gap: SCREEN_WIDTH > 400 ? 12 : 8,
  },
  actionBtn: {
    paddingVertical: SCREEN_WIDTH > 400 ? 12 : 10,
    paddingHorizontal: SCREEN_WIDTH > 400 ? 16 : 12,
    borderRadius: SCREEN_WIDTH > 400 ? 25 : 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: SCREEN_WIDTH > 400 ? 44 : 40,
    minWidth: 100,
  },
  manageBtn: {
    backgroundColor: '#87ceeb',
  },
  manageBtnText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: SCREEN_WIDTH > 400 ? 14 : 12,
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