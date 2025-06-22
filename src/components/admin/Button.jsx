import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

const Button = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  size = 'medium', 
  loading = false, 
  disabled = false,
  style 
}) => {
  const buttonStyle = [
    styles.button,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
    style
  ];

  const textStyle = [
    styles.text,
    styles[`text${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
    styles[`text${size.charAt(0).toUpperCase() + size.slice(1)}`]
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'primary' ? '#ffffff' : '#002F6C'} 
          size="small" 
        />
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Variants
  primary: {
    backgroundColor: '#002F6C',
  },
  secondary: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#002F6C',
  },
  danger: {
    backgroundColor: '#dc3545',
  },
  success: {
    backgroundColor: '#28a745',
  },
  warning: {
    backgroundColor: '#ffc107',
  },

  // Sizes
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },

  // Disabled state
  disabled: {
    opacity: 0.6,
  },

  // Text styles
  text: {
    fontWeight: '600',
  },
  textPrimary: {
    color: '#ffffff',
  },
  textSecondary: {
    color: '#002F6C',
  },
  textDanger: {
    color: '#ffffff',
  },
  textSuccess: {
    color: '#ffffff',
  },
  textWarning: {
    color: '#000000',
  },
  textSmall: {
    fontSize: 14,
  },
  textMedium: {
    fontSize: 16,
  },
  textLarge: {
    fontSize: 18,
  },
});

export default Button; 