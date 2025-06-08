import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

// Enhanced pagination dots component with animations
const Pagination = ({ data, currentIndex, showCounter = false }) => {
  return (
    <View style={styles.container}>
      {showCounter && (
        <Text style={styles.counterText}>
          {currentIndex + 1} of {data.length}
        </Text>
      )}
      
      <View style={styles.dotsContainer}>
        {data.map((_, index) => {
          const isActive = currentIndex === index;
          
          return (
            <View
              key={index}
              style={[
                styles.dot,
                isActive ? styles.activeDot : styles.inactiveDot,
              ]}
            >
              {isActive && <View style={styles.activeDotInner} />}
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default Pagination;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 25,
  },
  counterText: {
    fontSize: 14,
    color: '#047857',
    fontWeight: '500',
    marginBottom: 15,
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    height: 12,
    borderRadius: 6,
    marginHorizontal: 6,
    borderWidth: 2,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeDot: {
    backgroundColor: '#10b981',
    width: 28,
    borderColor: '#10b981',
  },
  inactiveDot: {
    backgroundColor: '#d1fae5',
    width: 12,
    borderColor: '#d1fae5',
  },
  activeDotInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ffffff',
  },
});