import { apiClient } from '@shared/services/apiClient';
import { CoachChat } from '../domain/coach.types';
import { storage } from '@shared/services/storage';

const COACH_HISTORY_KEY = 'ascend:coach:history';

export const getCoachHistory = async (): Promise<CoachChat[]> => {
  try {
    const raw = storage.getString(COACH_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveCoachHistory = async (history: CoachChat[]): Promise<void> => {
  storage.set(COACH_HISTORY_KEY, JSON.stringify(history));
};

export const sendCoachMessage = async (message: string): Promise<CoachChat> => {
  const response = await apiClient.post('/coach/chat', { message });
  const data = response.data?.data;
  
  return {
    id: data?.id || `msg_${Date.now()}`,
    userId: 'system',
    role: 'assistant',
    content: data?.text || 'No response received',
    timestamp: data?.timestamp || new Date().toISOString(),
  };
};
