import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Modal,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';

import {
  useHabits,
  useCreateHabit,
  useCheckInHabit,
  useUndoCheckInHabit,
  useDeleteHabit,
} from '../api/useHabitsHooks';
import { Habit } from '../domain/habit.types';
import { CheckCircle2, Circle, Flame, Plus, Trash2, X } from 'lucide-react-native';
import { Input } from '@shared/components/ui/Input';
import { Button } from '@shared/components/ui/Button';

export const HabitsScreen = () => {
  const { data: habits = [], isLoading, refetch: fetchHabits } = useHabits();
  const createHabitMutation = useCreateHabit();
  const checkInMutation = useCheckInHabit();
  const undoCheckInMutation = useUndoCheckInHabit();
  const deleteHabitMutation = useDeleteHabit();

  const [refreshing, setRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('🎯');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    fetchHabits();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchHabits();
    setRefreshing(false);
  };

  const openCreateModal = () => {
    setName('');
    setDescription('');
    setIcon('🎯');
    setFormError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormError(null);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setFormError('Habit name is required');
      return;
    }

    try {
      setFormError(null);
      await createHabitMutation.mutateAsync({
        name: name.trim(),
        description: description.trim() || undefined,
        icon: icon.trim() || '🎯',
        frequency: 'daily',
        color: 'purple',
        startDate: new Date().toISOString().split('T')[0],
      });
      closeModal();
    } catch (err: any) {
      setFormError(err.message || 'Failed to create habit. Please check connection.');
    }
  };

  const toggleCheckIn = async (habit: Habit) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      if (habit.completedDates?.includes(today)) {
        await undoCheckInMutation.mutateAsync(habit.id);
      } else {
        await checkInMutation.mutateAsync(habit.id);
      }
    } catch (err: any) {
      Alert.alert('Check-in error', err.message || 'Failed to update check-in status');
    }
  };

  const handleDelete = async (habit: Habit) => {
    const confirmDelete = async () => {
      try {
        await deleteHabitMutation.mutateAsync(habit.id);
      } catch (err: any) {
        Alert.alert('Error', err.message || 'Failed to delete habit');
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm(`Are you sure you want to delete "${habit.name}"?`)) {
        await confirmDelete();
      }
    } else {
      Alert.alert('Delete Habit', `Are you sure you want to delete "${habit.name}"?`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: confirmDelete },
      ]);
    }
  };

  const isSubmitting = createHabitMutation.isPending;

  const renderHabitItem = ({ item }: { item: Habit }) => {
    const isCompleted = item.completedDates?.includes(new Date().toISOString().split('T')[0]);

    return (
      <View
        className={`bg-white dark:bg-gray-900 rounded-xl p-4 mb-4 shadow-sm border flex-row items-center justify-between ${
          isCompleted
            ? 'border-green-500 bg-green-50 dark:bg-green-900/10'
            : 'border-gray-100 dark:border-gray-800'
        }`}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => toggleCheckIn(item)}
          className="flex-row items-center flex-1 mr-2"
        >
          <View className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full items-center justify-center mr-4">
            <Text className="text-2xl">{item.icon || '🎯'}</Text>
          </View>
          <View className="flex-1">
            <Text
              className={`text-lg font-semibold ${
                isCompleted ? 'text-green-700 dark:text-green-400' : 'text-gray-900 dark:text-white'
              }`}
            >
              {item.name}
            </Text>
            {item.description ? (
              <Text className="text-xs text-gray-500 dark:text-gray-400 mt-0.5" numberOfLines={1}>
                {item.description}
              </Text>
            ) : null}
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
        </TouchableOpacity>

        <View className="flex-row items-center gap-2">
          <TouchableOpacity onPress={() => toggleCheckIn(item)} className="p-1">
            {isCompleted ? (
              <CheckCircle2 size={32} color="#22C55E" />
            ) : (
              <Circle size={32} color="#D1D5DB" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleDelete(item)}
            className="p-1.5 bg-red-50 dark:bg-red-900/20 rounded-lg ml-1"
          >
            <Trash2 size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-950">
      <View className="px-6 pt-12 pb-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex-row justify-between items-center">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">Daily Habits</Text>
        <TouchableOpacity
          onPress={openCreateModal}
          className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-full items-center justify-center active:opacity-70"
        >
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

      {/* Create Habit Modal */}
      <Modal visible={isModalOpen} transparent animationType="slide" onRequestClose={closeModal}>
        <View className="flex-1 justify-end sm:justify-center bg-black/50 p-4">
          <View className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-xl max-h-[90%]">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-gray-900 dark:text-white">
                Create New Habit
              </Text>
              <TouchableOpacity onPress={closeModal} className="p-1">
                <X size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {formError && (
                <View className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <Text className="text-sm text-red-600 dark:text-red-400">{formError}</Text>
                </View>
              )}

              <Input
                label="Habit Name"
                placeholder="e.g., Morning Meditation"
                value={name}
                onChangeText={setName}
              />

              <Input
                label="Description"
                placeholder="e.g., 10 minutes of quiet breathing"
                value={description}
                onChangeText={setDescription}
              />

              <Input
                label="Icon (Emoji)"
                placeholder="e.g., 🧘 or 🏃 or 💧"
                value={icon}
                onChangeText={setIcon}
              />

              <View className="mt-4 flex-row gap-3">
                <Button
                  title="Cancel"
                  variant="secondary"
                  onPress={closeModal}
                  className="flex-1"
                />
                <Button
                  title="Create Habit"
                  onPress={handleSubmit}
                  isLoading={isSubmitting}
                  className="flex-1"
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};
