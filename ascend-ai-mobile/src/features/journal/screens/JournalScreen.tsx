import React, { useState } from 'react';
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
import { useJournals, useCreateJournal, useDeleteJournal } from '../api/useJournalHooks';
import { JournalEntry } from '@shared/types/domain/Journal';
import { Book, Plus, Trash2, X } from 'lucide-react-native';
import { Input } from '@shared/components/ui/Input';
import { Button } from '@shared/components/ui/Button';

export const JournalScreen = () => {
  const { data: journals = [], isLoading, refetch } = useJournals();
  const createJournalMutation = useCreateJournal();
  const deleteJournalMutation = useDeleteJournal();

  const [refreshing, setRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const openCreateModal = () => {
    setTitle('');
    setContent('');
    setTagsInput('');
    setFormError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormError(null);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setFormError('Journal title is required');
      return;
    }
    if (!content.trim()) {
      setFormError('Journal content cannot be empty');
      return;
    }

    try {
      setFormError(null);
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim().replace(/^#/, ''))
        .filter(Boolean);

      await createJournalMutation.mutateAsync({
        title: title.trim(),
        content: content.trim(),
        tags: tags.length > 0 ? tags : ['daily'],
        mood: '😊' as any,
      });
      closeModal();
    } catch (err: any) {
      setFormError(err.message || 'Failed to create journal entry. Please check connection.');
    }
  };

  const handleDelete = async (item: JournalEntry) => {
    const confirmDelete = async () => {
      try {
        await deleteJournalMutation.mutateAsync(item.id);
      } catch (err: any) {
        Alert.alert('Error', err.message || 'Failed to delete journal entry');
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm(`Are you sure you want to delete "${item.title}"?`)) {
        await confirmDelete();
      }
    } else {
      Alert.alert('Delete Entry', `Are you sure you want to delete "${item.title}"?`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: confirmDelete },
      ]);
    }
  };

  const isSubmitting = createJournalMutation.isPending;

  const renderJournalItem = ({ item }: { item: JournalEntry }) => (
    <View className="bg-white dark:bg-gray-900 rounded-xl p-4 mb-4 shadow-sm border border-gray-100 dark:border-gray-800">
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1 mr-4">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white">{item.title}</Text>
          <Text className="text-xs text-blue-600 font-medium mt-1">
            {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Today'}
          </Text>
        </View>
        <View className="flex-row items-center">
          <Book size={20} color="#2563EB" className="mr-2" />
          <TouchableOpacity
            onPress={() => handleDelete(item)}
            className="p-1.5 bg-red-50 dark:bg-red-900/20 rounded-lg ml-1"
          >
            <Trash2 size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
      <Text className="text-sm text-gray-500 dark:text-gray-400 mt-2" numberOfLines={3}>
        {item.content}
      </Text>
      {item.tags && item.tags.length > 0 && (
        <View className="flex-row mt-3 gap-2 flex-wrap">
          {item.tags.map((tag, idx) => (
            <View key={`${tag}-${idx}`} className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
              <Text className="text-xs text-gray-600 dark:text-gray-300">#{tag}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-950">
      <View className="px-6 pt-12 pb-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex-row justify-between items-center">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">Journal</Text>
        <TouchableOpacity
          onPress={openCreateModal}
          className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-full items-center justify-center active:opacity-70"
        >
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

      {/* Create Journal Modal */}
      <Modal visible={isModalOpen} transparent animationType="slide" onRequestClose={closeModal}>
        <View className="flex-1 justify-end sm:justify-center bg-black/50 p-4">
          <View className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-xl max-h-[90%]">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-gray-900 dark:text-white">
                New Journal Entry
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
                placeholder="e.g., Morning Reflections"
                value={title}
                onChangeText={setTitle}
              />

              <Input
                label="Content"
                placeholder="What's on your mind today?"
                value={content}
                onChangeText={setContent}
                multiline
                numberOfLines={5}
              />

              <Input
                label="Tags (comma-separated)"
                placeholder="e.g., gratitude, focus, habits"
                value={tagsInput}
                onChangeText={setTagsInput}
              />

              <View className="mt-4 flex-row gap-3">
                <Button
                  title="Cancel"
                  variant="secondary"
                  onPress={closeModal}
                  className="flex-1"
                />
                <Button
                  title="Save Entry"
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
