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
  KeyboardAvoidingView,
  Image,
} from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons, FontAwesome, MaterialCommunityIcons, AntDesign, Entypo } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const AdminDashboard = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('routes');
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // Routes management state
  const [routes, setRoutes] = useState([
    { 
      id: '1', 
      name: 'Route 42', 
      stops: 7, 
      estimatedDuration: '120 min',
      status: 'active',
      avgPassengerLoad: '65%',
      buses: ['BUS-1234', 'BUS-5678'],
      avgDelay: '4 min'
    },
    { 
      id: '2', 
      name: 'Express Line 8', 
      stops: 5, 
      estimatedDuration: '90 min',
      status: 'active',
      avgPassengerLoad: '78%',
      buses: ['BUS-8923', 'BUS-3471'],
      avgDelay: '2 min'
    },
    { 
      id: '3', 
      name: 'Downtown Loop', 
      stops: 10, 
      estimatedDuration: '150 min',
      status: 'active',
      avgPassengerLoad: '51%',
      buses: ['BUS-2981', 'BUS-7612', 'BUS-5490'],
      avgDelay: '8 min'
    },
    { 
      id: '4', 
      name: 'Airport Shuttle', 
      stops: 4, 
      estimatedDuration: '60 min',
      status: 'active',
      avgPassengerLoad: '82%',
      buses: ['BUS-7732', 'BUS-1098'],
      avgDelay: '3 min'
    },
    { 
      id: '5', 
      name: 'Cross-town Line', 
      stops: 8, 
      estimatedDuration: '135 min',
      status: 'active',
      avgPassengerLoad: '44%',
      buses: ['BUS-9981', 'BUS-5476'],
      avgDelay: '5 min'
    },
  ]);

  // Fleet management state
  const [buses, setBuses] = useState([
    { 
      id: 'BUS-1234', 
      model: 'Electric Transit XL', 
      capacity: 48, 
      status: 'in-service',
      driver: 'John Smith',
      route: 'Route 42',
      lastMaintenance: '2025-04-10',
      nextMaintenance: '2025-05-15',
      fuelLevel: 72,
      mileage: 24567,
      issues: 0
    },
    { 
      id: 'BUS-5678', 
      model: 'Electric Transit XL', 
      capacity: 48, 
      status: 'in-service',
      driver: 'Maria Rodriguez',
      route: 'Route 42',
      lastMaintenance: '2025-04-12',
      nextMaintenance: '2025-05-17',
      fuelLevel: 84,
      mileage: 18923,
      issues: 0
    },
    { 
      id: 'BUS-8923', 
      model: 'Hybrid City Express', 
      capacity: 36, 
      status: 'in-service',
      driver: 'David Johnson',
      route: 'Express Line 8',
      lastMaintenance: '2025-04-05',
      nextMaintenance: '2025-05-05',
      fuelLevel: 56,
      mileage: 32145,
      issues: 1
    },
    { 
      id: 'BUS-3471', 
      model: 'Hybrid City Express', 
      capacity: 36, 
      status: 'in-service',
      driver: 'Sarah Williams',
      route: 'Express Line 8',
      lastMaintenance: '2025-04-08',
      nextMaintenance: '2025-05-08',
      fuelLevel: 61,
      mileage: 29876,
      issues: 0
    },
    { 
      id: 'BUS-2981', 
      model: 'Metro Commuter Plus', 
      capacity: 52, 
      status: 'in-service',
      driver: 'Michael Brown',
      route: 'Downtown Loop',
      lastMaintenance: '2025-04-15',
      nextMaintenance: '2025-05-20',
      fuelLevel: 92,
      mileage: 15632,
      issues: 0
    },
    { 
      id: 'BUS-7612', 
      model: 'Metro Commuter Plus', 
      capacity: 52, 
      status: 'in-service',
      driver: 'Emma Davis',
      route: 'Downtown Loop',
      lastMaintenance: '2025-04-18',
      nextMaintenance: '2025-05-23',
      fuelLevel: 89,
      mileage: 12789,
      issues: 0
    },
    { 
      id: 'BUS-5490', 
      model: 'Metro Commuter Plus', 
      capacity: 52, 
      status: 'maintenance',
      driver: 'Unassigned',
      route: 'Downtown Loop',
      lastMaintenance: '2025-04-23',
      nextMaintenance: '2025-05-28',
      fuelLevel: 45,
      mileage: 28934,
      issues: 2
    },
    { 
      id: 'BUS-9981', 
      model: 'Electric Transit XL', 
      capacity: 48, 
      status: 'in-service',
      driver: 'James Wilson',
      route: 'Cross-town Line',
      lastMaintenance: '2025-04-20',
      nextMaintenance: '2025-05-25',
      fuelLevel: 58,
      mileage: 22341,
      issues: 1
    },
    { 
      id: 'BUS-5476', 
      model: 'Electric Transit XL', 
      capacity: 48, 
      status: 'out-of-service',
      driver: 'Unassigned',
      route: 'Cross-town Line',
      lastMaintenance: '2025-03-27',
      nextMaintenance: '2025-04-25',
      fuelLevel: 12,
      mileage: 41237,
      issues: 3
    },
  ]);

  // Incident management state
  const [incidents, setIncidents] = useState([
    {
      id: 'INC-278931',
      busId: 'BUS-1234',
      route: 'Route 42',
      driver: 'John Smith',
      type: 'delay',
      timestamp: '2025-04-24 08:32 AM',
      description: 'Heavy traffic due to construction on Main St',
      status: 'acknowledged',
      severity: 'medium'
    },
    {
      id: 'INC-278945',
      busId: 'BUS-8923',
      route: 'Express Line 8',
      driver: 'David Johnson',
      type: 'mechanical',
      timestamp: '2025-04-24 09:15 AM',
      description: 'Warning light for engine temperature',
      status: 'in-progress',
      severity: 'medium'
    },
    {
      id: 'INC-278952',
      busId: 'BUS-9981',
      route: 'Cross-town Line',
      driver: 'James Wilson',
      type: 'passenger',
      timestamp: '2025-04-24 10:03 AM',
      description: 'Medical emergency, passenger requiring assistance',
      status: 'resolved',
      severity: 'high'
    },
    {
      id: 'INC-278967',
      busId: 'BUS-5476',
      route: 'Cross-town Line',
      driver: 'Kevin Taylor',
      type: 'mechanical',
      timestamp: '2025-04-23 04:17 PM',
      description: 'Complete brake system failure, bus towed to depot',
      status: 'resolved',
      severity: 'critical'
    },
    {
      id: 'INC-278921',
      busId: 'BUS-5490',
      route: 'Downtown Loop',
      driver: 'Thomas Lee',
      type: 'mechanical',
      timestamp: '2025-04-23 02:45 PM',
      description: 'Door mechanism failure, unable to close properly',
      status: 'in-progress',
      severity: 'high'
    },
  ]);

  // Analytics state
  const [selectedAnalyticsPeriod, setSelectedAnalyticsPeriod] = useState('week');
  const [selectedAnalyticsType, setSelectedAnalyticsType] = useState('passenger');
  
  // Analysis data
  const [passengerData, setPassengerData] = useState({
    day: {
      labels: ["6AM", "9AM", "12PM", "3PM", "6PM", "9PM"],
      datasets: [{ data: [25, 45, 28, 38, 68, 22] }]
    },
    week: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [{ data: [42, 45, 47, 44, 52, 32, 28] }]
    },
    month: {
      labels: ["W1", "W2", "W3", "W4"],
      datasets: [{ data: [41, 43, 45, 46] }]
    }
  });

  const [delayData, setDelayData] = useState({
    day: {
      labels: ["6AM", "9AM", "12PM", "3PM", "6PM", "9PM"],
      datasets: [{ data: [3, 8, 4, 5, 10, 2] }]
    },
    week: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [{ data: [4, 5, 7, 6, 9, 3, 2] }]
    },
    month: {
      labels: ["W1", "W2", "W3", "W4"],
      datasets: [{ data: [5, 5.5, 6, 7] }]
    }
  });

  const [fuelData, setFuelData] = useState({
    day: {
      labels: ["6AM", "9AM", "12PM", "3PM", "6PM", "9PM"],
      datasets: [{ data: [90, 82, 75, 65, 58, 50] }]
    },
    week: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [{ data: [90, 75, 60, 85, 70, 55, 40] }]
    },
    month: {
      labels: ["W1", "W2", "W3", "W4"],
      datasets: [{ data: [85, 70, 55, 40] }]
    }
  });

  // Modal states
  const [routeModalVisible, setRouteModalVisible] = useState(false);
  const [busModalVisible, setBusModalVisible] = useState(false);
  const [incidentModalVisible, setIncidentModalVisible] = useState(false);
  const [busDetailsModalVisible, setBusDetailsModalVisible] = useState(false);
  const [routeDetailsModalVisible, setRouteDetailsModalVisible] = useState(false);
  const [incidentDetailsModalVisible, setIncidentDetailsModalVisible] = useState(false);
  const [optimizeScheduleModalVisible, setOptimizeScheduleModalVisible] = useState(false);
  
  // Selected item states
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedIncident, setSelectedIncident] = useState(null);
  
  // Form states
  const [newRoute, setNewRoute] = useState({
    name: '',
    stops: '',
    estimatedDuration: '',
  });
  const [newBus, setNewBus] = useState({
    id: '',
    model: '',
    capacity: '',
    status: 'in-service',
  });
  const [scheduleOptimizationRoute, setScheduleOptimizationRoute] = useState('1');
  const [scheduleOptimizationPriority, setScheduleOptimizationPriority] = useState('balanced');

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const fetchData = () => {
    setRefreshing(true);
    // In a real app, we would fetch data from API here
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const onRefresh = () => {
    fetchData();
  };

  const addNewRoute = () => {
    if (!newRoute.name || !newRoute.stops || !newRoute.estimatedDuration) {
      Alert.alert('Required Fields', 'Please fill in all route details');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const newRouteData = {
        id: `${routes.length + 1}`,
        name: newRoute.name,
        stops: parseInt(newRoute.stops),
        estimatedDuration: `${newRoute.estimatedDuration} min`,
        status: 'active',
        avgPassengerLoad: '0%',
        buses: [],
        avgDelay: '0 min'
      };
      setRoutes([...routes, newRouteData]);
      setNewRoute({ name: '', stops: '', estimatedDuration: '' });
      setRouteModalVisible(false);
      setIsLoading(false);
      Alert.alert('Route Added', `${newRoute.name} has been added to the system.`);
    }, 800);
  };

  const addNewBus = () => {
    if (!newBus.id || !newBus.model || !newBus.capacity) {
      Alert.alert('Required Fields', 'Please fill in all bus details');
      return;
    }

    if (buses.some(bus => bus.id === newBus.id)) {
      Alert.alert('Error', 'A bus with this ID already exists');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const currentDate = new Date();
      const nextMaintenanceDate = new Date();
      nextMaintenanceDate.setMonth(currentDate.getMonth() + 1);
      
      const newBusData = {
        id: newBus.id,
        model: newBus.model,
        capacity: parseInt(newBus.capacity),
        status: newBus.status,
        driver: 'Unassigned',
        route: 'Unassigned',
        lastMaintenance: currentDate.toISOString().split('T')[0],
        nextMaintenance: nextMaintenanceDate.toISOString().split('T')[0],
        fuelLevel: 100,
        mileage: 0,
        issues: 0
      };
      setBuses([...buses, newBusData]);
      setNewBus({ id: '', model: '', capacity: '', status: 'in-service' });
      setBusModalVisible(false);
      setIsLoading(false);
      Alert.alert('Bus Added', `${newBus.id} has been added to the fleet.`);
    }, 800);
  };

  const deleteBus = (busId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to remove this bus from the system?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setIsLoading(true);
            setTimeout(() => {
              setBuses(buses.filter(bus => bus.id !== busId));
              setBusDetailsModalVisible(false);
              setIsLoading(false);
              Alert.alert('Bus Removed', `Bus ${busId} has been removed from the system.`);
            }, 800);
          }
        }
      ]
    );
  };

  const deleteRoute = (routeId) => {
    // Check if buses are assigned to this route
    const busesOnRoute = buses.filter(bus => routes.find(r => r.id === routeId)?.name === bus.route);
    
    if (busesOnRoute.length > 0) {
      Alert.alert(
        'Warning',
        `This route has ${busesOnRoute.length} buses assigned to it. Reassign buses before deleting.`,
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to remove this route from the system?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setIsLoading(true);
            setTimeout(() => {
              setRoutes(routes.filter(route => route.id !== routeId));
              setRouteDetailsModalVisible(false);
              setIsLoading(false);
              Alert.alert('Route Removed', `Route has been removed from the system.`);
            }, 800);
          }
        }
      ]
    );
  };

  const updateBusStatus = (busId, newStatus) => {
    setIsLoading(true);
    setTimeout(() => {
      const updatedBuses = buses.map(bus => {
        if (bus.id === busId) {
          return { ...bus, status: newStatus };
        }
        return bus;
      });
      setBuses(updatedBuses);
      setIsLoading(false);
      Alert.alert('Status Updated', `Bus ${busId} status updated to ${newStatus}`);
    }, 800);
  };

  const updateIncidentStatus = (incidentId, newStatus) => {
    setIsLoading(true);
    setTimeout(() => {
      const updatedIncidents = incidents.map(incident => {
        if (incident.id === incidentId) {
          return { ...incident, status: newStatus };
        }
        return incident;
      });
      setIncidents(updatedIncidents);
      setIsLoading(false);
      Alert.alert('Status Updated', `Incident ${incidentId} status updated to ${newStatus}`);
    }, 800);
  };

  const optimizeSchedule = () => {
    setIsLoading(true);
    setTimeout(() => {
      const selectedRouteData = routes.find(route => route.id === scheduleOptimizationRoute);
      
      // In a real app, this would run an optimization algorithm based on historical data
      Alert.alert(
        'Schedule Optimized',
        `${selectedRouteData.name} schedule has been optimized with ${scheduleOptimizationPriority} priority. New schedules have been sent to drivers.`,
      );
      
      setOptimizeScheduleModalVisible(false);
      setIsLoading(false);
    }, 1500);
  };

  const renderAnalyticsData = () => {
    switch(selectedAnalyticsType) {
      case 'passenger':
        return passengerData[selectedAnalyticsPeriod];
      case 'delay':
        return delayData[selectedAnalyticsPeriod];
      case 'fuel':
        return fuelData[selectedAnalyticsPeriod];
      default:
        return passengerData[selectedAnalyticsPeriod];
    }
  };

  const getAnalyticsTitle = () => {
    switch(selectedAnalyticsType) {
      case 'passenger':
        return 'Average Passenger Load (%)';
      case 'delay':
        return 'Average Delays (minutes)';
      case 'fuel':
        return 'Average Fuel Level (%)';
      default:
        return 'System Analytics';
    }
  };

  const getBusStatusColor = (status) => {
    switch(status) {
      case 'in-service':
        return '#27ae60';
      case 'maintenance':
        return '#f39c12';
      case 'out-of-service':
        return '#e74c3c';
      default:
        return '#95a5a6';
    }
  };

  const getIncidentSeverityColor = (severity) => {
    switch(severity) {
      case 'low':
        return '#3498db';
      case 'medium':
        return '#f39c12';
      case 'high':
        return '#e74c3c';
      case 'critical':
        return '#c0392b';
      default:
        return '#95a5a6';
    }
  };

  const getIncidentStatusColor = (status) => {
    switch(status) {
      case 'acknowledged':
        return '#3498db';
      case 'in-progress':
        return '#f39c12';
      case 'resolved':
        return '#27ae60';
      default:
        return '#95a5a6';
    }
  };

  const getBusCountByStatus = (status) => {
    return buses.filter(bus => bus.status === status).length;
  };

  const getRouteById = (routeId) => {
    return routes.find(route => route.id === routeId) || { name: 'Unknown' };
  };

  const getIncidentCountByStatus = (status) => {
    return incidents.filter(incident => incident.status === status).length;
  };

  const getBusesForRoute = (routeName) => {
    return buses.filter(bus => bus.route === routeName);
  };

  // Render Tabs
  const renderRoutesTab = () => {
    return (
      <View style={styles.tabContent}>
        <View style={styles.tabHeader}>
          <Text style={styles.tabTitle}>Routes Management</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setRouteModalVisible(true)}
          >
            <AntDesign name="plus" size={20} color="#fff" />
            <Text style={styles.addButtonText}>Add Route</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{routes.length}</Text>
            <Text style={styles.statLabel}>Total Routes</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{routes.reduce((acc, route) => acc + route.buses.length, 0)}</Text>
            <Text style={styles.statLabel}>Assigned Buses</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{routes.reduce((acc, route) => acc + route.stops, 0)}</Text>
            <Text style={styles.statLabel}>Total Stops</Text>
          </View>
        </View>
        
        <FlatList
          data={routes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => {
                setSelectedRoute(item);
                setRouteDetailsModalVisible(true);
              }}
            >
              <View style={styles.listItemHeader}>
                <Text style={styles.listItemTitle}>{item.name}</Text>
                <View style={[styles.statusBadge, { backgroundColor: '#27ae60' }]}>
                  <Text style={styles.statusBadgeText}>{item.status}</Text>
                </View>
              </View>
              
              <View style={styles.listItemDetails}>
                <View style={styles.listItemDetail}>
                  <FontAwesome5 name="map-marker-alt" size={14} color="#4a90e2" />
                  <Text style={styles.listItemDetailText}>{item.stops} Stops</Text>
                </View>
                <View style={styles.listItemDetail}>
                  <MaterialCommunityIcons name="clock-outline" size={14} color="#f39c12" />
                  <Text style={styles.listItemDetailText}>{item.estimatedDuration}</Text>
                </View>
                <View style={styles.listItemDetail}>
                  <FontAwesome5 name="bus" size={14} color="#8e44ad" />
                  <Text style={styles.listItemDetailText}>{item.buses.length} Buses</Text>
                </View>
              </View>
              
              <View style={styles.listItemMetrics}>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>Avg Load:</Text>
                  <Text style={styles.metricValue}>{item.avgPassengerLoad}</Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>Avg Delay:</Text>
                  <Text style={styles.metricValue}>{item.avgDelay}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  };

  const renderFleetTab = () => {
    return (
      <View style={styles.tabContent}>
        <View style={styles.tabHeader}>
          <Text style={styles.tabTitle}>Fleet Management</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setBusModalVisible(true)}
          >
            <AntDesign name="plus" size={20} color="#fff" />
            <Text style={styles.addButtonText}>Add Bus</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{buses.length}</Text>
            <Text style={styles.statLabel}>Total Buses</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{getBusCountByStatus('in-service')}</Text>
            <Text style={styles.statLabel}>In Service</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{getBusCountByStatus('maintenance') + getBusCountByStatus('out-of-service')}</Text>
            <Text style={styles.statLabel}>Not Available</Text>
          </View>
        </View>
        
        {/* Filter options */}
        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Filter:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScrollView}>
            <TouchableOpacity style={[styles.filterOption, styles.activeFilterOption]}>
              <Text style={styles.activeFilterText}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterOption}>
              <Text style={styles.filterOptionText}>In Service</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterOption}>
              <Text style={styles.filterOptionText}>Maintenance</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterOption}>
              <Text style={styles.filterOptionText}>Out of Service</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
        
        <FlatList
          data={buses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => {
                setSelectedBus(item);
                setBusDetailsModalVisible(true);
              }}
            >
              <View style={styles.listItemHeader}>
                <Text style={styles.listItemTitle}>{item.id}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getBusStatusColor(item.status) }]}>
                  <Text style={styles.statusBadgeText}>{item.status}</Text>
                </View>
              </View>
              
              <View style={styles.listItemDetails}>
                <View style={styles.listItemDetail}>
                  <MaterialCommunityIcons name="bus-articulated-front" size={14} color="#4a90e2" />
                  <Text style={styles.listItemDetailText}>{item.model}</Text>
                </View>
                <View style={styles.listItemDetail}>
                  <MaterialIcons name="people" size={14} color="#f39c12" />
                  <Text style={styles.listItemDetailText}>Capacity: {item.capacity}</Text>
                </View>
                <View style={styles.listItemDetail}>
                  <FontAwesome5 name="route" size={14} color="#8e44ad" />
                  <Text style={styles.listItemDetailText}>Route: {item.route}</Text>
                </View>
              </View>
              
              <View style={styles.listItemMetrics}>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>Mileage:</Text>
                  <Text style={styles.metricValue}>{item.mileage.toLocaleString()}</Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>Fuel:</Text>
                  <Text style={styles.metricValue}>{item.fuelLevel}%</Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>Issues:</Text>
                  <Text style={[styles.metricValue, item.issues > 0 ? styles.alertText : null]}>
                    {item.issues}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  };

  const renderIncidentsTab = () => {
    return (
      <View style={styles.tabContent}>
        <View style={styles.tabHeader}>
          <Text style={styles.tabTitle}>Incidents</Text>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
          <Text style={styles.statValue}>{incidents.length}</Text>
          <Text style={styles.statLabel}>Total Incidents</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{getIncidentCountByStatus('in-progress')}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{getIncidentCountByStatus('resolved')}</Text>
          <Text style={styles.statLabel}>Resolved</Text>
        </View>
      </View>
      
      {/* Filter options */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScrollView}>
          <TouchableOpacity style={[styles.filterOption, styles.activeFilterOption]}>
            <Text style={styles.activeFilterText}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterOption}>
            <Text style={styles.filterOptionText}>Mechanical</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterOption}>
            <Text style={styles.filterOptionText}>Delays</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterOption}>
            <Text style={styles.filterOptionText}>Passenger</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      
      <FlatList
        data={incidents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => {
              setSelectedIncident(item);
              setIncidentDetailsModalVisible(true);
            }}
          >
            <View style={styles.listItemHeader}>
              <Text style={styles.listItemTitle}>{item.id}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getIncidentStatusColor(item.status) }]}>
                <Text style={styles.statusBadgeText}>{item.status}</Text>
              </View>
            </View>
            
            <View style={styles.listItemDetails}>
              <View style={styles.listItemDetail}>
                <MaterialCommunityIcons name="bus" size={14} color="#4a90e2" />
                <Text style={styles.listItemDetailText}>{item.busId}</Text>
              </View>
              <View style={styles.listItemDetail}>
                <MaterialIcons name="category" size={14} color="#f39c12" />
                <Text style={styles.listItemDetailText}>{item.type}</Text>
              </View>
              <View style={styles.listItemDetail}>
                <FontAwesome5 name="route" size={14} color="#8e44ad" />
                <Text style={styles.listItemDetailText}>{item.route}</Text>
              </View>
            </View>
            
            <View style={styles.incidentDescription}>
              <Text numberOfLines={2} style={styles.incidentDescriptionText}>
                {item.description}
              </Text>
            </View>
            
            <View style={styles.incidentFooter}>
              <Text style={styles.incidentTimestamp}>{item.timestamp}</Text>
              <View 
                style={[
                  styles.severityIndicator, 
                  { backgroundColor: getIncidentSeverityColor(item.severity) }
                ]}
              >
                <Text style={styles.severityText}>{item.severity}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const renderAnalyticsTab = () => {
  return (
    <View style={styles.tabContent}>
      <View style={styles.tabHeader}>
        <Text style={styles.tabTitle}>System Analytics</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setOptimizeScheduleModalVisible(true)}
        >
          <FontAwesome5 name="magic" size={18} color="#fff" />
          <Text style={styles.addButtonText}>Optimize Schedule</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.analyticsFilterContainer}>
        <View style={styles.analyticsTypeContainer}>
          <Text style={styles.filterLabel}>Data Type:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScrollView}>
            <TouchableOpacity 
              style={[
                styles.filterOption, 
                selectedAnalyticsType === 'passenger' ? styles.activeFilterOption : null
              ]}
              onPress={() => setSelectedAnalyticsType('passenger')}
            >
              <Text 
                style={selectedAnalyticsType === 'passenger' ? styles.activeFilterText : styles.filterOptionText}
              >
                Passenger Load
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.filterOption, 
                selectedAnalyticsType === 'delay' ? styles.activeFilterOption : null
              ]}
              onPress={() => setSelectedAnalyticsType('delay')}
            >
              <Text 
                style={selectedAnalyticsType === 'delay' ? styles.activeFilterText : styles.filterOptionText}
              >
                Delays
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.filterOption, 
                selectedAnalyticsType === 'fuel' ? styles.activeFilterOption : null
              ]}
              onPress={() => setSelectedAnalyticsType('fuel')}
            >
              <Text 
                style={selectedAnalyticsType === 'fuel' ? styles.activeFilterText : styles.filterOptionText}
              >
                Fuel Efficiency
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
        
        <View style={styles.analyticsPeriodContainer}>
          <Text style={styles.filterLabel}>Time Period:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScrollView}>
            <TouchableOpacity 
              style={[
                styles.filterOption, 
                selectedAnalyticsPeriod === 'day' ? styles.activeFilterOption : null
              ]}
              onPress={() => setSelectedAnalyticsPeriod('day')}
            >
              <Text 
                style={selectedAnalyticsPeriod === 'day' ? styles.activeFilterText : styles.filterOptionText}
              >
                Today
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.filterOption, 
                selectedAnalyticsPeriod === 'week' ? styles.activeFilterOption : null
              ]}
              onPress={() => setSelectedAnalyticsPeriod('week')}
            >
              <Text 
                style={selectedAnalyticsPeriod === 'week' ? styles.activeFilterText : styles.filterOptionText}
              >
                Last Week
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.filterOption, 
                selectedAnalyticsPeriod === 'month' ? styles.activeFilterOption : null
              ]}
              onPress={() => setSelectedAnalyticsPeriod('month')}
            >
              <Text 
                style={selectedAnalyticsPeriod === 'month' ? styles.activeFilterText : styles.filterOptionText}
              >
                Last Month
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
      
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>{getAnalyticsTitle()}</Text>
        <LineChart
          data={renderAnalyticsData()}
          width={Dimensions.get('window').width - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#1e2923',
            backgroundGradientFrom: '#4a90e2',
            backgroundGradientTo: '#3498db',
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#ffa726'
            }
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16
          }}
        />
      </View>

      <View style={styles.statsGridContainer}>
        <Text style={styles.sectionTitle}>System Performance</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statsGridItem}>
            <Text style={styles.statsGridValue}>96.8%</Text>
            <Text style={styles.statsGridLabel}>On-Time Rate</Text>
          </View>
          <View style={styles.statsGridItem}>
            <Text style={styles.statsGridValue}>93.2%</Text>
            <Text style={styles.statsGridLabel}>Fleet Availability</Text>
          </View>
          <View style={styles.statsGridItem}>
            <Text style={styles.statsGridValue}>12,845</Text>
            <Text style={styles.statsGridLabel}>Daily Passengers</Text>
          </View>
          <View style={styles.statsGridItem}>
            <Text style={styles.statsGridValue}>4.7</Text>
            <Text style={styles.statsGridLabel}>Customer Rating</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.performanceContainer}>
        <Text style={styles.sectionTitle}>Route Performance</Text>
        <FlatList
          data={routes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.performanceItem}>
              <View style={styles.performanceItemHeader}>
                <Text style={styles.performanceItemTitle}>{item.name}</Text>
                <Text style={styles.performanceItemValue}>{item.avgPassengerLoad}</Text>
              </View>
              <View style={styles.performanceBar}>
                <View 
                  style={[
                    styles.performanceBarFill, 
                    { width: item.avgPassengerLoad }
                  ]} 
                />
              </View>
            </View>
          )}
          contentContainerStyle={styles.performanceList}
          scrollEnabled={false}
        />
      </View>
    </View>
  );
};

