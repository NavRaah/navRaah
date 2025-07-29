import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView,
  TextInput, Modal, Dimensions, ActivityIndicator, Alert, FlatList
} from 'react-native';
import Toast from 'react-native-toast-message';
import { RouteService } from '../../services/routeService';
import { StopService } from '../../services/stopService';
import StopSelector from '../../components/StopSelector';
import MultiStopSelector from '../../components/MultiStopSelector';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const RouteManagement = () => {
  const [routesRaw, setRoutesRaw] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stopsLoading, setStopsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [formData, setFormData] = useState({
    startPointId: '',
    endPointId: '',
    distance: '',
    time: '',
    middleStopIds: []
  });
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [viewRouteModal, setViewRouteModal] = useState(false);
  const [selectedViewRoute, setSelectedViewRoute] = useState(null);
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [selectedStartStop, setSelectedStartStop] = useState(null);
  const [selectedEndStop, setSelectedEndStop] = useState(null);

  // Fetch stops from backend
  const fetchStops = async () => {
    try {
      setStopsLoading(true);
      console.log('Fetching stops...');
      const response = await StopService.getAllStops();
      console.log('Stops response:', response);
      
      if (response.success && response.data) {
        console.log('Stops fetched successfully:', response.data.length, 'stops');
        setStops(response.data);
      } else {
        console.error('Failed to fetch stops:', response.message);
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
      setStopsLoading(false);
    }
  };

  // Fetch raw routes from backend
  const fetchRoutes = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching routes...');
      const response = await RouteService.getAllRoutes();
      console.log('Routes response:', response);
      
      if (response.success) {
        console.log('Routes fetched successfully:', response.data.length, 'routes');
        setRoutesRaw(response.data); // store raw data
      } else {
        console.error('Failed to fetch routes:', response.message);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: response.message || 'Failed to fetch routes'
        });
      }
    } catch (error) {
      console.error('Error fetching routes:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch routes. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Map routes when raw routes and stops are available
  useEffect(() => {
    if (routesRaw.length > 0) {
      console.log('Mapping routes...', { routesCount: routesRaw.length });
  
      const mappedRoutes = routesRaw.map(route => {
        // Handle case where startPoint and endPoint are already objects (populated)
        let startStop, endStop;
        
        if (typeof route.startPoint === 'object' && route.startPoint._id) {
          startStop = route.startPoint;
        } else if (typeof route.startPoint === 'string') {
          startStop = stops.find(stop => stop._id === route.startPoint);
        }
        
        if (typeof route.endPoint === 'object' && route.endPoint._id) {
          endStop = route.endPoint;
        } else if (typeof route.endPoint === 'string') {
          endStop = stops.find(stop => stop._id === route.endPoint);
        }
  
        if (!startStop) {
          console.log('Missing start stop for route:', route._id, 'startPoint:', route.startPoint);
        }
        if (!endStop) {
          console.log('Missing end stop for route:', route._id, 'endPoint:', route.endPoint);
        }
  
        // Get middle stop names - handle both object and string cases
        const middleStopNames = route.middleStops?.map(stopData => {
          if (typeof stopData === 'object' && stopData._id) {
            return stopData.name || 'Unknown Stop';
          } else if (typeof stopData === 'string') {
            const stop = stops.find(s => s._id === stopData);
          if (!stop) {
              console.log('Missing middle stop:', stopData);
          }
          return stop?.name || 'Unknown Stop';
          }
          return 'Unknown Stop';
        }) || [];
  
        const mappedRoute = {
          id: route._id,
          name: `${startStop?.name || 'Unknown'} to ${endStop?.name || 'Unknown'}`,
          startStopName: startStop?.name || 'Unknown',
          endStopName: endStop?.name || 'Unknown',
          middleStopNames: middleStopNames,
          distance: route.distance || 0,
          duration: route.time || 'Unknown',
          totalStops: (route.middleStops ? route.middleStops.length : 0) + 2,
          originalData: route
        };
  
        console.log('Mapped route:', mappedRoute.name, 'Start:', mappedRoute.startStopName, 'End:', mappedRoute.endStopName, 'Middle stops:', middleStopNames.join(', '));
        return mappedRoute;
      });
  
      setRoutes(mappedRoutes);
      console.log('Routes mapped successfully:', mappedRoutes.length);
    }
  }, [routesRaw, stops]);
  
  // Initial data fetch
  useEffect(() => {
    const loadData = async () => {
      await fetchStops();
      await fetchRoutes(); // Fetch routes immediately since they contain populated stop data
    };
    loadData();
  }, []);

  // Initialize filtered routes
  useEffect(() => {
    if (routes.length > 0 && filteredRoutes.length === 0 && !selectedStartStop && !selectedEndStop) {
      setFilteredRoutes(routes);
    }
  }, [routes, filteredRoutes.length, selectedStartStop, selectedEndStop]);

  // Filter routes based on from/to criteria
  const filterRoutes = useCallback(() => {
    let filtered = routes;

    if (selectedStartStop) {
      filtered = filtered.filter(route => {
        const startPointId = typeof route.originalData.startPoint === 'object' 
          ? route.originalData.startPoint._id 
          : route.originalData.startPoint;
        return startPointId === selectedStartStop._id;
      });
    }

    if (selectedEndStop) {
      filtered = filtered.filter(route => {
        const endPointId = typeof route.originalData.endPoint === 'object' 
          ? route.originalData.endPoint._id 
          : route.originalData.endPoint;
        return endPointId === selectedEndStop._id;
      });
    }

    setFilteredRoutes(filtered);
  }, [routes, selectedStartStop, selectedEndStop]);

  useEffect(() => {
    filterRoutes();
  }, [filterRoutes]);

  const handleStartStopFilter = (stopId, stopData) => setSelectedStartStop(stopData);
  const handleEndStopFilter = (stopId, stopData) => setSelectedEndStop(stopData);
  const clearFilters = () => {
    setSelectedStartStop(null);
    setSelectedEndStop(null);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleStartPointSelect = (stopId) => {
    setFormData(prev => ({
      ...prev,
      startPointId: stopId,
      middleStopIds: prev.middleStopIds.filter(id => id !== stopId)
    }));
    setFormErrors(prev => ({ ...prev, startPointId: null }));
  };

  const handleEndPointSelect = (stopId) => {
    setFormData(prev => ({
      ...prev,
      endPointId: stopId,
      middleStopIds: prev.middleStopIds.filter(id => id !== stopId)
    }));
    setFormErrors(prev => ({ ...prev, endPointId: null }));
  };

  const handleMiddleStopsSelect = (stopIds) => {
    setFormData(prev => ({ ...prev, middleStopIds: stopIds }));
    setFormErrors(prev => ({ ...prev, middleStopIds: null }));
  };

  const handleViewRoute = (route) => {
    setSelectedViewRoute(route);
    setViewRouteModal(true);
  };

  const handleAddRoute = () => {
    setSelectedRoute(null);
    setFormData({
      startPointId: '',
      endPointId: '',
      distance: '',
      time: '',
      middleStopIds: []
    });
    setFormErrors({});
    setModalVisible(true);
  };

  const handleEditRoute = (route) => {
    const originalData = route.originalData;
    setSelectedRoute(route);
    
    // Extract IDs from objects if they are populated
    const startPointId = typeof originalData.startPoint === 'object' 
      ? originalData.startPoint._id 
      : originalData.startPoint || '';
    
    const endPointId = typeof originalData.endPoint === 'object' 
      ? originalData.endPoint._id 
      : originalData.endPoint || '';
    
    const middleStopIds = originalData.middleStops?.map(stop => 
      typeof stop === 'object' ? stop._id : stop
    ) || [];
    
    setFormData({
      startPointId,
      endPointId,
      distance: originalData.distance?.toString() || '',
      time: originalData.time || '',
      middleStopIds
    });
    setFormErrors({});
    setModalVisible(true);
  };

  const handleSaveRoute = async () => {
    try {
      setSaving(true);
      const validation = RouteService.validateRouteData(formData);
      if (!validation.isValid) {
        const errors = {};
        validation.errors.forEach(error => {
          if (error.includes('Start point')) errors.startPointId = error;
          else if (error.includes('End point')) errors.endPointId = error;
          else if (error.includes('distance')) errors.distance = error;
          else if (error.includes('Time')) errors.time = error;
          else if (error.includes('Middle stops')) errors.middleStopIds = error;
        });
        setFormErrors(errors);
        Toast.show({
          type: 'error',
          text1: 'Validation Error',
          text2: validation.errors[0]
        });
        return;
      }

      let response;
      if (selectedRoute) {
        response = await RouteService.updateRoute(selectedRoute.originalData._id, formData);
      } else {
        response = await RouteService.createRoute(formData);
      }

      if (response.success) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: response.message || `Route ${selectedRoute ? 'updated' : 'created'} successfully`
        });
        setModalVisible(false);
        fetchRoutes(); // reload raw routes
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: response.message || `Failed to ${selectedRoute ? 'update' : 'create'} route`
        });
      }
    } catch (error) {
      console.error('Error saving route:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: `Failed to ${selectedRoute ? 'update' : 'create'} route. Please try again.`
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRoute = (route) => {
    Alert.alert(
      'Delete Route',
      'Are you sure you want to delete this route?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await RouteService.deleteRoute(route.originalData._id);
              if (response.success) {
                Toast.show({
                  type: 'success',
                  text1: 'Success',
                  text2: 'Route deleted successfully'
                });
                fetchRoutes();
              } else {
                Toast.show({
                  type: 'error',
                  text1: 'Error',
                  text2: response.message || 'Failed to delete route'
                });
              }
            } catch (error) {
              console.error('Error deleting route:', error);
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to delete route. Please try again.'
              });
            }
          }
        }
      ]
    );
  };

  // Updated route card with clear start and end stop display
  const renderRouteCard = (route) => (
    <View key={route.id} style={styles.routeCard}>
      <View style={styles.routeHeader}>
       
        <View style={styles.routeInfo}>
          <Text style={styles.routeTitle}>{route.name}</Text>

          <View style={styles.routeMetrics}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Distance</Text>
              <Text style={styles.metricValue}>{route.distance} km</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Duration</Text>
              <Text style={styles.metricValue}>{route.duration}</Text>
            </View>
            <TouchableOpacity 
              style={[styles.actionBtn, styles.viewBtn]}
              onPress={() => handleViewRoute(route)}
            >
              <Text style={styles.viewBtnText}>View More</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#28a745" />
          <Text style={styles.loadingText}>Loading routes...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
          onPress={handleAddRoute}
        >
          <Text style={styles.addBtnText}>+ Add Route</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Simple From/To Filter Section */}
        <View style={styles.filterSection}>
          <View style={styles.filterRow}>
            <View style={styles.filterItem}>
              <Text style={styles.filterLabel}>From</Text>
              <StopSelector
                stops={stops}
                selectedStopId={selectedStartStop?._id}
                onSelectStop={handleStartStopFilter}
                placeholder="Any start point"
                style={styles.filterSelector}
              />
            </View>
            
            <View style={styles.filterItem}>
              <Text style={styles.filterLabel}>To</Text>
              <StopSelector
                stops={stops}
                selectedStopId={selectedEndStop?._id}
                onSelectStop={handleEndStopFilter}
                placeholder="Any end point"
                style={styles.filterSelector}
              />
            </View>
            
            {(selectedStartStop || selectedEndStop) && (
              <TouchableOpacity style={styles.clearFiltersBtn} onPress={clearFilters}>
                <Text style={styles.clearFiltersBtnText}>Clear</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {/* Results Count */}
          <View style={styles.resultsInfo}>
            <Text style={styles.resultsText}>
              {filteredRoutes.length} of {routes.length} routes
            </Text>
          </View>
        </View>
        
        {/* Routes List */}
        {filteredRoutes.length > 0 ? (
          filteredRoutes.map(renderRouteCard)
        ) : routes.length > 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No Routes Match Your Filters</Text>
            <Text style={styles.emptyStateText}>
              Try adjusting your from/to filters or clear filters to see all routes.
            </Text>
            <TouchableOpacity style={styles.clearFiltersBtn} onPress={clearFilters}>
              <Text style={styles.clearFiltersBtnText}>Clear Filters</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No Routes Found</Text>
            <Text style={styles.emptyStateText}>
              Start by adding your first bus route using the "Add Route" button above.
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
              <Text style={styles.inputLabel}>Start Point <Text style={styles.required}>*</Text></Text>
              <StopSelector
                stops={stops}
                selectedStopId={formData.startPointId}
                onSelectStop={(stopId, stopData) => handleStartPointSelect(stopId, stopData)}
                error={formErrors.startPointId}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>End Point <Text style={styles.required}>*</Text></Text>
              <StopSelector
                stops={stops}
                selectedStopId={formData.endPointId}
                onSelectStop={(stopId, stopData) => handleEndPointSelect(stopId, stopData)}
                error={formErrors.endPointId}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Distance (km) <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={[styles.textInput, formErrors.distance && styles.textInputError]}
                placeholder="Enter distance in kilometers"
                value={formData.distance}
                onChangeText={(text) => handleInputChange('distance', text)}
                keyboardType="numeric"
              />
              {formErrors.distance && <Text style={styles.errorText}>{formErrors.distance}</Text>}
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Duration <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={[styles.textInput, formErrors.time && styles.textInputError]}
                placeholder="Enter duration (e.g., 45 minutes)"
                value={formData.time}
                onChangeText={(text) => handleInputChange('time', text)}
              />
              {formErrors.time && <Text style={styles.errorText}>{formErrors.time}</Text>}
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Middle Stops (Optional)</Text>
              <Text style={styles.inputHint}>Select multiple stops</Text>
              <MultiStopSelector
                stops={stops}
                selectedStopIds={formData.middleStopIds}
                onSelectStops={(stopIds, stopsData) => handleMiddleStopsSelect(stopIds, stopsData)}
                excludeStopIds={[formData.startPointId, formData.endPointId].filter(Boolean)}
                error={formErrors.middleStopIds}
              />
            </View>
            
            <TouchableOpacity 
              style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
              onPress={handleSaveRoute}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.saveBtnText}>
                  {selectedRoute ? 'Update Route' : 'Create Route'}
                </Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* View Route Details Modal */}
      <Modal
        visible={viewRouteModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Route Details</Text>
            <TouchableOpacity 
              style={styles.closeBtn}
              onPress={() => setViewRouteModal(false)}
            >
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            {selectedViewRoute && (
              <>
                <View style={styles.detailSection}>
                  <Text style={styles.detailTitle}>Route Information</Text>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Route Name:</Text>
                    <Text style={styles.detailValue}>{selectedViewRoute.name}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Start Point:</Text>
                    <Text style={styles.detailValue}>{selectedViewRoute.startStopName || 'Unknown Start'}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>End Point:</Text>
                    <Text style={styles.detailValue}>{selectedViewRoute.endStopName || 'Unknown End'}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Distance:</Text>
                    <Text style={styles.detailValue}>{selectedViewRoute.distance} km</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Duration:</Text>
                    <Text style={styles.detailValue}>{selectedViewRoute.duration}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Total Stops:</Text>
                    <Text style={styles.detailValue}>{selectedViewRoute.totalStops}</Text>
                  </View>
                </View>

                {selectedViewRoute.middleStopNames.length > 0 && (
                  <View style={styles.detailSection}>
                    <Text style={styles.detailTitle}>Middle Stops</Text>
                    {selectedViewRoute.middleStopNames.map((stopName, index) => (
                      <View key={index} style={styles.stopListItem}>
                        <Text style={styles.stopNumber}>{index + 1}</Text>
                        <Text style={styles.stopNameText}>{stopName}</Text>
                      </View>
                    ))}
                  </View>
                )}

                <View style={styles.detailSection}>
                  <Text style={styles.detailTitle}>Route Path</Text>
                  <View style={styles.routePath}>
                    <View style={styles.pathItem}>
                      <View style={[styles.pathDot, styles.startDot]} />
                      <Text style={styles.pathLabel}>Start: {selectedViewRoute.startStopName || 'Unknown Start'}</Text>
                    </View>
                    
                    {selectedViewRoute.middleStopNames && selectedViewRoute.middleStopNames.length > 0 && selectedViewRoute.middleStopNames.map((stopName, index) => (
                      <View key={index} style={styles.pathItem}>
                        <View style={[styles.pathDot, styles.middleDot]} />
                        <Text style={styles.pathLabel}>{stopName || 'Unknown Stop'}</Text>
                      </View>
                    ))}
                    
                    <View style={styles.pathItem}>
                      <View style={[styles.pathDot, styles.endDot]} />
                      <Text style={styles.pathLabel}>End: {selectedViewRoute.endStopName || 'Unknown End'}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.actionButtons}>
                    <TouchableOpacity 
                      style={[styles.actionBtn, styles.manageBtn]}
                      onPress={() => {
                        setViewRouteModal(false);
                        handleEditRoute(selectedViewRoute);
                      }}
                    >
                      <Text style={styles.manageBtnText}>Edit Route</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.actionBtn, styles.deleteBtn]}
                      onPress={() => {
                        setViewRouteModal(false);
                        handleDeleteRoute(selectedViewRoute);
                      }}
                    >
                      <Text style={styles.deleteBtnText}>Delete Route</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
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
    alignItems: SCREEN_WIDTH > 400 ? 'flex-start' : 'stretch',
    paddingHorizontal: SCREEN_WIDTH > 400 ? 20 : 14,
    paddingTop: SCREEN_WIDTH > 400 ? '12%' : '8%',
    paddingBottom: SCREEN_WIDTH > 400 ? 16 : 12,
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
    backgroundColor: '#28a745',
    paddingHorizontal: SCREEN_WIDTH > 400 ? 20 : 16,
    paddingVertical: SCREEN_WIDTH > 400 ? 12 : 10,
    borderRadius: 30,
    marginTop: SCREEN_WIDTH > 400 ? 8 : 0,
    alignSelf: SCREEN_WIDTH > 400 ? 'flex-start' : 'center',
    minWidth: 120,
    alignItems: 'center',
    shadowColor: '#28a745',
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
    paddingTop: 0,
    paddingHorizontal: 0,
    paddingBottom: 80,
  },
  routeCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: SCREEN_WIDTH > 400 ? 20 : 16,
    borderRadius: SCREEN_WIDTH > 400 ? 20 : 16,
    marginBottom: SCREEN_WIDTH > 400 ? 10 : 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  },
  required:{
    color: 'red',
  },
  routeHeader: {
    flexDirection: SCREEN_WIDTH > 350 ? 'row' : 'column',
    padding: SCREEN_WIDTH > 400 ? 24 : 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
    alignItems: SCREEN_WIDTH > 350 ? 'flex-start' : 'center',
  },
  routeIconContainer: {
    width: SCREEN_WIDTH > 400 ? 60 : 50,
    height: SCREEN_WIDTH > 400 ? 60 : 50,
    borderRadius: SCREEN_WIDTH > 400 ? 18 : 12,
    backgroundColor: '#e8f5e8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SCREEN_WIDTH > 350 ? 20 : 0,
    marginBottom: SCREEN_WIDTH > 350 ? 0 : 16,
  },
  routeIcon: {
    fontSize: SCREEN_WIDTH > 400 ? 36 : 32,
  },
  routeInfo: {
    flex: 1,
    alignItems: SCREEN_WIDTH > 350 ? 'flex-start' : 'center',
  },
  routeTitle: {
    fontSize: SCREEN_WIDTH > 400 ? 20 : 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 6,
    textAlign: SCREEN_WIDTH > 350 ? 'left' : 'center',
  },
  routeCode: {
    fontSize: SCREEN_WIDTH > 400 ? 16 : 14,
    color: '#6c757d',
    marginBottom: SCREEN_WIDTH > 400 ? 10 : 8,
    textAlign: SCREEN_WIDTH > 350 ? 'left' : 'center',
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
    padding: SCREEN_WIDTH > 400 ? 24 : 20,
  },
  routeDescription: {
    fontSize: SCREEN_WIDTH > 400 ? 16 : 14,
    color: '#495057',
    lineHeight: SCREEN_WIDTH > 400 ? 26 : 22,
    marginBottom: SCREEN_WIDTH > 400 ? 20 : 16,
    textAlign: SCREEN_WIDTH > 350 ? 'left' : 'center',
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
    flexDirection: SCREEN_WIDTH > 320 ? 'row' : 'column',
    flexWrap: 'wrap',
  },
  actionBtn: {
    flex: SCREEN_WIDTH > 320 ? 1 : 0,
    paddingVertical: SCREEN_WIDTH > 400 ? 12 : 10,
    paddingHorizontal: SCREEN_WIDTH > 400 ? 16 : 12,
    borderRadius: SCREEN_WIDTH > 400 ? 10 : 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: SCREEN_WIDTH > 400 ? 44 : 40,
    minWidth: SCREEN_WIDTH > 320 ? 80 : '100%',
    marginRight: SCREEN_WIDTH > 320 ? 8 : 0,
    marginBottom: 8,
  },
  manageBtn: {
    backgroundColor: '#87ceeb',
    shadowColor: '#87ceeb',
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
    backgroundColor: '#2196f3',
    shadowColor: '#2196f3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  viewBtnText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: SCREEN_WIDTH > 400 ? 16 : 14,
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
  textInputError: {
    borderColor: '#dc3545',
  },
  errorText: {
    fontSize: 12,
    color: '#dc3545',
    marginTop: 4,
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
    fontSize: SCREEN_WIDTH > 400 ? 16 : 14,
  },
  inputHint: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 5,
  },
  saveBtnDisabled: {
    backgroundColor: '#6c757d',
  },
  detailSection: {
    backgroundColor: '#ffffff',
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: '600',
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
    fontWeight: '500',
    color: '#6c757d',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
    textAlign: 'right',
  },
  stopListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  stopNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#28a745',
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 12,
  },
  stopNameText: {
    fontSize: 14,
    color: '#1a1a1a',
    flex: 1,
  },
  routePath: {
    paddingLeft: 16,
  },
  pathItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  pathDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  startDot: {
    backgroundColor: '#28a745',
  },
  middleDot: {
    backgroundColor: '#ffc107',
  },
  endDot: {
    backgroundColor: '#dc3545',
  },
  pathLabel: {
    fontSize: 14,
    color: '#1a1a1a',
  },
  filterSection: {
    margin: 16,
    marginBottom: 8,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  filterItem: {
    flex: 1,
    marginRight: 10,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  filterSelector: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 5 ,
    paddingBottom: 3,
    fontSize: 14,
    backgroundColor: '#ffffff',
  },
  resultsInfo: {
    paddingTop: 5,
    paddingBottom: 3,
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  resultsText: {
    fontSize: 14,
    color: '#6c757d',
  },
  stopInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stopLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginRight: 8,
  },
  stopName: {
    fontSize: 14,
    color: '#6c757d',
  },
  stopArrow: {
    marginHorizontal: 10,
  },
  arrowText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  clearFiltersBtn: {
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    alignItems: 'center',
  },
  clearFiltersBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6c757d',
  },
  routeStops: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
});

export default RouteManagement;
