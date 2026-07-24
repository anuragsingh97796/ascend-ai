"use client";

import React, { useState } from "react";
import { GlassCard } from "@/presentation/components/ui/GlassCard";
import { PageTransition } from "@/presentation/components/ui/PageTransition";
import { Button } from "@/presentation/components/ui/Button";
import { getStoredAuth } from "@/application/services/authService";
import {
  User,
  Palette,
  Bell,
  Shield,
  Key,
  Download,
  Link2,
} from "lucide-react";

const SECTIONS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy", icon: Shield },
  { id: "security", label: "Security", icon: Key },
  { id: "export", label: "Data Export", icon: Download },
  { id: "connected", label: "Connected Accounts", icon: Link2 },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

export default function SettingsPage() {
  const auth = getStoredAuth();
  const user = auth?.user;
  const [activeTab, setActiveTab] = useState<SectionId>("profile");
  const [nameInput, setNameInput] = useState(user?.name || "");

  return (
    <PageTransition>
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 32,
        }}
      >
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>
            Settings Module
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Manage your profile, appearance, notifications, security, and data
            preferences.
          </p>
        </div>

        {/* Tab Strip */}
        <div
          style={{
            display: "flex",
            gap: 8,
            overflowX: "auto",
            paddingBottom: 8,
          }}
        >
          {SECTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 16px",
                borderRadius: 12,
                background:
                  activeTab === id
                    ? "rgba(139,92,246,0.15)"
                    : "rgba(255,255,255,0.03)",
                border:
                  activeTab === id
                    ? "1px solid rgba(139,92,246,0.3)"
                    : "1px solid rgba(255,255,255,0.05)",
                color:
                  activeTab === id
                    ? "var(--brand-400)"
                    : "var(--text-secondary)",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 13,
                whiteSpace: "nowrap",
              }}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        {/* Active Tab Panel */}
        <GlassCard>
          {activeTab === "profile" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
                maxWidth: 500,
              }}
            >
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>
                Profile Configuration
              </h3>
              <div>
                <label
                  style={{
                    fontSize: 12,
                    color: "var(--text-secondary)",
                    marginBottom: 4,
                    display: "block",
                  }}
                >
                  Full Name
                </label>
                <input
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="input-field"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 8,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#fff",
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    fontSize: 12,
                    color: "var(--text-secondary)",
                    marginBottom: 4,
                    display: "block",
                  }}
                >
                  Email
                </label>
                <input
                  value={user?.email || "user@ascend.ai"}
                  disabled
                  className="input-field"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 8,
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    color: "var(--text-tertiary)",
                  }}
                />
              </div>
              <Button variant="primary">Save Profile</Button>
            </div>
          )}

          {activeTab === "export" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
                maxWidth: 500,
              }}
            >
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>
                Data Export & Backup
              </h3>
              <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                Download your complete goals, habits, and journal logs in JSON
                format.
              </p>
              <Button variant="primary">
                <Download size={16} style={{ marginRight: 8 }} /> Export Full
                Archive
              </Button>
            </div>
          )}

          {activeTab !== "profile" && activeTab !== "export" && (
            <div>
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  marginBottom: 8,
                  textTransform: "capitalize",
                }}
              >
                {activeTab} Settings
              </h3>
              <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                Customization settings active for this module.
              </p>
            </div>
          )}
        </GlassCard>
      </div>
    </PageTransition>
  );
}
