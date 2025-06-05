import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

// Enhanced individual slide renderer with modern card design
const Slide = ({item, index}) => {
  return (
    <View style={[styles.container, {width}]}>
      <View style={styles.slideCard}>
        {item.icon && (
          <View style={styles.iconContainer}>
            <Text style={styles.slideIcon}>{item.icon}</Text>
          </View>
        )}
        
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
        
        {/* Decorative elements */}
        <View style={styles.decorativeElements}>
          <View style={[styles.decorativeDot, styles.dot1]} />
          <View style={[styles.decorativeDot, styles.dot2]} />
          <View style={[styles.decorativeDot, styles.dot3]} />
        </View>
      </View>
    </View>
  );
};

export default Slide;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: height * 0.5,
  },
  slideCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 40,
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
    shadowColor: '#059669',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 12,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#d1fae5',
  },
  iconContainer: {
    backgroundColor: '#10b981',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: '#10b981',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  slideIcon: {
    fontSize: 36,
  },
  contentContainer: {
    alignItems: 'center',
  },
  title: {
    color: '#047857',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 0.5,
    lineHeight: 30,
  },
  description: {
    color: '#6b7280',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    letterSpacing: 0.3,
    maxWidth: 260,
  },
  decorativeElements: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 100,
    height: 100,
  },
  decorativeDot: {
    position: 'absolute',
    borderRadius: 50,
    opacity: 0.1,
  },
  dot1: {
    width: 20,
    height: 20,
    backgroundColor: '#10b981',
    top: 20,
    right: 30,
  },
  dot2: {
    width: 12,
    height: 12,
    backgroundColor: '#10b981',
    top: 50,
    right: 20,
  },
  dot3: {
    width: 8,
    height: 8,
    backgroundColor: '#10b981',
    top: 35,
    right: 50,
  },
});