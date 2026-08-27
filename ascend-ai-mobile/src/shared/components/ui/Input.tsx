import React, { forwardRef, useState } from 'react';
import { TextInput, View, Text, TextInputProps, TouchableOpacity } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  isPassword?: boolean;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, isPassword, className = '', ...props }, ref) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    return (
      <View className={`mb-4 ${className}`}>
        {label && (
          <Text className="mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </Text>
        )}
        <View
          className={`flex-row items-center h-12 rounded-xl border px-3 bg-white dark:bg-gray-900 ${
            error
              ? 'border-red-500'
              : isFocused
                ? 'border-blue-500'
                : 'border-gray-300 dark:border-gray-700'
          }`}
        >
          <TextInput
            ref={ref}
            className="flex-1 h-full text-base text-gray-900 dark:text-white"
            placeholderTextColor="#9CA3AF"
            secureTextEntry={isPassword && !isPasswordVisible}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />
          {isPassword && (
            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              className="ml-2 p-1"
            >
              {isPasswordVisible ? (
                <EyeOff size={20} color="#9CA3AF" />
              ) : (
                <Eye size={20} color="#9CA3AF" />
              )}
            </TouchableOpacity>
          )}
        </View>
        {error && <Text className="mt-1.5 text-xs text-red-500">{error}</Text>}
      </View>
    );
  },
);

Input.displayName = 'Input';
