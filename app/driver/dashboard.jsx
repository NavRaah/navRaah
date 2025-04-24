import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  ScrollView,
  Alert,
  Platform,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  Modal,
  KeyboardAvoidingView
} from 'react-native';
import * as Location from 'expo-location';
import { 
  MaterialIcons, 
  FontAwesome5, 
  Ionicons, 
  FontAwesome, 
  MaterialCommunityIcons,
  AntDesign
} from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

const DriverDashboard = ({ navigation }) => {
  // Main state variables
  const [activeTab, setActiveTab] = useState('status');
  const [busId, setBusId] = useState('BUS-1234');
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [driverStatus, setDriverStatus] = useState('on_duty');
  const [routeSelectModalVisible, setRouteSelectModalVisible] = useState(false);
  const [incidentModalVisible, setIncidentModalVisible] = useState(false);
  const [maintenanceModalVisible, setMaintenanceModalVisible] = useState(false);
  
  // Route management
  const [availableRoutes, setAvailableRoutes] = useState([
    { id: '1', name: 'Route 42', stops: 7, estimatedDuration: '120 min' },
    { id: '2', name: 'Express Line 8', stops: 5, estimatedDuration: '90 min' },
    { id: '3', name: 'Downtown Loop', stops: 10, estimatedDuration: '150 min' },
    { id: '4', name: 'Airport Shuttle', stops: 4, estimatedDuration: '60 min' },
    { id: '5', name: 'Cross-town Line', stops: 8, estimatedDuration: '135 min' },
  ]);
  const [currentRoute, setCurrentRoute] = useState('Route 42');
  const [currentRouteInfo, setCurrentRouteInfo] = useState(availableRoutes[0]);
  const [estimatedArrival, setEstimatedArrival] = useState('10:45 AM');
  const [delayMinutes, setDelayMinutes] = useState('0');
  const [delayReason, setDelayReason] = useState('');
  const [nextStop, setNextStop] = useState('Central Station');
  const [stopModalVisible, setStopModalVisible] = useState(false);
  const [selectedStop, setSelectedStop] = useState(null);
  const [passengerLoad, setPassengerLoad] = useState('medium');
  
  // Route stops
  const [routeStops, setRouteStops] = useState([
    { id: '1', name: 'Downtown Terminal', eta: '10:15 AM', status: 'completed' },
    { id: '2', name: 'Central Station', eta: '10:45 AM', status: 'next' },
    { id: '3', name: 'University Campus', eta: '11:10 AM', status: 'pending' },
    { id: '4', name: 'Hospital Center', eta: '11:25 AM', status: 'pending' },
    { id: '5', name: 'Market Square', eta: '11:40 AM', status: 'pending' },
    { id: '6', name: 'Tech Park', eta: '12:05 PM', status: 'pending' },
    { id: '7', name: 'Riverside District', eta: '12:20 PM', status: 'pending' },
  ]);
    
  // Conductor notes
  const [conductorNotes, setConductorNotes] = useState('');
  const [conductorNotesHistory, setConductorNotesHistory] = useState([]);
  const [showConductorInput, setShowConductorInput] = useState(false);
  
  // Incident reporting
  const [incidentType, setIncidentType] = useState('delay');
  const [incidentDescription, setIncidentDescription] = useState('');
  const [incidents, setIncidents] = useState([
    { 
      id: 'INC-278931', 
      type: 'delay', 
      timestamp: '2025-04-24 08:32 AM', 
      description: 'Heavy traffic due to construction on Main St', 
      status: 'acknowledged' 
    }
  ]);

  // Maintenance logs
  const [maintenanceType, setMaintenanceType] = useState('mechanical');
  const [maintenanceDescription, setMaintenanceDescription] = useState('');
  const [maintenanceLogs, setMaintenanceLogs] = useState([
    {
      id: 'MAINT-45623',
      type: 'mechanical',
      timestamp: '2025-04-23 06:00 PM',
      description: 'Routine oil change and brake inspection',
      status: 'completed'
    },
    {
      id: 'MAINT-45584',
      type: 'cosmetic',
      timestamp: '2025-04-21 05:30 PM',
      description: 'Repaired tear in seat cushion #12',
      status: 'completed'
    }
  ]);
  
  // Vehicle status
  const [fuelLevel, setFuelLevel] = useState(72);
  const [mileage, setMileage] = useState(24567);
  const [nextMaintenance, setNextMaintenance] = useState('2025-05-15');

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const fetchData = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const onRefresh = () => {
    fetchData();
  };

  const updateDriverStatus = (status) => {
    setDriverStatus(status);
    console.log('Driver status updated:', status);
    
    if (status === 'off_duty') {
      Alert.alert('Status Update', 'You are now off duty. Safe travels!');
    } else if (status === 'break') {
      Alert.alert('Status Update', 'You are now on break.');
    }
  };

  const updatePassengerLoad = (load) => {
    setPassengerLoad(load);
    console.log('Passenger load updated:', load);
  };

  const submitConductorNote = () => {
    if (conductorNotes.trim() === '') {
      Alert.alert('Required Field', 'Please enter conductor notes');
      return;
    }
    
    const newNote = {
      id: `NOTE-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toLocaleTimeString(),
      note: conductorNotes,
      passengerLoad
    };
    
    setConductorNotesHistory([newNote, ...conductorNotesHistory]);
    setConductorNotes('');
    setShowConductorInput(false);
    
    console.log('Conductor note submitted:', newNote);
    Alert.alert('Note Submitted', 'Your conductor note has been submitted to dispatch.');
  };

  const reportDelay = () => {
    if (delayMinutes === '0') {
      Alert.alert('Required Field', 'Please enter delay duration');
      return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      const newIncident = {
        id: `INC-${Date.now().toString().slice(-6)}`,
        type: 'delay',
        timestamp: new Date().toLocaleString(),
        description: `${delayMinutes} minute delay: ${delayReason || 'No reason provided'}`,
        status: 'reported'
      };
      
      setIncidents([newIncident, ...incidents]);
      
      const updatedStops = routeStops.map(stop => {
        if (stop.status === 'pending' || stop.status === 'next') {
          return { ...stop, eta: `Delayed ${delayMinutes} min` };
        }
        return stop;
      });
      
      setRouteStops(updatedStops);
      setDelayMinutes('0');
      setDelayReason('');
      setIsLoading(false);
      
      Alert.alert('Delay Reported', 'Your delay has been reported to dispatch and passengers.');
    }, 800);
  };

  const markStopCompleted = (stopId) => {
    const updatedStops = routeStops.map(stop => {
      if (stop.id === stopId) {
        return { ...stop, status: 'completed' };
      }
      
      if (stop.status === 'next') {
        return stop;
      }
      
      if (stop.id === String(Number(stopId) + 1)) {
        setNextStop(stop.name);
        return { ...stop, status: 'next' };
      }
      
      return stop;
    });
    
    setRouteStops(updatedStops);
    console.log('Stop marked as completed:', stopId);
    setStopModalVisible(false);
    Alert.alert('Stop Completed', 'The stop has been marked as completed and your next stop is now highlighted.');
  };

  const openStopDetails = (stop) => {
    setSelectedStop(stop);
    setStopModalVisible(true);
  };

  const submitIncident = () => {
    if (incidentDescription.trim() === '') {
      Alert.alert('Required Field', 'Please enter incident details');
      return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      const newIncident = {
        id: `INC-${Date.now().toString().slice(-6)}`,
        type: incidentType,
        timestamp: new Date().toLocaleString(),
        description: incidentDescription,
        status: 'reported'
      };
      
      setIncidents([newIncident, ...incidents]);
      setIncidentModalVisible(false);
      setIncidentDescription('');
      setIsLoading(false);
      
      Alert.alert('Incident Reported', 'Your incident has been reported to dispatch.');
    }, 800);
  };

  const submitMaintenanceLog = () => {
    if (maintenanceDescription.trim() === '') {
      Alert.alert('Required Field', 'Please enter maintenance details');
      return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      const newMaintenanceLog = {
        id: `MAINT-${Date.now().toString().slice(-6)}`,
        type: maintenanceType,
        timestamp: new Date().toLocaleString(),
        description: maintenanceDescription,
        status: 'reported'
      };
      
      setMaintenanceLogs([newMaintenanceLog, ...maintenanceLogs]);
      setMaintenanceModalVisible(false);
      setMaintenanceDescription('');
      setIsLoading(false);
      
      Alert.alert('Maintenance Logged', 'Your maintenance log has been submitted to the maintenance department.');
    }, 800);
  };

  const selectRoute = (route) => {
    setCurrentRoute(route.name);
    setCurrentRouteInfo(route);
    setRouteSelectModalVisible(false);
    
    // Reset route progress
    const newRouteStops = Array(Number(route.stops)).fill().map((_, index) => {
      const stopId = String(index + 1);
      let status = 'pending';
      
      if (index === 0) {
        status = 'next';
      }
      
      return {
        id: stopId,
        name: `Stop ${stopId}`,
        eta: calculateEta(index, route.estimatedDuration),
        status: status
      };
    });
    
    setRouteStops(newRouteStops);
    setNextStop(newRouteStops[0].name);
    
    Alert.alert('Route Changed', `You've been assigned to ${route.name}`);
  };

  const calculateEta = (stopIndex, totalDuration) => {
    const totalMinutes = parseInt(totalDuration);
    const minutesPerStop = totalMinutes / (availableRoutes[0].stops);
    const now = new Date();
    now.setMinutes(now.getMinutes() + (stopIndex * minutesPerStop));
    
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'on_duty':
        return <MaterialIcons name="work" size={18} color="#4a90e2" />;
      case 'on_route':
        return <FontAwesome5 name="route" size={18} color="#27ae60" />;
      case 'break':
        return <FontAwesome5 name="coffee" size={18} color="#f39c12" />;
      case 'off_duty':
        return <MaterialIcons name="do-not-disturb" size={18} color="#95a5a6" />;
      default:
        return <MaterialIcons name="help" size={18} color="#95a5a6" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'on_duty':
        return 'On Duty';
      case 'on_route':
        return 'On Route';
      case 'break':
        return 'On Break';
      case 'off_duty':
        return 'Off Duty';
      default:
        return 'Unknown';
    }
  };

  const getLoadIcon = (load) => {
    switch (load) {
      case 'empty':
        return <MaterialIcons name="airline-seat-recline-normal" size={18} color="#95a5a6" />;
      case 'light':
        return <MaterialIcons name="airline-seat-recline-normal" size={18} color="#3498db" />;
      case 'medium':
        return <MaterialIcons name="airline-seat-recline-normal" size={18} color="#f39c12" />;
      case 'heavy':
        return <MaterialIcons name="airline-seat-recline-normal" size={18} color="#e74c3c" />;
      case 'full':
        return <MaterialIcons name="airline-seat-recline-normal" size={18} color="#8e44ad" />;
      default:
        return <MaterialIcons name="help" size={18} color="#95a5a6" />;
    }
  };

  const getLoadText = (load) => {
    switch (load) {
      case 'empty':
        return 'Empty (0-20%)';
      case 'light':
        return 'Light (20-40%)';
      case 'medium':
        return 'Medium (40-60%)';
      case 'heavy':
        return 'Heavy (60-80%)';
      case 'full':
        return 'Full (80-100%)';
      default:
        return 'Unknown';
    }
  };

  const getFuelLevelColor = (level) => {
    if (level > 60) return '#27ae60';
    if (level > 25) return '#f39c12';
    return '#e74c3c';
  };

  const getMaintenanceIcon = (type) => {
    switch (type) {
      case 'mechanical':
        return <FontAwesome5 name="tools" size={18} color="#f39c12" />;
      case 'electrical':
        return <MaterialCommunityIcons name="flash" size={18} color="#3498db" />;
      case 'cosmetic':
        return <MaterialIcons name="brush" size={18} color="#9b59b6" />;
      case 'safety':
        return <FontAwesome name="shield" size={18} color="#e74c3c" />;
      default:
        return <MaterialIcons name="build" size={18} color="#95a5a6" />;
    }
  };

  const renderStatusTab = () => {
    return (
      <View style={styles.tabContent}>
        <View style={styles.infoContainer}>
          <View style={styles.infoHeader}>
            <FontAwesome5 name="bus" size={20} color="#2c3e50" />
            <Text style={styles.infoTitle}>Route & Status</Text>
          </View>
          
          <View style={styles.routeInfoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Bus ID</Text>
              <Text style={styles.infoValue}>{busId}</Text>
            </View>
            <View style={styles.infoItem}>
              <TouchableOpacity 
                style={styles.routeSelector}
                onPress={() => setRouteSelectModalVisible(true)}>
                <Text style={styles.infoLabel}>Current Route</Text>
                <View style={styles.routeSelectorInner}>
                  <Text style={styles.infoValue}>{currentRoute}</Text>
                  <MaterialIcons name="arrow-drop-down" size={24} color="#4a90e2" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.routeInfoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Next Stop</Text>
              <Text style={styles.infoValue}>{nextStop}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Estimated Arrival</Text>
              <Text style={styles.infoValue}>{estimatedArrival}</Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.statusSection}>
            <Text style={styles.sectionLabel}>Your Status</Text>
            <View style={styles.statusOptions}>
              <TouchableOpacity
                style={[
                  styles.statusOption,
                  driverStatus === 'on_duty' && styles.activeStatusOption
                ]}
                onPress={() => updateDriverStatus('on_duty')}>
                <MaterialIcons 
                  name="work" 
                  size={20}
                  color={driverStatus === 'on_duty' ? '#fff' : '#4a90e2'}
                />
                <Text style={[
                  styles.statusOptionText,
                  driverStatus === 'on_duty' && styles.activeStatusText
                ]}>On Duty</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.statusOption,
                  driverStatus === 'on_route' && styles.activeStatusOption
                ]}
                onPress={() => updateDriverStatus('on_route')}>
                <FontAwesome5 
                  name="route" 
                  size={20}
                  color={driverStatus === 'on_route' ? '#fff' : '#27ae60'}
                />
                <Text style={[
                  styles.statusOptionText,
                  driverStatus === 'on_route' && styles.activeStatusText
                ]}>On Route</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.statusOption,
                  driverStatus === 'break' && styles.activeStatusOption
                ]}
                onPress={() => updateDriverStatus('break')}>
                <FontAwesome5 
                  name="coffee" 
                  size={20}
                  color={driverStatus === 'break' ? '#fff' : '#f39c12'}
                />
                <Text style={[
                  styles.statusOptionText,
                  driverStatus === 'break' && styles.activeStatusText
                ]}>Break</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.statusOption,
                  driverStatus === 'off_duty' && styles.activeStatusOption
                ]}
                onPress={() => updateDriverStatus('off_duty')}>
                <MaterialIcons 
                  name="do-not-disturb" 
                  size={20}
                  color={driverStatus === 'off_duty' ? '#fff' : '#95a5a6'}
                />
                <Text style={[
                  styles.statusOptionText,
                  driverStatus === 'off_duty' && styles.activeStatusText
                ]}>Off Duty</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        <View style={styles.vehicleStatusContainer}>
          <View style={styles.vehicleHeader}>
            <FontAwesome5 name="oil-can" size={20} color="#2c3e50" />
            <Text style={styles.vehicleTitle}>Vehicle Status</Text>
          </View>
          
          <View style={styles.vehicleStats}>
            <View style={styles.vehicleStat}>
              <Text style={styles.vehicleStatLabel}>Fuel Level</Text>
              <View style={styles.fuelBarContainer}>
                <View 
                  style={[
                    styles.fuelBar, 
                    { 
                      width: `${fuelLevel}%`,
                      backgroundColor: getFuelLevelColor(fuelLevel)
                    }
                  ]} 
                />
              </View>
              <Text style={styles.vehicleStatValue}>{fuelLevel}%</Text>
            </View>
            
            <View style={styles.vehicleStatRow}>
              <View style={styles.vehicleStat}>
                <Text style={styles.vehicleStatLabel}>Odometer</Text>
                <Text style={styles.vehicleStatValue}>{mileage.toLocaleString()} mi</Text>
              </View>
              
              <View style={styles.vehicleStat}>
                <Text style={styles.vehicleStatLabel}>Next Maintenance</Text>
                <Text style={styles.vehicleStatValue}>{nextMaintenance}</Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.delayContainer}>
          <View style={styles.delayHeader}>
            <MaterialCommunityIcons name="timer-sand" size={25} color="#e74c3c" />
            <Text style={styles.delayTitle}>Report Delay</Text>
          </View>
          
          <View style={styles.delayInputRow}>
            <View style={styles.delayMinutesWrapper}>
              <Text style={styles.delayLabel}>Minutes Delayed:</Text>
              <TextInput
                style={styles.delayMinutesInput}
                value={delayMinutes}
                onChangeText={setDelayMinutes}
                keyboardType="number-pad"
                placeholder="0"
              />
            </View>
            
            <TouchableOpacity
              style={[
                styles.reportButton,
                delayMinutes === '0' && styles.disabledButton
              ]}
              onPress={reportDelay}
              disabled={delayMinutes === '0'}>
              <Text style={styles.reportButtonText}>Report</Text>
            </TouchableOpacity>
          </View>
          
          <TextInput
            style={styles.delayReasonInput}
            value={delayReason}
            onChangeText={setDelayReason}
            placeholder="Reason for delay (optional)"
            multiline
          />
        </View>
        
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setIncidentModalVisible(true)}>
            <FontAwesome name="exclamation-triangle" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Report Incident</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.maintenanceButton]}
            onPress={() => setMaintenanceModalVisible(true)}>
            <FontAwesome5 name="tools" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Log Maintenance</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderRouteTab = () => {
    return (
      <View style={styles.tabContent}>
        <View style={styles.routeHeaderContainer}>
          <View style={styles.routeHeaderInfo}>
            <Text style={styles.routeTitle}>{currentRoute}</Text>
            <View style={styles.routeStats}>
              <View style={styles.routeStat}>
                <FontAwesome5 name="map-marker-alt" size={16} color="#4a90e2" />
                <Text style={styles.routeStatText}>{routeStops.length} Stops</Text>
              </View>
              
              <View style={styles.routeStat}>
                <FontAwesome5 name="check-circle" size={16} color="#27ae60" />
                <Text style={styles.routeStatText}>
                  {routeStops.filter(stop => stop.status === 'completed').length} Completed
                </Text>
              </View>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.changeRouteButton}
            onPress={() => setRouteSelectModalVisible(true)}>
            <AntDesign name="swap" size={16} color="#fff" />
            <Text style={styles.changeRouteText}>Change</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.stopsContainer}>
          <View style={styles.stopsHeader}>
            <Text style={styles.stopsTitle}>Route Stops</Text>
            <TouchableOpacity onPress={fetchData}>
              <Ionicons name="refresh" size={20} color="#4a90e2" />
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={routeStops}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.stopItem,
                  item.status === 'completed' && styles.completedStop,
                  item.status === 'next' && styles.nextStop
                ]}
                onPress={() => openStopDetails(item)}>
                <View style={styles.stopIconContainer}>
                  {item.status === 'completed' ? (
                    <MaterialIcons name="check-circle" size={24} color="#27ae60" />
                  ) : item.status === 'next' ? (
                    <MaterialIcons name="directions-bus" size={24} color="#4a90e2" />
                  ) : (
                    <MaterialIcons name="radio-button-unchecked" size={24} color="#bdc3c7" />
                  )}
                </View>
                
                <View style={styles.stopInfo}>
                  <Text style={styles.stopName}>{item.name}</Text>
                  <Text style={styles.stopEta}>ETA: {item.eta}</Text>
                </View>
                
                {item.status === 'next' && (
                  <TouchableOpacity
                    style={styles.completeStopButton}
                    onPress={() => markStopCompleted(item.id)}>
                    <Text style={styles.completeStopText}>Complete</Text>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.stopsList}
          />
        </View>
        
        <View style={styles.incidentsContainer}>
          <Text style={styles.incidentsTitle}>Recent Route Incidents</Text>
          
          {incidents.length === 0 ? (
            <View style={styles.emptyIncidents}>
              <MaterialIcons name="check-circle" size={40} color="#27ae60" />
              <Text style={styles.emptyIncidentsText}>No recent incidents</Text>
            </View>
          ) : (
            <FlatList
              data={incidents}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.incidentItem}>
                  <View style={styles.incidentHeader}>
                    <View style={styles.incidentType}>
                      {item.type === 'delay' ? (
                        <MaterialCommunityIcons name="timer-sand" size={18} color="#e74c3c" />
                      ) : item.type === 'mechanical' ? (
                        <FontAwesome5 name="tools" size={18} color="#f39c12" />
                      ) : (
                        <FontAwesome name="exclamation-triangle" size={18} color="#e74c3c" />
                      )}
                      <Text style={styles.incidentTypeText}>
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </Text>
                    </View>
                    <Text style={styles.incidentId}>{item.id}</Text>
                  </View>
                  
                  <Text style={styles.incidentTimestamp}>{item.timestamp}</Text>
                  <Text style={styles.incidentDescription}>{item.description}</Text>
                  
                  <View style={styles.incidentStatusBar}>
                    <Text
                      style={[
                        styles.incidentStatus,
                        item.status === 'acknowledged' ? styles.acknowledgedStatus : styles.reportedStatus
                      ]}>
                      {item.status.toUpperCase()}
                    </Text>
                  </View>
                </View>
              )}
              contentContainerStyle={styles.incidentsList}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>
    );
  };

  const renderMaintenanceTab = () => {
    return (
      <View style={styles.tabContent}>
        <View style={styles.maintenanceHeader}>
          <View style={styles.vehicleHeader}>
            <FontAwesome5 name="tools" size={20} color="#2c3e50" />
            <Text style={styles.vehicleTitle}>Maintenance Records</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.addMaintenanceButton}
            onPress={() => setMaintenanceModalVisible(true)}>
            <AntDesign name="plus" size={20} color="#fff" />
            <Text style={styles.addMaintenanceText}>New Log</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.vehicleOverview}>
          <View style={styles.vehicleInfoCard}>
            <Text style={styles.vehicleInfoLabel}>Bus ID</Text>
            <Text style={styles.vehicleInfoValue}>{busId}</Text>
          </View>
          
          <View style={styles.vehicleInfoCard}>
            <Text style={styles.vehicleInfoLabel}>Odometer</Text>
            <Text style={styles.vehicleInfoValue}>{mileage.toLocaleString()} mi</Text>
          </View>
          
          <View style={styles.vehicleInfoCard}>
            <Text style={styles.vehicleInfoLabel}>Fuel</Text>
            <Text style={styles.vehicleInfoValue}>{fuelLevel}%</Text>
          </View>
          
          <View style={styles.vehicleInfoCard}>
          <Text style={styles.vehicleInfoLabel}>Next Service</Text>
            <Text style={styles.vehicleInfoValue}>{nextMaintenance}</Text>
          </View>
        </View>
        
        <FlatList
          data={maintenanceLogs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.maintenanceLogItem}>
              <View style={styles.maintenanceLogHeader}>
                <View style={styles.maintenanceLogType}>
                  {getMaintenanceIcon(item.type)}
                  <Text style={styles.maintenanceLogTypeText}>
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </Text>
                </View>
                <Text style={styles.maintenanceLogId}>{item.id}</Text>
              </View>
              
              <Text style={styles.maintenanceLogTimestamp}>{item.timestamp}</Text>
              <Text style={styles.maintenanceLogDescription}>{item.description}</Text>
              
              <View style={styles.maintenanceLogStatusBar}>
                <Text
                  style={[
                    styles.maintenanceLogStatus,
                    item.status === 'completed' ? styles.completedStatus : styles.reportedStatus
                  ]}>
                  {item.status.toUpperCase()}
                </Text>
              </View>
            </View>
          )}
          contentContainerStyle={styles.maintenanceLogsList}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  };

  const renderConductorTab = () => {
    return (
      <View style={styles.tabContent}>
        <View style={styles.passengerContainer}>
          <View style={styles.passengerHeader}>
            <MaterialIcons name="people" size={20} color="#2c3e50" />
            <Text style={styles.passengerTitle}>Passenger Information</Text>
          </View>
          
          <View style={styles.passengerLoadSection}>
            <Text style={styles.sectionLabel}>Current Passenger Load</Text>
            <View style={styles.passengerLoadOptions}>
              <TouchableOpacity
                style={[
                  styles.loadOption,
                  passengerLoad === 'empty' && styles.activeLoadOption
                ]}
                onPress={() => updatePassengerLoad('empty')}>
                <MaterialIcons 
                  name="airline-seat-recline-normal" 
                  size={20}
                  color={passengerLoad === 'empty' ? '#fff' : '#95a5a6'}
                />
                <Text style={[
                  styles.loadOptionText,
                  passengerLoad === 'empty' && styles.activeLoadText
                ]}>Empty</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.loadOption,
                  passengerLoad === 'light' && styles.activeLoadOption
                ]}
                onPress={() => updatePassengerLoad('light')}>
                <MaterialIcons 
                  name="airline-seat-recline-normal" 
                  size={20}
                  color={passengerLoad === 'light' ? '#fff' : '#3498db'}
                />
                <Text style={[
                  styles.loadOptionText,
                  passengerLoad === 'light' && styles.activeLoadText
                ]}>Light</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.loadOption,
                  passengerLoad === 'medium' && styles.activeLoadOption
                ]}
                onPress={() => updatePassengerLoad('medium')}>
                <MaterialIcons 
                  name="airline-seat-recline-normal" 
                  size={20}
                  color={passengerLoad === 'medium' ? '#fff' : '#f39c12'}
                />
                <Text style={[
                  styles.loadOptionText,
                  passengerLoad === 'medium' && styles.activeLoadText
                ]}>Medium</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.loadOption,
                  passengerLoad === 'heavy' && styles.activeLoadOption
                ]}
                onPress={() => updatePassengerLoad('heavy')}>
                <MaterialIcons 
                  name="airline-seat-recline-normal" 
                  size={20}
                  color={passengerLoad === 'heavy' ? '#fff' : '#e74c3c'}
                />
                <Text style={[
                  styles.loadOptionText,
                  passengerLoad === 'heavy' && styles.activeLoadText
                ]}>Heavy</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.loadOption,
                  passengerLoad === 'full' && styles.activeLoadOption
                ]}
                onPress={() => updatePassengerLoad('full')}>
                <MaterialIcons 
                  name="airline-seat-recline-normal" 
                  size={20}
                  color={passengerLoad === 'full' ? '#fff' : '#8e44ad'}
                />
                <Text style={[
                  styles.loadOptionText,
                  passengerLoad === 'full' && styles.activeLoadText
                ]}>Full</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        <View style={styles.conductorNotesContainer}>
          <View style={styles.conductorNotesHeader}>
            <MaterialIcons name="note-add" size={20} color="#2c3e50" />
            <Text style={styles.conductorNotesTitle}>Conductor Notes</Text>
          </View>
          
          {!showConductorInput ? (
            <TouchableOpacity 
              style={styles.addNoteButton}
              onPress={() => setShowConductorInput(true)}>
              <AntDesign name="plus" size={20} color="#fff" />
              <Text style={styles.addNoteText}>Add Note</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.conductorInputContainer}>
              <TextInput
                style={styles.conductorInput}
                value={conductorNotes}
                onChangeText={setConductorNotes}
                placeholder="Add your notes here..."
                multiline
              />
              
              <View style={styles.conductorInputButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setShowConductorInput(false);
                    setConductorNotes('');
                  }}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    !conductorNotes.trim() && styles.disabledButton
                  ]}
                  onPress={submitConductorNote}
                  disabled={!conductorNotes.trim()}>
                  <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          
          {conductorNotesHistory.length === 0 ? (
            <View style={styles.emptyNotes}>
              <MaterialIcons name="note" size={40} color="#95a5a6" />
              <Text style={styles.emptyNotesText}>No conductor notes yet</Text>
            </View>
          ) : (
            <FlatList
              data={conductorNotesHistory}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.noteItem}>
                  <View style={styles.noteHeader}>
                    <Text style={styles.noteTimestamp}>{item.timestamp}</Text>
                    <View style={styles.noteLoadIndicator}>
                      {getLoadIcon(item.passengerLoad)}
                      <Text style={styles.noteLoadText}>{getLoadText(item.passengerLoad)}</Text>
                    </View>
                  </View>
                  <Text style={styles.noteText}>{item.note}</Text>
                </View>
              )}
              contentContainerStyle={styles.notesList}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <FontAwesome5 name="bus" size={24} color="#4a90e2" />
          <Text style={styles.headerTitle}>Driver Dashboard</Text>
        </View>
        
        <View style={styles.headerRight}>
          <View style={styles.statusIndicator}>
            {getStatusIcon(driverStatus)}
            <Text style={styles.statusText}>{getStatusText(driverStatus)}</Text>
          </View>
          
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}>
            <FontAwesome name="user-circle" size={24} color="#4a90e2" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'status' && styles.activeTab]}
          onPress={() => setActiveTab('status')}>
          <MaterialIcons 
            name="dashboard" 
            size={24} 
            color={activeTab === 'status' ? '#4a90e2' : '#95a5a6'} 
          />
          <Text style={[styles.tabText, activeTab === 'status' && styles.activeTabText]}>
            Status
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'route' && styles.activeTab]}
          onPress={() => setActiveTab('route')}>
          <FontAwesome5 
            name="route" 
            size={24} 
            color={activeTab === 'route' ? '#4a90e2' : '#95a5a6'} 
          />
          <Text style={[styles.tabText, activeTab === 'route' && styles.activeTabText]}>
            Route
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'maintenance' && styles.activeTab]}
          onPress={() => setActiveTab('maintenance')}>
          <FontAwesome5 
            name="tools" 
            size={24} 
            color={activeTab === 'maintenance' ? '#4a90e2' : '#95a5a6'} 
          />
          <Text style={[styles.tabText, activeTab === 'maintenance' && styles.activeTabText]}>
            Maintenance
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'conductor' && styles.activeTab]}
          onPress={() => setActiveTab('conductor')}>
          <MaterialIcons 
            name="people" 
            size={24} 
            color={activeTab === 'conductor' ? '#4a90e2' : '#95a5a6'} 
          />
          <Text style={[styles.tabText, activeTab === 'conductor' && styles.activeTabText]}>
            Conductor
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }>
        {activeTab === 'status' && renderStatusTab()}
        {activeTab === 'route' && renderRouteTab()}
        {activeTab === 'maintenance' && renderMaintenanceTab()}
        {activeTab === 'conductor' && renderConductorTab()}
      </ScrollView>
      
      {/* Route Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={routeSelectModalVisible}
        onRequestClose={() => setRouteSelectModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setRouteSelectModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableOpacity 
              activeOpacity={1} 
              style={styles.modalContent}
              onPress={e => e.stopPropagation()}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Route</Text>
                <TouchableOpacity onPress={() => setRouteSelectModalVisible(false)}>
                  <MaterialIcons name="close" size={24} color="#2c3e50" />
                </TouchableOpacity>
              </View>
              
              <FlatList
                data={availableRoutes}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={[
                      styles.routeItem,
                      currentRoute === item.name && styles.selectedRouteItem
                    ]}
                    onPress={() => selectRoute(item)}>
                    <View style={styles.routeItemContent}>
                      <Text style={styles.routeItemName}>{item.name}</Text>
                      <View style={styles.routeItemDetails}>
                        <View style={styles.routeItemDetail}>
                          <FontAwesome5 name="map-marker-alt" size={14} color="#4a90e2" />
                          <Text style={styles.routeItemDetailText}>{item.stops} Stops</Text>
                        </View>
                        <View style={styles.routeItemDetail}>
                          <MaterialCommunityIcons name="clock-outline" size={14} color="#f39c12" />
                          <Text style={styles.routeItemDetailText}>{item.estimatedDuration}</Text>
                        </View>
                      </View>
                    </View>
                    
                    {currentRoute === item.name && (
                      <MaterialIcons name="check-circle" size={24} color="#27ae60" />
                    )}
                  </TouchableOpacity>
                )}
                contentContainerStyle={styles.routesList}
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
      
      {/* Stop Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={stopModalVisible}
        onRequestClose={() => setStopModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setStopModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableOpacity 
              activeOpacity={1} 
              style={styles.modalContent}
              onPress={e => e.stopPropagation()}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Stop Details</Text>
                <TouchableOpacity onPress={() => setStopModalVisible(false)}>
                  <MaterialIcons name="close" size={24} color="#2c3e50" />
                </TouchableOpacity>
              </View>
              
              {selectedStop && (
                <View style={styles.stopDetailsContainer}>
                  <Text style={styles.stopDetailsName}>{selectedStop.name}</Text>
                  
                  <View style={styles.stopDetailsInfo}>
                    <View style={styles.stopDetailsInfoItem}>
                      <Text style={styles.stopDetailsInfoLabel}>Status</Text>
                      <View style={styles.stopDetailsStatus}>
                        {selectedStop.status === 'completed' ? (
                          <>
                            <MaterialIcons name="check-circle" size={18} color="#27ae60" />
                            <Text style={[styles.stopDetailsStatusText, { color: '#27ae60' }]}>
                              Completed
                            </Text>
                          </>
                        ) : selectedStop.status === 'next' ? (
                          <>
                            <MaterialIcons name="directions-bus" size={18} color="#4a90e2" />
                            <Text style={[styles.stopDetailsStatusText, { color: '#4a90e2' }]}>
                              Next Stop
                            </Text>
                          </>
                        ) : (
                          <>
                            <MaterialIcons name="schedule" size={18} color="#95a5a6" />
                            <Text style={[styles.stopDetailsStatusText, { color: '#95a5a6' }]}>
                              Upcoming
                            </Text>
                          </>
                        )}
                      </View>
                    </View>
                    
                    <View style={styles.stopDetailsInfoItem}>
                      <Text style={styles.stopDetailsInfoLabel}>ETA</Text>
                      <Text style={styles.stopDetailsInfoValue}>{selectedStop.eta}</Text>
                    </View>
                  </View>
                  
                  {selectedStop.status === 'next' && (
                    <TouchableOpacity
                      style={styles.markCompletedButton}
                      onPress={() => markStopCompleted(selectedStop.id)}>
                      <MaterialIcons name="check" size={20} color="#fff" />
                      <Text style={styles.markCompletedText}>Mark as Completed</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
      
      {/* Incident Report Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={incidentModalVisible}
        onRequestClose={() => setIncidentModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIncidentModalVisible(false)}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContainer}>
            <TouchableOpacity 
              activeOpacity={1} 
              style={styles.modalContent}
              onPress={e => e.stopPropagation()}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Report Incident</Text>
                <TouchableOpacity onPress={() => setIncidentModalVisible(false)}>
                  <MaterialIcons name="close" size={24} color="#2c3e50" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.incidentForm}>
                <Text style={styles.incidentFormLabel}>Incident Type</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={incidentType}
                    onValueChange={(itemValue) => setIncidentType(itemValue)}
                    style={styles.picker}>
                    <Picker.Item label="Delay" value="delay" />
                    <Picker.Item label="Mechanical" value="mechanical" />
                    <Picker.Item label="Passenger" value="passenger" />
                    <Picker.Item label="Traffic" value="traffic" />
                    <Picker.Item label="Safety" value="safety" />
                    <Picker.Item label="Other" value="other" />
                  </Picker>
                </View>
                
                <Text style={styles.incidentFormLabel}>Description</Text>
                <TextInput
                  style={styles.incidentFormInput}
                  value={incidentDescription}
                  onChangeText={setIncidentDescription}
                  placeholder="Describe the incident..."
                  multiline
                />
                
                <View style={styles.incidentFormButtons}>
                  <TouchableOpacity
                    style={styles.cancelIncidentButton}
                    onPress={() => {
                      setIncidentModalVisible(false);
                      setIncidentDescription('');
                    }}>
                    <Text style={styles.cancelIncidentButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.submitIncidentButton,
                      !incidentDescription.trim() && styles.disabledButton
                    ]}
                    onPress={submitIncident}
                    disabled={!incidentDescription.trim()}>
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.submitIncidentButtonText}>Submit</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </TouchableOpacity>
      </Modal>
      
      {/* Maintenance Log Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={maintenanceModalVisible}
        onRequestClose={() => setMaintenanceModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMaintenanceModalVisible(false)}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContainer}>
            <TouchableOpacity 
              activeOpacity={1} 
              style={styles.modalContent}
              onPress={e => e.stopPropagation()}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Log Maintenance</Text>
                <TouchableOpacity onPress={() => setMaintenanceModalVisible(false)}>
                  <MaterialIcons name="close" size={24} color="#2c3e50" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.maintenanceForm}>
                <Text style={styles.maintenanceFormLabel}>Maintenance Type</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={maintenanceType}
                    onValueChange={(itemValue) => setMaintenanceType(itemValue)}
                    style={styles.picker}>
                    <Picker.Item label="Mechanical" value="mechanical" />
                    <Picker.Item label="Electrical" value="electrical" />
                    <Picker.Item label="Cosmetic" value="cosmetic" />
                    <Picker.Item label="Safety" value="safety" />
                    <Picker.Item label="Other" value="other" />
                  </Picker>
                </View>
                
                <Text style={styles.maintenanceFormLabel}>Description</Text>
                <TextInput
                  style={styles.maintenanceFormInput}
                  value={maintenanceDescription}
                  onChangeText={setMaintenanceDescription}
                  placeholder="Describe the maintenance issue..."
                  multiline
                />
                
                <View style={styles.maintenanceFormButtons}>
                  <TouchableOpacity
                    style={styles.cancelMaintenanceButton}
                    onPress={() => {
                      setMaintenanceModalVisible(false);
                      setMaintenanceDescription('');
                    }}>
                    <Text style={styles.cancelMaintenanceButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.submitMaintenanceButton,
                      !maintenanceDescription.trim() && styles.disabledButton
                    ]}
                    onPress={submitMaintenanceLog}
                    disabled={!maintenanceDescription.trim()}>
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.submitMaintenanceButtonText}>Submit</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#2c3e50',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f6fa',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 12,
  },
  statusText: {
    fontSize: 12,
    marginLeft: 4,
    color: '#2c3e50',
  },
  profileButton: {
    padding: 4,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#4a90e2',
  },
  tabText: {
    marginTop: 4,
    fontSize: 12,
    color: '#95a5a6',
  },
  activeTabText: {
    color: '#4a90e2',
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 16,
  },
  
  // Status Tab Styles
  infoContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#2c3e50',
  },
  routeInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoItem: {
    flex: 1,
    marginRight: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
  },
  routeSelector: {
    flex: 1,
  },
  routeSelectorInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  statusSection: {
    marginTop: 8,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 8,
  },
  statusOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  activeStatusOption: {
    backgroundColor: '#4a90e2',
    borderColor: '#4a90e2',
  },
  statusOptionText: {
    fontSize: 12,
    marginLeft: 4,
    color: '#2c3e50',
  },
  activeStatusText: {
    color: '#fff',
  },
  
  // Vehicle Status Styles
  vehicleStatusContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  vehicleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  vehicleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#2c3e50',
  },
  vehicleStats: {
    marginTop: 8,
  },
  vehicleStat: {
    marginBottom: 12,
  },
  vehicleStatLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  fuelBarContainer: {
    height: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    overflow: 'hidden',
    marginVertical: 4,
  },
  fuelBar: {
    height: '100%',
    borderRadius: 6,
  },
  vehicleStatValue: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '500',
  },
  vehicleStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  // Delay Report Styles
  delayContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  delayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  delayTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#2c3e50',
  },
  delayInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  delayMinutesWrapper: {
    flex: 2,
  },
  delayLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  delayMinutesInput: {
    backgroundColor: '#f5f6fa',
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
    color: '#2c3e50',
  },
  reportButton: {
    flex: 1,
    backgroundColor: '#e74c3c',
    borderRadius: 4,
    paddingVertical: 10,
    alignItems: 'center',
    marginLeft: 10,
  },
  disabledButton: {
    backgroundColor: '#bdc3c7',
  },
  reportButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  delayReasonInput: {
    backgroundColor: '#f5f6fa',
    borderRadius: 4,
    padding: 8,
    fontSize: 14,
    color: '#2c3e50',
    height: 80,
    textAlignVertical: 'top',
  },
  
  // Action Buttons
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e74c3c',
    borderRadius: 6,
    paddingVertical: 12,
    marginRight: 8,
  },
  maintenanceButton: {
    backgroundColor: '#f39c12',
    marginRight: 0,
    marginLeft: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '500',
    marginLeft: 8,
  },
  
  // Route Tab Styles
  routeHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  routeHeaderInfo: {
    flex: 1,
  },
  routeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  routeStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  routeStatText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginLeft: 4,
  },
  changeRouteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4a90e2',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  changeRouteText: {
    color: '#fff',
    fontWeight: '500',
    marginLeft: 4,
    fontSize: 12,
  },
  
  // Route Stops
  stopsContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  stopsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  stopsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  stopsList: {
    paddingBottom: 8,
  },
  stopItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  completedStop: {
    opacity: 0.6,
  },
  nextStop: {
    backgroundColor: '#ecf0f1',
    borderRadius: 8,
    marginVertical: 4,
  },
  stopIconContainer: {
    marginRight: 12,
  },
  stopInfo: {
    flex: 1,
  },
  stopName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 2,
  },
  stopEta: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  completeStopButton: {
    backgroundColor: '#27ae60',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  completeStopText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  
  // Incidents
  incidentsContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  incidentsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  emptyIncidents: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  emptyIncidentsText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 8,
  },
  incidentsList: {
    paddingBottom: 8,
  },
  incidentItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  incidentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  incidentType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  incidentTypeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
    marginLeft: 6,
  },
  incidentId: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  incidentTimestamp: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  incidentDescription: {
    fontSize: 14,
    color: '#2c3e50',
    marginBottom: 12,
  },
  incidentStatusBar: {
    alignItems: 'flex-start',
  },
  incidentStatus: {
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  reportedStatus: {
    backgroundColor: '#f39c12',
    color: '#fff',
  },
  acknowledgedStatus: {
    backgroundColor: '#27ae60',
    color: '#fff',
  },
  
  // Maintenance Tab Styles
  maintenanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  addMaintenanceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f39c12',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  addMaintenanceText: {
    color: '#fff',
    fontWeight: '500',
    marginLeft: 4,
    fontSize: 12,
  },
  vehicleOverview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  vehicleInfoCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  vehicleInfoLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  vehicleInfoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
  },
  maintenanceLogsList: {
    paddingBottom: 8,
  },
  maintenanceLogItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  maintenanceLogHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  maintenanceLogType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  maintenanceLogTypeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
    marginLeft: 6,
  },
  maintenanceLogId: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  maintenanceLogTimestamp: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  maintenanceLogDescription: {
    fontSize: 14,
    color: '#2c3e50',
    marginBottom: 12,
  },
  maintenanceLogStatusBar: {
    alignItems: 'flex-start',
  },
  maintenanceLogStatus: {
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  completedStatus: {
    backgroundColor: '#27ae60',
    color: '#fff',
  },
  
  // Conductor Tab Styles
  passengerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  passengerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  passengerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#2c3e50',
  },
  passengerLoadSection: {
    marginTop: 8,
  },
  passengerLoadOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  loadOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  activeLoadOption: {
    backgroundColor: '#4a90e2',
    borderColor: '#4a90e2',
  },
  loadOptionText: {
    fontSize: 12,
    marginLeft: 4,
    color: '#2c3e50',
  },
  activeLoadText: {
    color: '#fff',
  },
  
  // Conductor Notes
  conductorNotesContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  conductorNotesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  conductorNotesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#2c3e50',
  },
  addNoteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4a90e2',
    borderRadius: 4,
    paddingVertical: 10,
    marginBottom: 16,
  },
  addNoteText: {
    color: '#fff',
    fontWeight: '500',
    marginLeft: 6,
  },
  conductorInputContainer: {
    marginBottom: 16,
  },
  conductorInput: {
    backgroundColor: '#f5f6fa',
    borderRadius: 4,
    padding: 12,
    fontSize: 14,
    color: '#2c3e50',
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 8,
  },
  conductorInputButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#7f8c8d',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#4a90e2',
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  emptyNotes: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  emptyNotesText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 8,
  },
  notesList: {
    paddingBottom: 8,
  },
  noteItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  noteTimestamp: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  noteLoadIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noteLoadText: {
    fontSize: 10,
    color: '#7f8c8d',
    marginLeft: 4,
  },
  noteText: {
    fontSize: 14,
    color: '#2c3e50',
  },
  
  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  
  // Route Select Modal
  routesList: {
    paddingBottom: 8,
  },
  routeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedRouteItem: {
    backgroundColor: '#ecf0f1',
    borderRadius: 8,
  },
  routeItemContent: {
    flex: 1,
  },
  routeItemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 4,
  },
  routeItemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeItemDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  routeItemDetailText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginLeft: 4,
  },
  
  // Stop Details Modal
  stopDetailsContainer: {
    padding: 8,
  },
  stopDetailsName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  stopDetailsInfo: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  stopDetailsInfoItem: {
    flex: 1,
  },
  stopDetailsInfoLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  stopDetailsInfoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
  },
  stopDetailsStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stopDetailsStatusText: {
    marginLeft: 4,
    fontWeight: '500',
  },
  markCompletedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#27ae60',
    borderRadius: 4,
    paddingVertical: 12,
  },
  markCompletedText: {
    color: '#fff',
    fontWeight: '500',
    marginLeft: 8,
  },
  
  // Incident Form
  incidentForm: {
    padding: 8,
  },
  incidentFormLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 16,
  },
  picker: {
    height: 50,
  },
  incidentFormInput: {
    backgroundColor: '#f5f6fa',
    borderRadius: 4,
    padding: 12,
    fontSize: 14,
    color: '#2c3e50',
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  incidentFormButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelIncidentButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
  },
  cancelIncidentButtonText: {
    color: '#7f8c8d',
    fontWeight: '500',
  },
  submitIncidentButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  submitIncidentButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  
  // Maintenance Form
  maintenanceForm: {
    padding: 8,
  },
  maintenanceFormLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 8,
  },
  maintenanceFormInput: {
    backgroundColor: '#f5f6fa',
    borderRadius: 4,
    padding: 12,
    fontSize: 14,
    color: '#2c3e50',
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  maintenanceFormButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelMaintenanceButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
  },
  cancelMaintenanceButtonText: {
    color: '#7f8c8d',
    fontWeight: '500',
  },
  submitMaintenanceButton: {
    backgroundColor: '#f39c12',
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  submitMaintenanceButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
});

export default DriverDashboard;