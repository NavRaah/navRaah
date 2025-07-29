import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, StyleSheet, Dimensions, TextInput } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const StopSelector = ({ 
  stops = [], 
  selectedStopId, 
  onSelectStop, 
  placeholder = "Select a stop",
  label,
  error,
  disabled = false 
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedStop = stops.find(stop => stop._id === selectedStopId);

  // Filter stops based on search query
  const filteredStops = stops.filter(stop => 
    stop.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectStop = (stop) => {
    onSelectStop(stop._id, stop);
    setModalVisible(false);
    setSearchQuery(''); // Reset search when closing
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSearchQuery(''); // Reset search when closing
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <TouchableOpacity
        style={[
          styles.selector,
          error && styles.selectorError,
          disabled && styles.selectorDisabled
        ]}
        onPress={() => !disabled && setModalVisible(true)}
        disabled={disabled}
      >
        <Text style={[
          styles.selectorText,
          !selectedStop && styles.placeholderText,
          disabled && styles.disabledText
        ]}>
          {selectedStop ? selectedStop.name : placeholder}
        </Text>
        <Text style={[styles.arrow, disabled && styles.disabledText]}>▼</Text>
      </TouchableOpacity>
      
      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Stop</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={handleCloseModal}
            >
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
          
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search stops..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#6c757d"
            />
          </View>
          
          <ScrollView style={styles.stopsList}>
            {filteredStops.length > 0 ? (
              filteredStops.map((stop) => (
                <TouchableOpacity
                  key={stop._id}
                  style={[
                    styles.stopItem,
                    selectedStopId === stop._id && styles.selectedStopItem
                  ]}
                  onPress={() => handleSelectStop(stop)}
                >
                  <View style={styles.stopInfo}>
                    <Text style={[
                      styles.stopName,
                      selectedStopId === stop._id && styles.selectedStopText
                    ]}>
                      {stop.name}
                    </Text>
                  </View>
                  {selectedStopId === stop._id && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))
            ) : searchQuery ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No stops found</Text>
                <Text style={styles.emptyStateSubtext}>
                  No stops match your search "{searchQuery}"
                </Text>
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No stops available</Text>
                <Text style={styles.emptyStateSubtext}>
                  Please add stops first before creating routes
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
  },
  label: {
    fontSize: SCREEN_WIDTH > 400 ? 14 : 13,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 6,
  },
  selector: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: SCREEN_WIDTH > 400 ? 8 : 6,
    paddingHorizontal: SCREEN_WIDTH > 400 ? 16 : 12,
    paddingVertical: SCREEN_WIDTH > 400 ? 12 : 10,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: SCREEN_WIDTH > 400 ? 48 : 44,
  },
  selectorError: {
    borderColor: '#dc3545',
  },
  selectorDisabled: {
    backgroundColor: '#f8f9fa',
    borderColor: '#e9ecef',
  },
  selectorText: {
    fontSize: SCREEN_WIDTH > 400 ? 14 : 13,
    color: '#495057',
    flex: 1,
  },
  placeholderText: {
    color: '#6c757d',
  },
  disabledText: {
    color: '#adb5bd',
  },
  arrow: {
    fontSize: SCREEN_WIDTH > 400 ? 12 : 11,
    color: '#6c757d',
    marginLeft: 8,
  },
  errorText: {
    fontSize: SCREEN_WIDTH > 400 ? 12 : 11,
    color: '#dc3545',
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SCREEN_WIDTH > 400 ? 20 : 16,
    paddingVertical: SCREEN_WIDTH > 400 ? 16 : 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  modalTitle: {
    fontSize: SCREEN_WIDTH > 400 ? 18 : 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  closeButton: {
    paddingHorizontal: SCREEN_WIDTH > 400 ? 16 : 12,
    paddingVertical: SCREEN_WIDTH > 400 ? 8 : 6,
  },
  closeButtonText: {
    fontSize: SCREEN_WIDTH > 400 ? 16 : 14,
    color: '#dc3545',
    fontWeight: '600',
  },
  searchContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: SCREEN_WIDTH > 400 ? 20 : 16,
    paddingVertical: SCREEN_WIDTH > 400 ? 12 : 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: SCREEN_WIDTH > 400 ? 25 : 20,
    paddingHorizontal: SCREEN_WIDTH > 400 ? 16 : 12,
    paddingVertical: SCREEN_WIDTH > 400 ? 10 : 8,
    fontSize: SCREEN_WIDTH > 400 ? 14 : 13,
    backgroundColor: '#f8f9fa',
  },
  stopsList: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  stopItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SCREEN_WIDTH > 400 ? 20 : 16,
    paddingVertical: SCREEN_WIDTH > 400 ? 16 : 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  selectedStopItem: {
    backgroundColor: '#e8f5e8',
    borderBottomColor: '#28a745',
  },
  stopInfo: {
    flex: 1,
  },
  stopName: {
    fontSize: SCREEN_WIDTH > 400 ? 16 : 14,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  selectedStopText: {
    color: '#28a745',
    fontWeight: '600',
  },
  checkmark: {
    fontSize: SCREEN_WIDTH > 400 ? 18 : 16,
    color: '#28a745',
    fontWeight: 'bold',
  },
  emptyState: {
    padding: SCREEN_WIDTH > 400 ? 40 : 30,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: SCREEN_WIDTH > 400 ? 18 : 16,
    fontWeight: '600',
    color: '#6c757d',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: SCREEN_WIDTH > 400 ? 14 : 13,
    color: '#adb5bd',
    textAlign: 'center',
    lineHeight: SCREEN_WIDTH > 400 ? 20 : 18,
  },
});

export default StopSelector;