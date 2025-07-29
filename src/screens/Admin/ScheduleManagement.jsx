import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ScheduleManagement = () => {
  const schedules = [
    {
      id: 1,
      routeName: 'City Center Route',
      routeCode: 'CCR-001',
      description: 'Peak hour schedule with increased frequency for downtown business district coverage.',
      startTime: '06:00 AM',
      endTime: '11:00 PM',
      frequency: '15 mins',
      busCount: 8,
      status: 'Active',
    },
    {
      id: 2,
      routeName: 'Airport Express',
      routeCode: 'AEX-002', 
      description: 'Premium express schedule connecting airport terminals with minimal stops for travelers.',
      startTime: '05:00 AM',
      endTime: '12:00 AM',
      frequency: '30 mins',
      busCount: 4,
      status: 'Active',
    },
    {
      id: 3,
      routeName: 'University Circuit',
      routeCode: 'UC-003',
      description: 'Student-focused schedule with academic hour optimization and affordable service timing.',
      startTime: '07:00 AM',
      endTime: '10:00 PM',
      frequency: '20 mins',
      busCount: 6,
      status: 'Active',
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Schedule Management</Text>
          <Text style={styles.headerSubtitle}>
            Manage your bus schedules.
          </Text>
        </View>
        <TouchableOpacity style={styles.addBtn}>
          <Text style={styles.addBtnText}>+ Add Schedule</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {schedules.map((schedule) => (
          <View key={schedule.id} style={styles.scheduleCard}>
            <View style={styles.scheduleHeader}>
              <View style={styles.scheduleIconContainer}>
                <Text style={styles.scheduleIcon}>📅</Text>
              </View>
              <View style={styles.scheduleInfo}>
                <Text style={styles.scheduleTitle}>{schedule.routeName}</Text>
                <Text style={styles.scheduleCode}>Route: {schedule.routeCode}</Text>
                <Text style={styles.scheduleTime}>{schedule.startTime} - {schedule.endTime}</Text>
                <View style={styles.statusContainer}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>{schedule.status}</Text>
                </View>
              </View>
            </View>

            <View style={styles.scheduleContent}>
              <Text style={styles.scheduleDescription}>{schedule.description}</Text>
              
              <View style={styles.scheduleStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{schedule.busCount}</Text>
                  <Text style={styles.statLabel}>Buses</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{schedule.frequency}</Text>
                  <Text style={styles.statLabel}>Frequency</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>4.7</Text>
                  <Text style={styles.statLabel}>Rating</Text>
                </View>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity style={[styles.actionBtn, styles.manageBtn]}>
                  <Text style={styles.manageBtnText}>Edit Schedule</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, styles.viewBtn]}>
                  <Text style={styles.viewBtnText}>View Timetable</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
        
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Schedule Management System</Text>
          <Text style={styles.infoText}>
            Our advanced schedule management system optimizes bus timings, manages driver assignments, and ensures efficient resource allocation for maximum service reliability.
        </Text>
      </View>
      </ScrollView>
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
    backgroundColor: '#ffc107',
    paddingHorizontal: SCREEN_WIDTH > 400 ? 20 : 16,
    paddingVertical: SCREEN_WIDTH > 400 ? 12 : 10,
    borderRadius: 30,
    marginTop: SCREEN_WIDTH > 400 ? 8 : 0,
    alignSelf: SCREEN_WIDTH > 400 ? 'flex-start' : 'center',
    minWidth: 140,
    alignItems: 'center',
    shadowColor: '#ffc107',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addBtnText: {
    color: '#000000',
    fontWeight: '600',
    fontSize: SCREEN_WIDTH > 400 ? 16 : 14,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  scheduleCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  scheduleHeader: {
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  scheduleIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#fff3cd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  scheduleIcon: {
    fontSize: 32,
  },
  scheduleInfo: {
    flex: 1,
  },
  scheduleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  scheduleCode: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 4,
  },
  scheduleTime: {
    fontSize: 14,
    color: '#495057',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#28a745',
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#28a745',
    fontWeight: '600',
  },
  scheduleContent: {
    padding: 20,
  },
  scheduleDescription: {
    fontSize: 14,
    color: '#495057',
    lineHeight: 22,
    marginBottom: 16,
  },
  scheduleStats: {
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
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  manageBtn: {
    backgroundColor: '#87ceeb',
  },
  manageBtnText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  viewBtn: {
    backgroundColor: '#2196f3',
  },
  viewBtnText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
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

export default ScheduleManagement;