// Route Details Modal
const RouteDetailsModal = () => {
  if (!selectedRoute) return null;
  
  const routeBuses = getBusesForRoute(selectedRoute.name);
  
  return (
    <Modal
      visible={routeDetailsModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setRouteDetailsModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{selectedRoute.name}</Text>
            <TouchableOpacity onPress={() => setRouteDetailsModalVisible(false)}>
              <AntDesign name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalScrollContent}>
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Route Information</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Status:</Text>
                <View style={[styles.statusBadge, { backgroundColor: '#27ae60' }]}>
                  <Text style={styles.statusBadgeText}>{selectedRoute.status}</Text>
                </View>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Number of Stops:</Text>
                <Text style={styles.detailValue}>{selectedRoute.stops}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Estimated Duration:</Text>
                <Text style={styles.detailValue}>{selectedRoute.estimatedDuration}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Average Passenger Load:</Text>
                <Text style={styles.detailValue}>{selectedRoute.avgPassengerLoad}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Average Delay:</Text>
                <Text style={styles.detailValue}>{selectedRoute.avgDelay}</Text>
              </View>
            </View>
            
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Assigned Buses</Text>
              {routeBuses.length > 0 ? (
                routeBuses.map((bus) => (
                  <View key={bus.id} style={styles.assignedBusItem}>
                    <View style={styles.assignedBusHeader}>
                      <Text style={styles.assignedBusId}>{bus.id}</Text>
                      <View 
                        style={[
                          styles.statusBadge, 
                          { backgroundColor: getBusStatusColor(bus.status) }
                        ]}
                      >
                        <Text style={styles.statusBadgeText}>{bus.status}</Text>
                      </View>
                    </View>
                    <Text style={styles.assignedBusDetails}>
                      {bus.model} | Driver: {bus.driver}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noDataText}>No buses assigned to this route</Text>
              )}
            </View>
          </ScrollView>
          
          <View style={styles.modalActions}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.deleteButton]}
              onPress={() => deleteRoute(selectedRoute.id)}
            >
              <Text style={styles.deleteButtonText}>Delete Route</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButton, styles.primaryButton]}
              onPress={() => {
                setRouteDetailsModalVisible(false);
                setScheduleOptimizationRoute(selectedRoute.id);
                setOptimizeScheduleModalVisible(true);
              }}
            >
              <Text style={styles.primaryButtonText}>Optimize Schedule</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Bus Details Modal
