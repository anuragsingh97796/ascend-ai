import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

import { useHabits, useCheckInHabit, useUndoCheckInHabit } from '../api/useHabitsHooks';
import { Habit } from '../domain/habit.types';
import { CheckCircle2, Circle, Flame, Plus } from 'lucide-react-native';

export const HabitsScreen = () => {
  const { data: habits = [], isLoading, refetch: fetchHabits } = useHabits();
  const checkInMutation = useCheckInHabit();
  const undoCheckInMutation = useUndoCheckInHabit();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchHabits();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchHabits();
    setRefreshing(false);
  };

  const toggleCheckIn = async (habit: Habit) => {
    if (habit.completedDates?.includes(new Date().toISOString().split('T')[0])) {
      await undoCheckInMutation.mutateAsync(habit.id);
    } else {
      await checkInMutation.mutateAsync(habit.id);
    }
  };

  const renderHabitItem = ({ item }: { item: Habit }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => toggleCheckIn(item)}
      className={`bg-white dark:bg-gray-900 rounded-xl p-4 mb-4 shadow-sm border flex-row items-center justify-between ${
        item.completedDates?.includes(new Date().toISOString().split('T')[0])
          ? 'border-green-500 bg-green-50 dark:bg-green-900/10'
          : 'border-gray-100 dark:border-gray-800'
      }`}
    >
      <View className="flex-row items-center flex-1 mr-4">
        <View className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full items-center justify-center mr-4">
          <Text className="text-2xl">{item.icon}</Text>
        </View>
        <View className="flex-1">
          <Text
            className={`text-lg font-semibold ${item.completedDates?.includes(new Date().toISOString().split('T')[0]) ? 'text-green-700 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}
          >
            {item.name}
          </Text>
          <View className="flex-row items-center mt-1">
            <Flame
              size={14}
              color={item.currentStreak > 0 ? '#F97316' : '#9CA3AF'}
              className="mr-1"
            />
            <Text className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {item.currentStreak} day streak
            </Text>
          </View>
        </View>
      </View>

      <View>
        {item.completedDates?.includes(new Date().toISOString().split('T')[0]) ? (
          <CheckCircle2 size={32} color="#22C55E" />
        ) : (
          <Circle size={32} color="#D1D5DB" />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-950">
      <View className="px-6 pt-12 pb-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex-row justify-between items-center">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">Daily Habits</Text>
        <TouchableOpacity className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-full items-center justify-center">
          <Plus size={20} color="#2563EB" />
        </TouchableOpacity>
      </View>

      {isLoading && !refreshing && habits.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : (
        <FlatList
          data={habits}
          keyExtractor={(item) => item.id}
          renderItem={renderHabitItem}
          contentContainerStyle={{ padding: 24 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2563EB" />
          }
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center py-20">
              <CheckCircle2 size={48} color="#9CA3AF" className="mb-4" />
              <Text className="text-gray-500 dark:text-gray-400 text-center text-lg">
                No habits yet.
              </Text>
              <Text className="text-gray-400 dark:text-gray-500 text-center mt-2">
                Tap the + button to build a new habit.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};
