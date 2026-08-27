import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuthStore } from '@features/auth/store/authStore';
import { LogOut } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const ProfileScreen = () => {
  const { user, logout } = useAuthStore();

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-950">
      <View className="px-6 pt-8 pb-4">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Profile & Settings
        </Text>

        <View className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 items-center mb-6">
          <View className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full items-center justify-center mb-4">
            <Text className="text-blue-600 dark:text-blue-400 text-2xl font-bold">
              {user?.avatarInitials || 'A'}
            </Text>
          </View>
          <Text className="text-xl font-bold text-gray-900 dark:text-white mb-1">{user?.name}</Text>
          <Text className="text-gray-500 dark:text-gray-400 mb-4">{user?.email}</Text>
        </View>

        <TouchableOpacity
          onPress={logout}
          className="bg-red-50 dark:bg-red-900/10 rounded-xl p-4 flex-row items-center justify-center border border-red-100 dark:border-red-900/30"
        >
          <LogOut size={20} color="#DC2626" className="mr-2" />
          <Text className="text-red-600 font-semibold text-lg">Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
