// Domain Entity: Journal

export type Mood = '😞' | '😕' | '😐' | '🙂' | '😄';

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: Mood;
  wordCount: number;
  tags: string[];
  aiInsight?: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateJournalPayload = Pick<JournalEntry, 'title' | 'content' | 'mood' | 'tags'>;
export type UpdateJournalPayload = Partial<CreateJournalPayload>;