const BusDetailsModal = () => {
  if (!selectedBus) return null;
  
  return (
    <Modal
      visible={busDetailsModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setBusDetailsModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{selectedBus.id}</Text>
            <TouchableOpacity onPress={() => setBusDetailsModalVisible(false)}>
              <AntDesign name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalScrollContent}>
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Bus Information</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Status:</Text>
                <View 
                  style={[
                    styles.statusBadge, 
                    { backgroundColor: getBusStatusColor(selectedBus.status) }
                  ]}
                >
                  <Text style={styles.statusBadgeText}>{selectedBus.status}</Text>
                </View>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Model:</Text>
                <Text style={styles.detailValue}>{selectedBus.model}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Capacity:</Text>
                <Text style={styles.detailValue}>{selectedBus.capacity} passengers</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Driver:</Text>
                <Text style={styles.detailValue}>{selectedBus.driver}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Assigned Route:</Text>
                <Text style={styles.detailValue}>{selectedBus.route}</Text>
              </View>
            </View>
            
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Maintenance Information</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Last Maintenance:</Text>
                <Text style={styles.detailValue}>{selectedBus.lastMaintenance}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Next Maintenance:</Text>
                <Text style={styles.detailValue}>{selectedBus.nextMaintenance}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Mileage:</Text>
                <Text style={styles.detailValue}>{selectedBus.mileage.toLocaleString()} miles</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Fuel Level:</Text>
                <Text style={styles.detailValue}>{selectedBus.fuelLevel}%</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Issues:</Text>
                <Text style={[styles.detailValue, selectedBus.issues > 0 ? styles.alertText : null]}>
                  {selectedBus.issues}
                </Text>
              </View>
            </View>
            
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Recent Incidents</Text>
              {incidents.filter(incident => incident.busId === selectedBus.id).length > 0 ? (
                incidents
                  .filter(incident => incident.busId === selectedBus.id)
                  .map((incident) => (
                    <View key={incident.id} style={styles.incidentItem}>
                      <View style={styles.incidentItemHeader}>
                        <Text style={styles.incidentItemId}>{incident.id}</Text>
                        <View 
                          style={[
                            styles.statusBadge, 
                            { backgroundColor: getIncidentStatusColor(incident.status) }
                          ]}
                        >
                          <Text style={styles.statusBadgeText}>{incident.status}</Text>
                        </View>
                      </View>
                      <Text style={styles.incidentItemDescription}>{incident.description}</Text>
                      <Text style={styles.incidentItemTimestamp}>{incident.timestamp}</Text>
                    </View>
                  ))
              ) : (
                <Text style={styles.noDataText}>No recent incidents</Text>
              )}
            </View>
          </ScrollView>
          
          <View style={styles.modalActions}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.deleteButton]}
              onPress={() => deleteBus(selectedBus.id)}
            >
              <Text style={styles.deleteButtonText}>Remove Bus</Text>
            </TouchableOpacity>
            {selectedBus.status !== 'maintenance' ? (
              <TouchableOpacity 
                style={[styles.modalButton, styles.maintenanceButton]}
                onPress={() => {
                  updateBusStatus(selectedBus.id, 'maintenance');
                  setBusDetailsModalVisible(false);
                }}
              >
                <Text style={styles.maintenanceButtonText}>Schedule Maintenance</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={[styles.modalButton, styles.primaryButton]}
                onPress={() => {
                  updateBusStatus(selectedBus.id, 'in-service');
                  setBusDetailsModalVisible(false);
                }}
              >
                <Text style={styles.primaryButtonText}>Return to Service</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Incident Details Modal
const IncidentDetailsModal = () => {
  if (!selectedIncident) return null;
  
  return (
    <Modal
      visible={incidentDetailsModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setIncidentDetailsModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{selectedIncident.id}</Text>
            <TouchableOpacity onPress={() => setIncidentDetailsModalVisible(false)}>
              <AntDesign name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalScrollContent}>
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Incident Information</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Status:</Text>
                <View 
                  style={[
                    styles.statusBadge, 
                    { backgroundColor: getIncidentStatusColor(selectedIncident.status) }
                  ]}
                >
                  <Text style={styles.statusBadgeText}>{selectedIncident.status}</Text>
                </View>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Severity:</Text>
                <View 
                  style={[
                    styles.statusBadge, 
                    { backgroundColor: getIncidentSeverityColor(selectedIncident.severity) }
                  ]}
                >
                  <Text style={styles.statusBadgeText}>{selectedIncident.severity}</Text>
                </View>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Type:</Text>
                <Text style={styles.detailValue}>{selectedIncident.type}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Bus ID:</Text>
                <Text style={styles.detailValue}>{selectedIncident.busId}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Route:</Text>
                <Text style={styles.detailValue}>{selectedIncident.route}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Driver:</Text>
                <Text style={styles.detailValue}>{selectedIncident.driver}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Timestamp:</Text>
                <Text style={styles.detailValue}>{selectedIncident.timestamp}</Text>
              </View>
            </View>
            
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Description</Text>
              <Text style={styles.fullDescription}>{selectedIncident.description}</Text>
            </View>
          </ScrollView>
          
          <View style={styles.modalActions}>
            {selectedIncident.status !== 'resolved' ? (
              <>
                <TouchableOpacity 
                  style={[styles.modalButton, selectedIncident.status === 'in-progress' ? styles.secondaryButton : styles.primaryButton]}
                  onPress={() => {
                    updateIncidentStatus(selectedIncident.id, selectedIncident.status === 'acknowledged' ? 'in-progress' : 'resolved');
                    setIncidentDetailsModalVisible(false);
                  }}
                >
                  <Text style={selectedIncident.status === 'in-progress' ? styles.secondaryButtonText : styles.primaryButtonText}>
                    {selectedIncident.status === 'acknowledged' ? 'Mark In Progress' : 'Mark Resolved'}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity 
                style={[styles.modalButton, styles.primaryButton]}
                onPress={() => setIncidentDetailsModalVisible(false)}
              >
                <Text style={styles.primaryButtonText}>Close</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Add Route Modal
const AddRouteModal = () => {
  return (
    <Modal
      visible={routeModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setRouteModalVisible(false)}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New Route</Text>
            <TouchableOpacity onPress={() => setRouteModalVisible(false)}>
              <AntDesign name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalScrollContent}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Route Name</Text>
              <TextInput
                style={styles.input}
                value={newRoute.name}
                onChangeText={(text) => setNewRoute({...newRoute, name: text})}
                placeholder="Enter route name"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Number of Stops</Text>
              <TextInput
                style={styles.input}
                value={newRoute.stops}
                onChangeText={(text) => setNewRoute({...newRoute, stops: text})}
                placeholder="Enter number of stops"
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Estimated Duration (minutes)</Text>
              <TextInput
                style={styles.input}
                value={newRoute.estimatedDuration}
                onChangeText={(text) => setNewRoute({...newRoute, estimatedDuration: text})}
                placeholder="Enter estimated duration"
                keyboardType="numeric"
              />
            </View>
          </ScrollView>
          
          <View style={styles.modalActions}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setRouteModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButton, styles.primaryButton]}
              onPress={addNewRoute}
            >
              <Text style={styles.primaryButtonText}>Add Route</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// Add Bus Modal
const AddBusModal = () => {
  return (
    <Modal
      visible={busModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setBusModalVisible(false)}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New Bus</Text>
            <TouchableOpacity onPress={() => setBusModalVisible(false)}>
              <AntDesign name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalScrollContent}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Bus ID</Text>
              <TextInput
                style={styles.input}
                value={newBus.id}
                onChangeText={(text) => setNewBus({...newBus, id: text.toUpperCase()})}
                placeholder="Enter bus ID (e.g., BUS-1234)"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Bus Model</Text>
              <TextInput
                style={styles.input}
                value={newBus.model}
                onChangeText={(text) => setNewBus({...newBus, model: text})}
                placeholder="Enter bus model"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Passenger Capacity</Text>
              <TextInput
                style={styles.input}
                value={newBus.capacity}
                onChangeText={(text) => setNewBus({...newBus, capacity: text})}
                placeholder="Enter passenger capacity"
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Initial Status</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={newBus.status}
                  onValueChange={(itemValue) => setNewBus({...newBus, status: itemValue})}
                  style={styles.picker}
                >
                  <Picker.Item label="In Service" value="in-service" />
                  <Picker.Item label="Maintenance" value="maintenance" />
                  <Picker.Item label="Out of Service" value="out-of-service" />
                </Picker>
              </View>
            </View>
          </ScrollView>
          
          <View style={styles.modalActions}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setBusModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButton, styles.primaryButton]}
              onPress={addNewBus}
            >
              <Text style={styles.primaryButtonText}>Add Bus</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// Optimize Schedule Modal
const OptimizeScheduleModal = () => {
  return (
    <Modal
      visible={optimizeScheduleModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setOptimizeScheduleModalVisible(false)}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
<View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Optimize Schedule</Text>
            <TouchableOpacity onPress={() => setOptimizeScheduleModalVisible(false)}>
              <AntDesign name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalScrollContent}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Select Route</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={scheduleOptimizationRoute}
                  onValueChange={(itemValue) => setScheduleOptimizationRoute(itemValue)}
                  style={styles.picker}
                >
                  {routes.map(route => (
                    <Picker.Item 
                      key={route.id} 
                      label={route.name} 
                      value={route.id} 
                    />
                  ))}
                </Picker>
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Optimization Priority</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={scheduleOptimizationPriority}
                  onValueChange={(itemValue) => setScheduleOptimizationPriority(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Balanced (Time & Capacity)" value="balanced" />
                  <Picker.Item label="Minimize Delays" value="time" />
                  <Picker.Item label="Maximize Capacity" value="capacity" />
                  <Picker.Item label="Minimize Fuel Usage" value="fuel" />
                </Picker>
              </View>
            </View>
            
            <View style={styles.optimizationInfo}>
              <MaterialIcons name="info-outline" size={24} color="#4a90e2" style={styles.infoIcon} />
              <Text style={styles.optimizationInfoText}>
                Schedule optimization uses historical traffic data, passenger loads, and current road conditions to create the most efficient schedule based on your selected priority.
              </Text>
            </View>
          </ScrollView>
          
          <View style={styles.modalActions}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setOptimizeScheduleModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButton, styles.primaryButton]}
              onPress={optimizeSchedule}
            >
              <Text style={styles.primaryButtonText}>Optimize</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

return (
  <SafeAreaView style={styles.container}>
    {isLoading && (
      <View style={styles.loadingOverlay}>
        <ActivityIndicator size="large" color="#4a90e2" />
        <Text style={styles.loadingText}>Processing...</Text>
      </View>
    )}
    
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <MaterialIcons name="menu" size={28} color="#fff" />
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
      </View>
      <View style={styles.headerRight}>
        <TouchableOpacity style={styles.headerIconButton}>
          <MaterialIcons name="notifications" size={24} color="#fff" />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>3</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerIconButton}>
          <MaterialIcons name="account-circle" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
    
    <ScrollView 
      style={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    >
      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <View style={styles.summaryIconContainer}>
            <MaterialCommunityIcons name="bus" size={24} color="#4a90e2" />
          </View>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryValue}>{buses.length}</Text>
            <Text style={styles.summaryLabel}>Total Buses</Text>
          </View>
        </View>
        
        <View style={styles.summaryItem}>
          <View style={styles.summaryIconContainer}>
            <FontAwesome5 name="route" size={24} color="#27ae60" />
          </View>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryValue}>{routes.length}</Text>
            <Text style={styles.summaryLabel}>Active Routes</Text>
          </View>
        </View>
        
        <View style={styles.summaryItem}>
          <View style={styles.summaryIconContainer}>
            <MaterialIcons name="warning" size={24} color="#e74c3c" />
          </View>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryValue}>{incidents.filter(i => i.status !== 'resolved').length}</Text>
            <Text style={styles.summaryLabel}>Active Incidents</Text>
          </View>
        </View>
      </View>
      
      {activeTab === 'routes' && renderRoutesTab()}
      {activeTab === 'fleet' && renderFleetTab()}
      {activeTab === 'incidents' && renderIncidentsTab()}
      {activeTab === 'analytics' && renderAnalyticsTab()}
    </ScrollView>
    
    <View style={styles.footer}>
      <TouchableOpacity 
        style={[styles.footerTab, activeTab === 'routes' ? styles.activeFooterTab : null]}
        onPress={() => setActiveTab('routes')}
      >
        <FontAwesome5 
          name="route" 
          size={20} 
          color={activeTab === 'routes' ? '#4a90e2' : '#95a5a6'} 
        />
        <Text 
          style={[
            styles.footerTabText, 
            activeTab === 'routes' ? styles.activeFooterTabText : null
          ]}
        >
          Routes
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.footerTab, activeTab === 'fleet' ? styles.activeFooterTab : null]}
        onPress={() => setActiveTab('fleet')}
      >
        <MaterialCommunityIcons 
          name="bus" 
          size={24} 
          color={activeTab === 'fleet' ? '#4a90e2' : '#95a5a6'} 
        />
        <Text 
          style={[
            styles.footerTabText, 
            activeTab === 'fleet' ? styles.activeFooterTabText : null
          ]}
        >
          Fleet
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.footerTab, activeTab === 'incidents' ? styles.activeFooterTab : null]}
        onPress={() => setActiveTab('incidents')}
      >
        <MaterialIcons 
          name="report-problem" 
          size={24} 
          color={activeTab === 'incidents' ? '#4a90e2' : '#95a5a6'} 
        />
        <Text 
          style={[
            styles.footerTabText, 
            activeTab === 'incidents' ? styles.activeFooterTabText : null
          ]}
        >
          Incidents
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.footerTab, activeTab === 'analytics' ? styles.activeFooterTab : null]}
        onPress={() => setActiveTab('analytics')}
      >
        <Ionicons 
          name="stats-chart" 
          size={22} 
          color={activeTab === 'analytics' ? '#4a90e2' : '#95a5a6'} 
        />
        <Text 
          style={[
            styles.footerTabText, 
            activeTab === 'analytics' ? styles.activeFooterTabText : null
          ]}
        >
          Analytics
        </Text>
      </TouchableOpacity>
    </View>
    
    {/* Render all modals */}
    {RouteDetailsModal()}
    {BusDetailsModal()}
    {IncidentDetailsModal()}
    {AddRouteModal()}
    {AddBusModal()}
    {OptimizeScheduleModal()}
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
  backgroundColor: '#4a90e2',
  paddingHorizontal: 16,
  paddingVertical: 12,
},
headerLeft: {
  flexDirection: 'row',
  alignItems: 'center',
},
headerTitle: {
  color: '#fff',
  fontSize: 20,
  fontWeight: 'bold',
  marginLeft: 10,
},
headerRight: {
  flexDirection: 'row',
  alignItems: 'center',
},
headerIconButton: {
  marginLeft: 16,
  position: 'relative',
},
notificationBadge: {
  position: 'absolute',
  right: -6,
  top: -6,
  backgroundColor: '#e74c3c',
  borderRadius: 10,
  width: 20,
  height: 20,
  justifyContent: 'center',
  alignItems: 'center',
},
notificationBadgeText: {
  color: '#fff',
  fontSize: 12,
  fontWeight: 'bold',
},
contentContainer: {
  flex: 1,
},
summaryContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  padding: 16,
  backgroundColor: '#fff',
  marginBottom: 10,
},
summaryItem: {
  flexDirection: 'row',
  alignItems: 'center',
  flex: 1,
},
summaryIconContainer: {
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: '#ecf0f1',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 8,
},
summaryContent: {
  flex: 1,
},
summaryValue: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#2c3e50',
},
summaryLabel: {
  fontSize: 12,
  color: '#7f8c8d',
},
tabContent: {
  padding: 16,
  paddingBottom: 65,
},
tabHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 16,
},
tabTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#2c3e50',
},
addButton: {
  flexDirection: 'row',
  backgroundColor: '#4a90e2',
  paddingHorizontal: 12,
  paddingVertical: 8,
  borderRadius: 5,
  alignItems: 'center',
},
addButtonText: {
  color: '#fff',
  marginLeft: 5,
  fontWeight: '500',
},
statsContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 16,
},
statItem: {
  flex: 1,
  backgroundColor: '#fff',
  paddingVertical: 12,
  paddingHorizontal: 10,
  borderRadius: 8,
  marginHorizontal: 4,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
  elevation: 2,
  alignItems: 'center',
},
statValue: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#2c3e50',
},
statLabel: {
  fontSize: 12,
  color: '#7f8c8d',
  textAlign: 'center',
},
filterContainer: {
  marginBottom: 16,
},
filterLabel: {
  fontSize: 14,
  color: '#7f8c8d',
  marginBottom: 8,
},
filterScrollView: {
  flexGrow: 0,
},
filterOption: {
  paddingHorizontal: 16,
  paddingVertical: 8,
  borderRadius: 20,
  backgroundColor: '#ecf0f1',
  marginRight: 8,
},
activeFilterOption: {
  backgroundColor: '#4a90e2',
},
filterOptionText: {
  color: '#7f8c8d',
},
activeFilterText: {
  color: '#fff',
  fontWeight: '500',
},
listContainer: {
  paddingBottom: 20,
},
listItem: {
  backgroundColor: '#fff',
  padding: 16,
  borderRadius: 8,
  marginBottom: 12,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
  elevation: 2,
},
listItemHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 8,
},
listItemTitle: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#2c3e50',
},
statusBadge: {
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 4,
},
statusBadgeText: {
  color: '#fff',
  fontSize: 12,
  fontWeight: '500',
},
listItemDetails: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginBottom: 8,
},
listItemDetail: {
  flexDirection: 'row',
  alignItems: 'center',
  marginRight: 16,
  marginBottom: 6,
},
listItemDetailText: {
  marginLeft: 4,
  fontSize: 14,
  color: '#34495e',
},
listItemMetrics: {
  flexDirection: 'row',
  borderTopWidth: 1,
  borderTopColor: '#ecf0f1',
  paddingTop: 8,
},
metric: {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
},
metricLabel: {
  fontSize: 13,
  color: '#7f8c8d',
  marginRight: 4,
},
metricValue: {
  fontSize: 13,
  color: '#2c3e50',
  fontWeight: '500',
},
alertText: {
  color: '#e74c3c',
},
incidentDescription: {
  marginBottom: 8,
},
incidentDescriptionText: {
  fontSize: 14,
  color: '#34495e',
},
incidentFooter: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},
incidentTimestamp: {
  fontSize: 12,
  color: '#7f8c8d',
},
severityIndicator: {
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 4,
},
severityText: {
  color: '#fff',
  fontSize: 12,
  fontWeight: '500',
},
footer: {
  flexDirection: 'row',
  backgroundColor: '#fff',
  borderTopWidth: 1,
  borderTopColor: '#ecf0f1',
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: 60,
},
footerTab: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
},
activeFooterTab: {
  borderTopWidth: 2,
  borderTopColor: '#4a90e2',
},
footerTabText: {
  fontSize: 12,
  color: '#95a5a6',
  marginTop: 2,
},
activeFooterTabText: {
  color: '#4a90e2',
},
analyticsFilterContainer: {
  marginBottom: 16,
},
analyticsTypeContainer: {
  marginBottom: 8,
},
analyticsPeriodContainer: {
  marginBottom: 8,
},
chartContainer: {
  backgroundColor: '#fff',
  padding: 16,
  borderRadius: 8,
  marginBottom: 16,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
  elevation: 2,
},
chartTitle: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#2c3e50',
  marginBottom: 8,
  textAlign: 'center',
},
statsGridContainer: {
  marginBottom: 16,
},
sectionTitle: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#2c3e50',
  marginBottom: 8,
},
statsGrid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
},
statsGridItem: {
  width: '48%',
  backgroundColor: '#fff',
  padding: 16,
  borderRadius: 8,
  marginBottom: 10,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
  elevation: 2,
  alignItems: 'center',
},
statsGridValue: {
  fontSize: 20,
  fontWeight: 'bold',
  color: '#2c3e50',
},
statsGridLabel: {
  fontSize: 12,
  color: '#7f8c8d',
  marginTop: 4,
},
performanceContainer: {
  marginBottom: 16,
},
performanceList: {
  backgroundColor: '#fff',
  padding: 16,
  borderRadius: 8,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
  elevation: 2,
},
performanceItem: {
  marginBottom: 12,
},
performanceItemHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 4,
},
performanceItemTitle: {
  fontSize: 14,
  color: '#2c3e50',
},
performanceItemValue: {
  fontSize: 14,
  fontWeight: '500',
  color: '#2c3e50',
},
performanceBar: {
  height: 8,
  backgroundColor: '#ecf0f1',
  borderRadius: 4,
  overflow: 'hidden',
},
performanceBarFill: {
  height: '100%',
  backgroundColor: '#4a90e2',
  borderRadius: 4,
},
loadingOverlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 100,
},
loadingText: {
  color: '#fff',
  marginTop: 8,
  fontSize: 16,
},
modalContainer: {
  flex: 1,
  justifyContent: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  padding: 16,
},
modalContent: {
  backgroundColor: '#fff',
  borderRadius: 8,
  maxHeight: '85%',
  width: '100%',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
},
modalHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 16,
  borderBottomWidth: 1,
  borderBottomColor: '#ecf0f1',
},
modalTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#2c3e50',
},
modalScrollContent: {
  padding: 16,
  maxHeight: 400,
},
detailSection: {
  marginBottom: 20,
},
detailSectionTitle: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#2c3e50',
  marginBottom: 10,
},
detailRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingVertical: 8,
  borderBottomWidth: 1,
  borderBottomColor: '#ecf0f1',
},
detailLabel: {
  fontSize: 14,
  color: '#7f8c8d',
},
detailValue: {
  fontSize: 14,
  color: '#2c3e50',
  fontWeight: '500',
},
assignedBusItem: {
  backgroundColor: '#f8f9fa',
  padding: 10,
  borderRadius: 6,
  marginBottom: 8,
},
assignedBusHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 4,
},
assignedBusId: {
  fontSize: 14,
  fontWeight: '500',
  color: '#2c3e50',
},
assignedBusDetails: {
  fontSize: 13,
  color: '#7f8c8d',
},
noDataText: {
  fontSize: 14,
  color: '#7f8c8d',
  fontStyle: 'italic',
  textAlign: 'center',
  paddingVertical: 10,
},
incidentItem: {
  backgroundColor: '#f8f9fa',
  padding: 10,
  borderRadius: 6,
  marginBottom: 8,
},
incidentItemHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 4,
},
incidentItemId: {
  fontSize: 14,
  fontWeight: '500',
  color: '#2c3e50',
},
incidentItemDescription: {
  fontSize: 13,
  color: '#34495e',
  marginBottom: 4,
},
incidentItemTimestamp: {
  fontSize: 12,
  color: '#7f8c8d',
},
modalActions: {
  flexDirection: 'row',
  justifyContent: 'flex-end',
  padding: 16,
  borderTopWidth: 1,
  borderTopColor: '#ecf0f1',
},
modalButton: {
  paddingVertical: 8,
  paddingHorizontal: 16,
  borderRadius: 4,
  marginLeft: 8,
},
primaryButton: {
  backgroundColor: '#4a90e2',
},
primaryButtonText: {
  color: '#fff',
  fontWeight: '500',
},
secondaryButton: {
  backgroundColor: '#f39c12',
},
secondaryButtonText: {
  color: '#fff',
  fontWeight: '500',
},
cancelButton: {
  backgroundColor: '#ecf0f1',
},
cancelButtonText: {
  color: '#7f8c8d',
},
deleteButton: {
  backgroundColor: '#e74c3c',
},
deleteButtonText: {
  color: '#fff',
  fontWeight: '500',
},
maintenanceButton: {
  backgroundColor: '#f39c12',
},
maintenanceButtonText: {
  color: '#fff',
  fontWeight: '500',
},
formGroup: {
  marginBottom: 16,
},
formLabel: {
  fontSize: 14,
  color: '#7f8c8d',
  marginBottom: 8,
},
input: {
  borderWidth: 1,
  borderColor: '#dcdfe6',
  borderRadius: 4,
  paddingHorizontal: 12,
  paddingVertical: 8,
  fontSize: 14,
  color: '#2c3e50',
},
pickerContainer: {
  borderWidth: 1,
  borderColor: '#dcdfe6',
  borderRadius: 4,
  overflow: 'hidden',
},
picker: {
  height: 40,
  width: '100%',
},
fullDescription: {
  fontSize: 14,
  color: '#34495e',
  lineHeight: 20,
},
optimizationInfo: {
  flexDirection: 'row',
  backgroundColor: '#ecf0f1',
  padding: 10,
  borderRadius: 6,
  marginTop: 10,
},
infoIcon: {
  marginRight: 8,
},
optimizationInfoText: {
  fontSize: 13,
  color: '#34495e',
  flex: 1,
  lineHeight: 18,
}
});

export default AdminDashboard;