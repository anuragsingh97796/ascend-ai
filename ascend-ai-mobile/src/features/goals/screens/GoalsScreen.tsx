import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

import { useGoals } from '../api/useGoalsHooks';
import { Goal } from '../domain/goal.types';
import { Target, Plus } from 'lucide-react-native';

export const GoalsScreen = () => {
  const { data: goals = [], isLoading, refetch: fetchGoals } = useGoals();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchGoals();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchGoals();
    setRefreshing(false);
  };

  const renderGoalItem = ({ item }: { item: Goal }) => (
    <View className="bg-white dark:bg-gray-900 rounded-xl p-4 mb-4 shadow-sm border border-gray-100 dark:border-gray-800">
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1 mr-4">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white">{item.title}</Text>
          <Text className="text-xs text-blue-600 font-medium mt-1">
            {item.category} • {item.status}
          </Text>
        </View>
        <Target size={24} color="#2563EB" />
      </View>

      {item.description && (
        <Text className="text-sm text-gray-500 dark:text-gray-400 mb-3" numberOfLines={2}>
          {item.description}
        </Text>
      )}

      <View className="mt-2">
        <View className="flex-row justify-between mb-1">
          <Text className="text-xs text-gray-500 dark:text-gray-400">Progress</Text>
          <Text className="text-xs font-semibold text-gray-900 dark:text-white">
            {item.progress}%
          </Text>
        </View>
        <View className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <View
            className="h-full bg-blue-600 rounded-full"
            style={{ width: `${item.progress}%` }}
          />
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-950">
      <View className="px-6 pt-12 pb-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex-row justify-between items-center">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">My Goals</Text>
        <TouchableOpacity className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-full items-center justify-center">
          <Plus size={20} color="#2563EB" />
        </TouchableOpacity>
      </View>

      {isLoading && !refreshing && goals.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : (
        <FlatList
          data={goals}
          keyExtractor={(item) => item.id}
          renderItem={renderGoalItem}
          contentContainerStyle={{ padding: 24 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2563EB" />
          }
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center py-20">
              <Target size={48} color="#9CA3AF" className="mb-4" />
              <Text className="text-gray-500 dark:text-gray-400 text-center text-lg">
                No goals yet.
              </Text>
              <Text className="text-gray-400 dark:text-gray-500 text-center mt-2">
                Tap the + button to create your first goal.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};
