import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuthStore } from '@features/auth/store/authStore';
import { useHabits } from '@features/habits/api/useHabitsHooks';
import { useGoals } from '@features/goals/api/useGoalsHooks';
import { LogOut, Target, CheckCircle2 } from 'lucide-react-native';

export const HomeScreen: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { data: habits = [], refetch: fetchHabits } = useHabits();
  const { data: goals = [], refetch: fetchGoals } = useGoals();

  useEffect(() => {
    fetchHabits();
    fetchGoals();
  }, []);

  const completedHabits = habits.filter((h) =>
    h.completedDates?.includes(new Date().toISOString().split('T')[0]),
  ).length;

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-950">
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <View className="flex-row justify-between items-center mb-8">
          <View>
            <Text className="text-gray-500 dark:text-gray-400 text-sm">Good morning,</Text>
            <Text className="text-2xl font-bold text-gray-900 dark:text-white">
              {user?.name || 'Ascender'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={logout}
            className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-full items-center justify-center"
          >
            <LogOut size={20} color="#4B5563" />
          </TouchableOpacity>
        </View>

        {/* Dashboard Summary Cards */}
        <View className="flex-row gap-4 mb-8">
          <View className="flex-1 bg-blue-600 rounded-2xl p-4 shadow-sm">
            <CheckCircle2 size={24} color="white" className="mb-2" />
            <Text className="text-white text-2xl font-bold">
              {completedHabits}/{habits.length}
            </Text>
            <Text className="text-blue-100 text-sm font-medium">Habits Today</Text>
          </View>

          <View className="flex-1 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 shadow-sm">
            <Target size={24} color="#2563EB" className="mb-2" />
            <Text className="text-gray-900 dark:text-white text-2xl font-bold">{goals.length}</Text>
            <Text className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              Active Goals
            </Text>
          </View>
        </View>

        {/* Next actions / Activity */}
        <View>
          <Text className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </Text>
          <View className="bg-white dark:bg-gray-900 rounded-xl p-6 items-center justify-center border border-gray-100 dark:border-gray-800">
            <Text className="text-gray-500 dark:text-gray-400 text-center">
              Your activity stream will appear here. Start by completing a habit or updating a goal!
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
