"use client";

import React, { useState } from "react";
import { GlassCard } from "@/presentation/components/ui/GlassCard";
import { PageTransition } from "@/presentation/components/ui/PageTransition";
import { Button } from "@/presentation/components/ui/Button";
import {
  useJournalEntries,
  useCreateJournalEntry,
  useUpdateJournalEntry,
  useDeleteJournalEntry,
} from "@/application/hooks/useJournalHooks";
import { Sparkles, Calendar, Trash2, Edit2, X } from "lucide-react";
import type { JournalEntry } from "@/domain/entities/Journal";

export default function JournalPage() {
  const { data: entries = [], isLoading } = useJournalEntries();
  const createMutation = useCreateJournalEntry();
  const updateMutation = useUpdateJournalEntry();
  const deleteMutation = useDeleteJournalEntry();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [formError, setFormError] = useState("");

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const openCreateModal = () => {
    setEditingEntry(null);
    setTitle("");
    setContent("");
    setTagsInput("");
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setTitle(entry.title);
    setContent(entry.content);
    setTagsInput(entry.tags.join(", "));
    setFormError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setFormError("Title is required");
      return;
    }
    if (!content.trim()) {
      setFormError("Content is required");
      return;
    }

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim().replace(/^#/, ""))
      .filter(Boolean);

    try {
      if (editingEntry) {
        await updateMutation.mutateAsync({
          id: editingEntry.id,
          updates: { title: title.trim(), content: content.trim(), tags, mood: "reflective" as any },
        });
      } else {
        await createMutation.mutateAsync({
          title: title.trim(),
          content: content.trim(),
          tags: tags.length > 0 ? tags : ["daily"],
          mood: "reflective" as any,
        });
      }
      closeModal();
    } catch (err: any) {
      setFormError(err.message || "An error occurred");
    }
  };

  const handleDelete = async (id: string, entryTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${entryTitle}"?`)) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err) {
        alert("Failed to delete journal entry.");
      }
    }
  };

  return (
    <PageTransition>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: 32,
        }}
      >
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>
            Journal
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Reflect on your progress and capture your thoughts.
          </p>
        </div>
        <Button variant="primary" onClick={openCreateModal}>New Entry</Button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {isLoading && (
          <div className="text-gray-400">Loading journal entries...</div>
        )}
        {!isLoading && entries.length === 0 && (
          <div className="text-gray-400 text-center py-12">
            No journal entries yet. Capture your first thought.
          </div>
        )}
        {entries.map((entry, i) => (
          <GlassCard key={entry.id} delay={i * 0.1}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 16,
              }}
            >
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>
                  {entry.title}
                </h3>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    fontSize: 12,
                    color: "var(--text-secondary)",
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Calendar size={12} /> {formatDate(entry.createdAt)}
                  </span>
                  <span>{entry.wordCount} words</span>
                  <span style={{ fontSize: 16 }}>{entry.mood}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ display: "flex", gap: 6 }}>
                  {entry.tags.map((tag) => (
                    <span
                      key={tag}
                      className="badge bg-background-secondary text-text-secondary border-glass-border"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => openEditModal(entry)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)" }}
                  title="Edit Entry"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(entry.id, entry.title)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444" }}
                  title="Delete Entry"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <p
              style={{
                fontSize: 14,
                color: "var(--text-primary)",
                lineHeight: 1.6,
                marginBottom: 20,
              }}
            >
              {entry.content}
            </p>

            {entry.aiInsight && (
              <div
                style={{
                  background: "rgba(94, 106, 210, 0.1)",
                  border: "1px solid rgba(94, 106, 210, 0.2)",
                  borderRadius: "var(--radius-sm)",
                  padding: 16,
                  display: "flex",
                  gap: 12,
                }}
              >
                <div style={{ color: "var(--accent)", marginTop: 2 }}>
                  <Sparkles size={16} />
                </div>
                <div>
                  <p
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "var(--accent)",
                      marginBottom: 4,
                    }}
                  >
                    AI Insight
                  </p>
                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--text-secondary)",
                      lineHeight: 1.5,
                    }}
                  >
                    {entry.aiInsight}
                  </p>
                </div>
              </div>
            )}
          </GlassCard>
        ))}
      </div>

      {isModalOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex", justifyContent: "center", alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "var(--background)",
            border: "1px solid var(--glass-border)",
            borderRadius: "var(--radius-lg)",
            padding: "24px",
            width: "100%",
            maxWidth: "500px",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 style={{ fontSize: 20, fontWeight: 600 }}>{editingEntry ? "Edit Entry" : "New Entry"}</h2>
              <button onClick={closeModal} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)" }}>
                <X size={20} />
              </button>
            </div>
            {formError && <div style={{ color: "#ef4444", marginBottom: 16, fontSize: 14 }}>{formError}</div>}
            
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
              <div>
                <label style={{ display: "block", fontSize: 14, marginBottom: 4 }}>Title</label>
                <input 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--glass-border)", background: "rgba(255, 255, 255, 0.05)", color: "var(--text-primary)" }}
                  placeholder="e.g., Morning Reflections"
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 14, marginBottom: 4 }}>Content</label>
                <textarea 
                  value={content} 
                  onChange={(e) => setContent(e.target.value)}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--glass-border)", background: "rgba(255, 255, 255, 0.05)", color: "var(--text-primary)", minHeight: "120px", resize: "vertical" }}
                  placeholder="What's on your mind today?"
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 14, marginBottom: 4 }}>Tags (comma-separated)</label>
                <input 
                  value={tagsInput} 
                  onChange={(e) => setTagsInput(e.target.value)}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--glass-border)", background: "rgba(255, 255, 255, 0.05)", color: "var(--text-primary)" }}
                  placeholder="e.g., gratitude, focus, habits"
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <Button variant="ghost" onClick={closeModal}>Cancel</Button>
              <Button variant="primary" onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Entry"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageTransition>
  );
}

