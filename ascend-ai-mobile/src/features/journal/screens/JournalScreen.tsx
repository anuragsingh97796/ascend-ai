import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useJournals } from '../api/useJournalHooks';
import { JournalEntry } from '@shared/types/api.types';
import { Book, Plus } from 'lucide-react-native';

export const JournalScreen = () => {
  const { data: journals = [], isLoading, refetch } = useJournals();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const renderJournalItem = ({ item }: { item: JournalEntry }) => (
    <View className="bg-white dark:bg-gray-900 rounded-xl p-4 mb-4 shadow-sm border border-gray-100 dark:border-gray-800">
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1 mr-4">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white">{item.title}</Text>
          <Text className="text-xs text-blue-600 font-medium mt-1">
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <Book size={20} color="#2563EB" />
      </View>
      <Text className="text-sm text-gray-500 dark:text-gray-400 mt-2" numberOfLines={3}>
        {item.content}
      </Text>
      <View className="flex-row mt-3 gap-2 flex-wrap">
        {item.tags?.map((tag) => (
          <View key={tag} className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
            <Text className="text-xs text-gray-600 dark:text-gray-300">#{tag}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-950">
      <View className="px-6 pt-12 pb-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex-row justify-between items-center">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">Journal</Text>
        <TouchableOpacity className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-full items-center justify-center">
          <Plus size={20} color="#2563EB" />
        </TouchableOpacity>
      </View>

      {isLoading && !refreshing && journals.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : (
        <FlatList
          data={journals}
          keyExtractor={(item) => item.id}
          renderItem={renderJournalItem}
          contentContainerStyle={{ padding: 24 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2563EB" />
          }
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center py-20">
              <Book size={48} color="#9CA3AF" className="mb-4" />
              <Text className="text-gray-500 dark:text-gray-400 text-center text-lg">
                No journal entries yet.
              </Text>
              <Text className="text-gray-400 dark:text-gray-500 text-center mt-2">
                Tap the + button to write your first entry.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};
