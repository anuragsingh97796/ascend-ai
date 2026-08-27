import React from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@shared/components/ui/Input';
import { Button } from '@shared/components/ui/Button';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/authStore';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterScreen = () => {
  const { register, isLoading, clearError } = useAuthStore();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      clearError();
      await register(data);
      // Navigation is handled automatically by RootNavigator
    } catch (e: any) {
      Alert.alert('Registration Failed', e.message || 'An unexpected error occurred.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white dark:bg-gray-950"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="mb-10 items-center">
          <Text className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Create Account
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-center">
            Start your journey with Ascend AI today.
          </Text>
        </View>

        <View className="mb-6">
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Full Name"
                placeholder="Enter your name"
                autoCapitalize="words"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Email"
                placeholder="Enter your email"
                autoCapitalize="none"
                keyboardType="email-address"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Password"
                placeholder="Create a password"
                isPassword
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.password?.message}
              />
            )}
          />
        </View>

        <Button
          title="Sign Up"
          onPress={handleSubmit(onSubmit)}
          isLoading={isLoading}
          className="mb-4"
        />

        <View className="flex-row justify-center mt-4">
          <Text className="text-gray-600 dark:text-gray-400">Already have an account? </Text>
          <Text className="text-blue-600 font-semibold" onPress={() => navigation.goBack()}>
            Sign in
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
