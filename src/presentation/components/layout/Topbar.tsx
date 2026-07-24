"use client";

import React from "react";
import { useAuth } from "@/infrastructure/context/AuthContext";
import { LogOut } from "lucide-react";
import { Button } from "@/presentation/components/ui/Button";

export function Topbar() {
  const { user, signOut } = useAuth();

  return (
    <header
      style={{
        height: "var(--header-height)",
        borderBottom: "1px solid var(--glass-border)",
        background: "rgba(0,0,0,0.4)",
        backdropFilter: "blur(24px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
      }}
    >
      <div style={{ flex: 1 }} />
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--aurora-1), var(--aurora-2))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {user?.avatarInitials}
          </div>
          <span style={{ fontSize: 14, fontWeight: 500 }}>{user?.name}</span>
        </div>
        <div style={{ width: 1, height: 24, background: "var(--glass-border)" }} />
        <button
          onClick={signOut}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--text-secondary)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
          }}
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </header>
  );
}
