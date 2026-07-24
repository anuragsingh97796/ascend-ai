/**
 * Ascend AI — Journal Store (Zustand)
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Mood = "😞" | "😕" | "😐" | "🙂" | "😄";

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

interface JournalState {
  entries: JournalEntry[];
  searchQuery: string;
  filterMood: Mood | null;
}

interface JournalActions {
  addEntry: (entry: Omit<JournalEntry, "id" | "wordCount" | "createdAt" | "updatedAt">) => void;
  updateEntry: (id: string, updates: Partial<Omit<JournalEntry, "id" | "createdAt">>) => void;
  deleteEntry: (id: string) => void;
  setSearchQuery: (q: string) => void;
  setFilterMood: (mood: Mood | null) => void;
}

type JournalStore = JournalState & JournalActions;

const countWords = (text: string) =>
  text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

const SEED_ENTRIES: JournalEntry[] = [
  {
    id: "j1",
    title: "A productive week",
    content: "Today I completed two major milestones on my TypeScript course and felt really accomplished. The AI coach session in the morning helped me break down the intimidating generics chapter into small, manageable pieces. I'm starting to see patterns in the code that I couldn't see before. Grateful for this journey.",
    mood: "😄",
    wordCount: 53,
    tags: ["productivity", "learning"],
    aiInsight: "You mentioned feeling accomplished after completing milestones — this aligns with your goal progress of 60%.",
    createdAt: "2026-07-17T08:00:00Z",
    updatedAt: "2026-07-17T08:30:00Z",
  },
];

export const useJournalStore = create<JournalStore>()(
  persist(
    (set) => ({
      entries: SEED_ENTRIES,
      searchQuery: "",
      filterMood: null,
      addEntry: (entry) =>
        set((state) => ({
          entries: [
            {
              ...entry,
              id: `journal_${Date.now()}`,
              wordCount: countWords(entry.content),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            ...state.entries,
          ],
        })),
      updateEntry: (id, updates) =>
        set((state) => ({
          entries: state.entries.map((e) =>
            e.id === id
              ? {
                  ...e,
                  ...updates,
                  wordCount: updates.content !== undefined ? countWords(updates.content) : e.wordCount,
                  updatedAt: new Date().toISOString(),
                }
              : e
          ),
        })),
      deleteEntry: (id) =>
        set((state) => ({ entries: state.entries.filter((e) => e.id !== id) })),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setFilterMood: (filterMood) => set({ filterMood }),
    }),
    {
      name: "ascend-ai:journal",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : ({} as Storage)
      ),
    }
  )
);

export const useJournalEntries = () => useJournalStore((s) => s.entries);
export const useJournalSearch = () => useJournalStore((s) => s.searchQuery);
export const useJournalMoodFilter = () => useJournalStore((s) => s.filterMood);
