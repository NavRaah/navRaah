import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import StopSelector from './StopSelector';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SearchSection = ({
  searchQuery,
  onSearchChange,
  selectedStartStop,
  onStartStopSelect,
  selectedEndStop,
  onEndStopSelect,
  stops = [],
  onClearFilters,
  showFilters = true,
  searchPlaceholder = "Search...",
  fromLabel = "From",
  toLabel = "To",
  showResultsCount = false,
  resultsCount = 0,
  totalCount = 0,
  startStopPlaceholder = "Any start point",
  endStopPlaceholder = "Any end point",

}) => {
  const hasActiveFilters = searchQuery || selectedStartStop || selectedEndStop;

  return (
    <View style={styles.searchSection}>
      {/* Search Input */}
      <View style={styles.searchInputContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChangeText={onSearchChange}
          placeholderTextColor="#6c757d"
        />
        {hasActiveFilters && (
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={onClearFilters}
          >
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {/* Filter Controls */}
      {showFilters && (
        <View style={styles.filterRow}>
          <View style={styles.filterItem}>
            <Text style={styles.filterLabel}>{fromLabel}</Text>
            <StopSelector
              stops={stops}
              selectedStopId={selectedStartStop?._id}
              onSelectStop={onStartStopSelect}
              placeholder={startStopPlaceholder}
              compact={true}
            />
          </View>
          
          <View style={styles.filterItem}>
            <Text style={styles.filterLabel}>{toLabel}</Text>
            <StopSelector
              stops={stops}
              selectedStopId={selectedEndStop?._id}
              onSelectStop={onEndStopSelect}
              placeholder={endStopPlaceholder}
              compact={true}
            />
          </View>
        </View>
      )}
      
      {/* Results Count */}
      {showResultsCount && hasActiveFilters && (
        <View style={styles.activeFiltersRow}>
          <Text style={styles.activeFiltersText}>
            Showing {resultsCount} of {totalCount} results
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchSection: {
    backgroundColor: '#ffffff',
    paddingHorizontal: SCREEN_WIDTH > 400 ? 16 : 12,
    paddingVertical: SCREEN_WIDTH > 400 ? 16 : 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SCREEN_WIDTH > 400 ? 12 : 8,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: SCREEN_WIDTH > 400 ? 25 : 20,
    paddingHorizontal: SCREEN_WIDTH > 400 ? 16 : 12,
    paddingVertical: SCREEN_WIDTH > 400 ? 12 : 10,
    fontSize: SCREEN_WIDTH > 400 ? 14 : 13,
    backgroundColor: '#f8f9fa',
    marginRight: 8,
  },
  clearButton: {
    backgroundColor: '#6c757d',
    paddingHorizontal: SCREEN_WIDTH > 400 ? 16 : 12,
    paddingVertical: SCREEN_WIDTH > 400 ? 10 : 8,
    borderRadius: SCREEN_WIDTH > 400 ? 20 : 16,
    minWidth: SCREEN_WIDTH > 400 ? 70 : 60,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#ffffff',
    fontSize: SCREEN_WIDTH > 400 ? 13 : 12,
    fontWeight: '600',
  },
  filterRow: {
    flexDirection: SCREEN_WIDTH > 350 ? 'row' : 'column',
    marginBottom: 8,
  },
  filterItem: {
    flex: SCREEN_WIDTH > 350 ? 1 : 0,
    minWidth: SCREEN_WIDTH > 350 ? 0 : '100%',
    marginRight: SCREEN_WIDTH > 350 ? 12 : 0,
    marginBottom: SCREEN_WIDTH > 350 ? 0 : 8,
  },
  filterLabel: {
    fontSize: SCREEN_WIDTH > 400 ? 13 : 12,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 4,
  },
  activeFiltersRow: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f3f4',
  },
  activeFiltersText: {
    fontSize: SCREEN_WIDTH > 400 ? 13 : 12,
    color: '#28a745',
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default SearchSection; 