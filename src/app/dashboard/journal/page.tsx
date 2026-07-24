"use client";

import React, { useState } from "react";
import { GlassCard } from "@/presentation/components/ui/GlassCard";
import { PageTransition } from "@/presentation/components/ui/PageTransition";
import { Button } from "@/presentation/components/ui/Button";
import { getEntries } from "@/application/services/journalService";
import type { JournalEntry } from "@/domain/entities/Journal";
import { Sparkles, Calendar } from "lucide-react";

export default function JournalPage() {
  const [entries] = useState<JournalEntry[]>(() => getEntries());

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <PageTransition>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>Journal</h1>
          <p style={{ color: "var(--text-secondary)" }}>Reflect on your progress and capture your thoughts.</p>
        </div>
        <Button variant="primary">New Entry</Button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {entries.map((entry, i) => (
          <GlassCard key={entry.id} delay={i * 0.1}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>{entry.title}</h3>
                <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 12, color: "var(--text-secondary)" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Calendar size={12} /> {formatDate(entry.createdAt)}
                  </span>
                  <span>{entry.wordCount} words</span>
                  <span style={{ fontSize: 16 }}>{entry.mood}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {entry.tags.map((tag) => (
                  <span key={tag} className="badge bg-background-secondary text-text-secondary border-glass-border">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <p style={{ fontSize: 14, color: "var(--text-primary)", lineHeight: 1.6, marginBottom: 20 }}>
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
                  <p style={{ fontSize: 12, fontWeight: 600, color: "var(--accent)", marginBottom: 4 }}>
                    AI Insight
                  </p>
                  <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                    {entry.aiInsight}
                  </p>
                </div>
              </div>
            )}
          </GlassCard>
        ))}
      </div>
    </PageTransition>
  );
}
