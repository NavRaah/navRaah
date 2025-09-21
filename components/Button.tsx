import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  className = '',
}: ButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return disabled || loading ? 'bg-blue-300' : 'bg-blue-500';
      case 'secondary':
        return disabled || loading ? 'bg-gray-300' : 'bg-gray-500';
      case 'outline':
        return 'border border-gray-300 bg-transparent';
      default:
        return 'bg-blue-500';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return 'py-2 px-4';
      case 'medium':
        return 'py-3 px-6';
      case 'large':
        return 'py-4 px-8';
      default:
        return 'py-3 px-6';
    }
  };

  const getTextColor = () => {
    if (variant === 'outline') {
      return 'text-gray-700';
    }
    return 'text-white';
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`${getVariantStyles()} ${getSizeStyles()} rounded-lg ${className}`}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? '#374151' : 'white'} />
      ) : (
        <Text className={`${getTextColor()} font-semibold text-center`}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
