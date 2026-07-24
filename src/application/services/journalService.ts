// Application Service: Journal (localStorage)

import type { JournalEntry, Mood } from "@/domain/entities/Journal";

const KEY = "ascend:journal";

const SEED: JournalEntry[] = [
  {
    id: "j1",
    title: "Starting fresh",
    content: "Today I set up my first goal in Ascend AI. Feeling motivated and clear about what I want to achieve this quarter. The morning meditation helped a lot.",
    mood: "😄",
    wordCount: 29,
    tags: ["motivation", "goals"],
    aiInsight: "Your positive momentum is clear. Consider anchoring this clarity with a 5-minute evening review habit.",
    createdAt: new Date(Date.now() - 2 * 24 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 3600000).toISOString(),
  },
  {
    id: "j2",
    title: "Tough day but kept going",
    content: "Work was overwhelming but I still did my evening run. Small wins matter. I struggled with the no-social-media habit today but I will try again tomorrow.",
    mood: "😐",
    wordCount: 29,
    tags: ["resilience", "habits"],
    aiInsight: "You ran even on a hard day — that's high-agency behavior. Acknowledge that.",
    createdAt: new Date(Date.now() - 1 * 24 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 3600000).toISOString(),
  },
];

export function getEntries(): JournalEntry[] {
  if (typeof window === "undefined") return SEED;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : SEED;
  } catch { return SEED; }
}

function saveEntries(entries: JournalEntry[]): void {
  localStorage.setItem(KEY, JSON.stringify(entries));
}

export function addEntry(entry: Omit<JournalEntry, "id" | "createdAt" | "updatedAt" | "wordCount">): JournalEntry[] {
  const entries = getEntries();
  const wordCount = entry.content.trim().split(/\s+/).filter(Boolean).length;
  const newEntry: JournalEntry = {
    ...entry,
    id: `j_${Date.now()}`,
    wordCount,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const updated = [newEntry, ...entries];
  saveEntries(updated);
  return updated;
}

export function updateEntry(id: string, updates: Partial<Pick<JournalEntry, "title" | "content" | "mood" | "tags">>): JournalEntry[] {
  const entries = getEntries().map((e) => {
    if (e.id !== id) return e;
    const content = updates.content ?? e.content;
    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
    return { ...e, ...updates, wordCount, updatedAt: new Date().toISOString() };
  });
  saveEntries(entries);
  return entries;
}

export function deleteEntry(id: string): JournalEntry[] {
  const entries = getEntries().filter((e) => e.id !== id);
  saveEntries(entries);
  return entries;
}

export type { Mood };
