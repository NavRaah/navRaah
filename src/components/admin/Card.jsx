import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Card = ({ 
  children, 
  title, 
  subtitle,
  icon,
  headerActions,
  style,
  onPress,
  price,
  status,
  description,
  features = [],
  actionButtons = []
}) => {
  const CardWrapper = onPress ? TouchableOpacity : View;
  
  return (
    <CardWrapper style={[styles.card, style]} onPress={onPress} activeOpacity={onPress ? 0.7 : 1}>
      {/* Header Section */}
      {(title || icon) && (
        <View style={styles.header}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <View style={styles.headerContent}>
            {title && <Text style={styles.title}>{title}</Text>}
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            {price && (
              <View style={styles.priceContainer}>
                <Text style={styles.price}>{price}</Text>
                {status && (
                  <View style={styles.statusContainer}>
                    <View style={[styles.statusDot, 
                      { backgroundColor: status === 'active' ? '#28a745' : '#dc3545' }
                    ]} />
                    <Text style={[styles.statusText, 
                      { color: status === 'active' ? '#28a745' : '#dc3545' }
                    ]}>
                      {status}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
          {headerActions && <View style={styles.headerActions}>{headerActions}</View>}
        </View>
      )}

      {/* Content Section */}
      <View style={styles.content}>
        {description && <Text style={styles.description}>{description}</Text>}
        {children}
        
        {/* Features List */}
        {features.length > 0 && (
          <View style={styles.featuresContainer}>
            <Text style={styles.featuresTitle}>Features:</Text>
            <View style={styles.featuresList}>
              {features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <View style={styles.featureDot} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      {actionButtons.length > 0 && (
        <View style={styles.actionsContainer}>
          <View style={styles.actionButtons}>
            {actionButtons.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.actionBtn, button.style]}
                onPress={button.onPress}
              >
                <Text style={[styles.actionBtnText, button.textStyle]}>
                  {button.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </CardWrapper>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196f3',
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
    fontWeight: '600',
  },
  headerActions: {
    marginLeft: 12,
  },
  content: {
    padding: 20,
  },
  description: {
    fontSize: 14,
    color: '#495057',
    lineHeight: 22,
    marginBottom: 16,
  },
  featuresContainer: {
    marginTop: 16,
  },
  featuresTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  featuresList: {
    marginBottom: 8,
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
    backgroundColor: '#2196f3',
    marginRight: 10,
  },
  featureText: {
    fontSize: 13,
    color: '#495057',
  },
  actionsContainer: {
    padding: 20,
    paddingTop: 0,
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
    backgroundColor: '#2196f3',
  },
  actionBtnText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default Card; 