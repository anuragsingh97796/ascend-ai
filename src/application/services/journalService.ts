import type { JournalEntry, Mood } from "@/domain/entities/Journal";
import { apiClient } from "@/infrastructure/api/apiClient";

export async function getEntries(): Promise<JournalEntry[]> {
  const res = await apiClient.get("/journal");
  return res.data?.data || [];
}

export async function addEntry(
  entry: Omit<JournalEntry, "id" | "createdAt" | "updatedAt" | "wordCount">
): Promise<JournalEntry> {
  const wordCount = entry.content.trim().split(/\s+/).filter(Boolean).length;
  const payload = {
    ...entry,
    wordCount,
  };
  const res = await apiClient.post("/journal", payload);
  return res.data?.data;
}

export async function updateEntry(
  id: string,
  updates: Partial<Pick<JournalEntry, "title" | "content" | "mood" | "tags">>
): Promise<JournalEntry> {
  let wordCount;
  if (updates.content !== undefined) {
    wordCount = updates.content.trim().split(/\s+/).filter(Boolean).length;
  }
  const payload = {
    ...updates,
    ...(wordCount !== undefined ? { wordCount } : {}),
  };
  const res = await apiClient.put(`/journal/${id}`, payload);
  return res.data?.data;
}

export async function deleteEntry(id: string): Promise<string> {
  await apiClient.delete(`/journal/${id}`);
  return id;
}

export type { Mood };
