"use client";

import React, { useEffect, useState, useRef } from "react";
import { GlassCard } from "@/presentation/components/ui/GlassCard";
import { PageTransition } from "@/presentation/components/ui/PageTransition";
import { Orb } from "@/presentation/components/ui/Orb";
import { getHistory, sendMessage } from "@/application/services/coachService";
import type { ChatMessage } from "@/application/services/coachService";
import { Send, Loader2, AlertCircle } from "lucide-react";

export default function CoachPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadHistory() {
      try {
        const history = await getHistory();
        setMessages(history);
      } catch {
        setError("Failed to load chat history.");
      } finally {
        setInitialLoading(false);
      }
    }
    loadHistory();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const text = input.trim();
    setInput("");
    setError(null);

    // Optimistic UI for user message
    const tempUserMsg: ChatMessage = {
      id: "temp_" + Date.now(),
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);
    setLoading(true);

    try {
      const assistantMsg = await sendMessage(text);
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setError("Failed to send message to AI coach. Please try again.");
      // Remove the optimistic user message if we fail
      setMessages((prev) => prev.filter((m) => m.id !== tempUserMsg.id));
      setInput(text); // restore input
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "calc(100vh - 120px)",
          maxWidth: 800,
          margin: "0 auto",
        }}
      >
        {/* Header section with Orb */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            marginBottom: 32,
          }}
        >
          <div
            style={{ transform: "scale(0.8)", transformOrigin: "left center" }}
          >
            <Orb />
          </div>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>
              AI Coach
            </h1>
            <p style={{ color: "var(--text-secondary)" }}>
              Your personal guide for continuous growth.
            </p>
          </div>
        </div>

        {/* Chat Area */}
        <GlassCard
          className="flex-1"
          style={{
            display: "flex",
            flexDirection: "column",
            padding: 0,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: 24,
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            {initialLoading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: 40,
                }}
              >
                <Loader2
                  size={24}
                  className="animate-spin text-text-secondary"
                />
              </div>
            ) : messages.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  color: "var(--text-secondary)",
                  marginTop: 40,
                }}
              >
                Send a message to start your coaching session.
              </div>
            ) : (
              messages.map((msg) => {
                const isAssistant = msg.role === "assistant";
                return (
                  <div
                    key={msg.id}
                    style={{
                      display: "flex",
                      justifyContent: isAssistant ? "flex-start" : "flex-end",
                    }}
                  >
                    <div
                      style={{
                        maxWidth: "80%",
                        padding: "12px 16px",
                        borderRadius: "var(--radius-md)",
                        background: isAssistant
                          ? "rgba(255,255,255,0.05)"
                          : "var(--accent)",
                        color: "#fff",
                        fontSize: 14,
                        lineHeight: 1.5,
                        border: isAssistant
                          ? "1px solid var(--glass-border)"
                          : "none",
                        borderBottomLeftRadius: isAssistant
                          ? 4
                          : "var(--radius-md)",
                        borderBottomRightRadius: !isAssistant
                          ? 4
                          : "var(--radius-md)",
                      }}
                    >
                      {msg.content}
                    </div>
                  </div>
                );
              })
            )}

            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div
                  style={{
                    padding: "12px 16px",
                    borderRadius: "var(--radius-md)",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid var(--glass-border)",
                    borderBottomLeftRadius: 4,
                  }}
                >
                  <Loader2
                    size={16}
                    className="animate-spin text-text-secondary"
                  />
                </div>
              </div>
            )}
            {error && (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div
                  style={{
                    color: "var(--rose-400)",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 14,
                  }}
                >
                  <AlertCircle size={16} />
                  {error}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input Area */}
          <div
            style={{
              padding: "16px 24px",
              borderTop: "1px solid var(--glass-border)",
              background: "rgba(0,0,0,0.2)",
            }}
          >
            <form onSubmit={handleSend} style={{ display: "flex", gap: 12 }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your goals, habits, or routines..."
                className="form-input"
                style={{ flex: 1, background: "rgba(255,255,255,0.02)" }}
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                style={{
                  background:
                    input.trim() && !loading
                      ? "var(--accent)"
                      : "rgba(255,255,255,0.1)",
                  border: "none",
                  borderRadius: "var(--radius-sm)",
                  width: 44,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  cursor: input.trim() && !loading ? "pointer" : "not-allowed",
                  transition: "all 0.2s ease",
                }}
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </GlassCard>
      </div>
    </PageTransition>
  );
}
