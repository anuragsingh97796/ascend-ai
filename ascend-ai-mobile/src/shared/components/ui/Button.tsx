import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  textClassName?: string;
}

export const Button = ({
  title,
  onPress,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  className = '',
  textClassName = '',
}: ButtonProps) => {
  const getVariantStyles = (): string => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 active:bg-blue-700';
      case 'secondary':
        return 'bg-gray-200 active:bg-gray-300 dark:bg-gray-800 dark:active:bg-gray-700';
      case 'outline':
        return 'bg-transparent border border-blue-600 active:bg-blue-50';
      case 'ghost':
        return 'bg-transparent active:bg-gray-100 dark:active:bg-gray-800';
      default:
        return 'bg-blue-600 active:bg-blue-700';
    }
  };

  const getTextStyles = (): string => {
    switch (variant) {
      case 'primary':
        return 'text-white';
      case 'secondary':
        return 'text-gray-900 dark:text-white';
      case 'outline':
      case 'ghost':
        return 'text-blue-600';
      default:
        return 'text-white';
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      className={`h-12 rounded-xl flex items-center justify-center flex-row px-4 ${getVariantStyles()} ${
        disabled || isLoading ? 'opacity-50' : ''
      } ${className}`}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'primary' ? 'white' : '#2563EB'} />
      ) : (
        <Text className={`font-semibold text-base ${getTextStyles()} ${textClassName}`}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};
