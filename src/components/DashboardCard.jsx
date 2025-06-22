import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isSmallScreen = SCREEN_WIDTH < 375;
const isLargeScreen = SCREEN_WIDTH > 414;

const DashboardCard = ({ icon, title, count, bgColor }) => {
  return (
    <View style={[styles.card, { backgroundColor: bgColor }]}>
      <Text style={styles.count}>{count}</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: isSmallScreen ? 16 : 20,
    borderRadius: 12,
    marginBottom: isSmallScreen ? 12 : 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    minHeight: isSmallScreen ? 80 : 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  count: {
    fontSize: isSmallScreen ? 20 : isLargeScreen ? 28 : 24,
    fontWeight: 'bold',
    marginBottom: isSmallScreen ? 4 : 6,
    color: '#333',
    textAlign: 'center',
  },
  title: {
    fontSize: isSmallScreen ? 12 : isLargeScreen ? 18 : 16,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default DashboardCard;
