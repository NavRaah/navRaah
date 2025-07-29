import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, StyleSheet, Dimensions, TextInput } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const MultiStopSelector = ({ 
  stops = [], 
  selectedStopIds = [], 
  onSelectStops, 
  placeholder = "Select stops",
  label,
  error,
  disabled = false,
  excludeStopIds = []
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedStops = stops.filter(stop => selectedStopIds.includes(stop._id));

  const filteredStops = stops.filter(stop => 
    stop.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !excludeStopIds.includes(stop._id)
  );

  const handleToggleStop = (stop) => {
    const isSelected = selectedStopIds.includes(stop._id);
    let newSelectedIds;
    let newSelectedStops;

    if (isSelected) {
      newSelectedIds = selectedStopIds.filter(id => id !== stop._id);
      newSelectedStops = selectedStops.filter(s => s._id !== stop._id);
    } else {
      newSelectedIds = [...selectedStopIds, stop._id];
      newSelectedStops = [...selectedStops, stop];
    }

    onSelectStops(newSelectedIds, newSelectedStops);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSearchQuery('');
  };

  const getDisplayText = () => {
    if (selectedStops.length === 0) {
      return placeholder;
    } else if (selectedStops.length === 1) {
      return selectedStops[0].name;
    } else {
      return `${selectedStops.length} stops selected`;
    }
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
          selectedStops.length === 0 && styles.placeholderText,
          disabled && styles.disabledText
        ]}>
          {getDisplayText()}
        </Text>
        <Text style={[styles.arrow, disabled && styles.disabledText]}>▼</Text>
      </TouchableOpacity>

      {selectedStops.length > 0 && (
        <View style={styles.selectedStopsContainer}>
          <View style={styles.chipsContainer}>
            {selectedStops.map((stop) => (
              <View key={stop._id} style={styles.chip}>
                <Text style={styles.chipText}>{stop.name}</Text>
                <TouchableOpacity
                  style={styles.chipRemove}
                  onPress={() => handleToggleStop(stop)}
                >
                  <Text style={styles.chipRemoveText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      )}
      
      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Stops</Text>
            <TouchableOpacity 
              style={styles.doneButton}
              onPress={handleCloseModal}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
          
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
              filteredStops.map((stop) => {
                const isSelected = selectedStopIds.includes(stop._id);
                return (
                  <TouchableOpacity
                    key={stop._id}
                    style={[
                      styles.stopItem,
                      isSelected && styles.selectedStopItem
                    ]}
                    onPress={() => handleToggleStop(stop)}
                  >
                    <View style={styles.stopInfo}>
                      <Text style={[
                        styles.stopName,
                        isSelected && styles.selectedStopText
                      ]}>
                        {stop.name}
                      </Text>
                    </View>
                    <View style={[styles.checkbox, isSelected && styles.checkedBox]}>
                      {isSelected && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                  </TouchableOpacity>
                );
              })
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No stops found</Text>
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
  selectedStopsContainer: {
    marginTop: 8,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e8',
    borderRadius: SCREEN_WIDTH > 400 ? 16 : 14,
    paddingHorizontal: SCREEN_WIDTH > 400 ? 12 : 10,
    paddingVertical: SCREEN_WIDTH > 400 ? 6 : 4,
    marginRight: 6,
    marginBottom: 4,
  },
  chipText: {
    fontSize: SCREEN_WIDTH > 400 ? 12 : 11,
    color: '#28a745',
    fontWeight: '500',
  },
  chipRemove: {
    marginLeft: 6,
    width: SCREEN_WIDTH > 400 ? 18 : 16,
    height: SCREEN_WIDTH > 400 ? 18 : 16,
    borderRadius: SCREEN_WIDTH > 400 ? 9 : 8,
    backgroundColor: '#28a745',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipRemoveText: {
    fontSize: SCREEN_WIDTH > 400 ? 12 : 10,
    color: '#ffffff',
    fontWeight: 'bold',
    lineHeight: SCREEN_WIDTH > 400 ? 14 : 12,
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
  doneButton: {
    paddingHorizontal: SCREEN_WIDTH > 400 ? 16 : 12,
    paddingVertical: SCREEN_WIDTH > 400 ? 8 : 6,
  },
  doneButtonText: {
    fontSize: SCREEN_WIDTH > 400 ? 16 : 14,
    color: '#28a745',
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
    backgroundColor: '#f8fff8',
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
  checkbox: {
    width: SCREEN_WIDTH > 400 ? 24 : 22,
    height: SCREEN_WIDTH > 400 ? 24 : 22,
    borderRadius: SCREEN_WIDTH > 400 ? 4 : 3,
    borderWidth: 2,
    borderColor: '#dee2e6',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  checkedBox: {
    backgroundColor: '#28a745',
    borderColor: '#28a745',
  },
  checkmark: {
    fontSize: SCREEN_WIDTH > 400 ? 14 : 12,
    color: '#ffffff',
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
});

export default MultiStopSelector;
