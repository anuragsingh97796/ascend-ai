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

import { useGoals, useCreateGoal, useUpdateGoal, useDeleteGoal } from '../api/useGoalsHooks';
import { Goal, GoalCategory } from '../domain/goal.types';
import { Target, Plus, Pencil, Trash2, X } from 'lucide-react-native';
import { Input } from '@shared/components/ui/Input';
import { Button } from '@shared/components/ui/Button';

export const GoalsScreen = () => {
  const { data: goals = [], isLoading, refetch: fetchGoals } = useGoals();
  const createGoalMutation = useCreateGoal();
  const updateGoalMutation = useUpdateGoal();
  const deleteGoalMutation = useDeleteGoal();

  const [refreshing, setRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<GoalCategory>('health');
  const [progress, setProgress] = useState('0');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    fetchGoals();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchGoals();
    setRefreshing(false);
  };

  const openCreateModal = () => {
    setEditingGoal(null);
    setTitle('');
    setDescription('');
    setCategory('health');
    setProgress('0');
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (goal: Goal) => {
    setEditingGoal(goal);
    setTitle(goal.title);
    setDescription(goal.description || '');
    setCategory(goal.category || 'health');
    setProgress(String(goal.progress ?? 0));
    setFormError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingGoal(null);
    setFormError(null);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setFormError('Goal title is required');
      return;
    }

    try {
      setFormError(null);
      if (editingGoal) {
        await updateGoalMutation.mutateAsync({
          id: editingGoal.id,
          data: {
            title: title.trim(),
            description: description.trim(),
            category,
            progress: Math.min(100, Math.max(0, parseInt(progress, 10) || 0)),
          },
        });
      } else {
        await createGoalMutation.mutateAsync({
          title: title.trim(),
          description: description.trim(),
          category,
          priority: 'medium',
          status: 'active',
        });
      }
      closeModal();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save goal. Please check connection.');
    }
  };

  const handleDelete = async (goal: Goal) => {
    const confirmDelete = async () => {
      try {
        await deleteGoalMutation.mutateAsync(goal.id);
      } catch (err: any) {
        Alert.alert('Error', err.message || 'Failed to delete goal');
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm(`Are you sure you want to delete "${goal.title}"?`)) {
        await confirmDelete();
      }
    } else {
      Alert.alert('Delete Goal', `Are you sure you want to delete "${goal.title}"?`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: confirmDelete },
      ]);
    }
  };

  const isSubmitting = createGoalMutation.isPending || updateGoalMutation.isPending;

  const renderGoalItem = ({ item }: { item: Goal }) => (
    <View className="bg-white dark:bg-gray-900 rounded-xl p-4 mb-4 shadow-sm border border-gray-100 dark:border-gray-800">
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1 mr-4">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white">{item.title}</Text>
          <Text className="text-xs text-blue-600 font-medium mt-1">
            {item.category} • {item.status}
          </Text>
        </View>
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => openEditModal(item)}
            className="p-1.5 mr-1 bg-gray-100 dark:bg-gray-800 rounded-lg"
          >
            <Pencil size={16} color="#4B5563" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDelete(item)}
            className="p-1.5 bg-red-50 dark:bg-red-900/20 rounded-lg"
          >
            <Trash2 size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      {item.description ? (
        <Text className="text-sm text-gray-500 dark:text-gray-400 mb-3" numberOfLines={2}>
          {item.description}
        </Text>
      ) : null}

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
            style={{ width: `${Math.min(100, Math.max(0, item.progress || 0))}%` }}
          />
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-950">
      <View className="px-6 pt-12 pb-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex-row justify-between items-center">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">My Goals</Text>
        <TouchableOpacity
          onPress={openCreateModal}
          className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-full items-center justify-center active:opacity-70"
        >
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

      {/* Create / Edit Goal Modal */}
      <Modal visible={isModalOpen} transparent animationType="slide" onRequestClose={closeModal}>
        <View className="flex-1 justify-end sm:justify-center bg-black/50 p-4">
          <View className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-xl max-h-[90%]">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-gray-900 dark:text-white">
                {editingGoal ? 'Edit Goal' : 'Create New Goal'}
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
                label="Title"
                placeholder="e.g., Run a Marathon"
                value={title}
                onChangeText={setTitle}
              />

              <Input
                label="Description"
                placeholder="Why is this goal important?"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
              />

              {editingGoal && (
                <Input
                  label="Progress (%)"
                  placeholder="0 - 100"
                  value={progress}
                  onChangeText={setProgress}
                  keyboardType="numeric"
                />
              )}

              <View className="mt-4 flex-row gap-3">
                <Button
                  title="Cancel"
                  variant="secondary"
                  onPress={closeModal}
                  className="flex-1"
                />
                <Button
                  title={editingGoal ? 'Save Changes' : 'Create Goal'}
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
