"use client";

import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/infrastructure/context/AuthContext";
import { RouteGuard } from "@/infrastructure/guards/RouteGuard";
import { Loader2 } from "lucide-react";

function LoginForm() {
  const { signIn } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(email, password);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: "100%", maxWidth: 420 }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h1
            className="text-gradient"
            style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}
          >
            Ascend AI
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
            Sign in to your Transformation OS
          </p>
        </div>

        {/* Card */}
        <div className="glass-card" style={{ padding: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24 }}>
            Welcome back
          </h2>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <input
                id="email"
                className="form-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input
                id="password"
                className="form-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <p
                style={{
                  color: "var(--error)",
                  fontSize: 13,
                  background: "rgba(239,68,68,0.08)",
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "1px solid rgba(239,68,68,0.2)",
                }}
              >
                {error}
              </p>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "var(--radius-sm)",
                border: "none",
                background: loading
                  ? "rgba(94,106,210,0.4)"
                  : "linear-gradient(135deg, var(--aurora-1), var(--accent))",
                color: "#fff",
                fontWeight: 600,
                fontSize: 14,
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                marginTop: 4,
              }}
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Signing in…" : "Sign in"}
            </motion.button>
          </form>

          <p
            style={{
              textAlign: "center",
              marginTop: 24,
              fontSize: 13,
              color: "var(--text-secondary)",
            }}
          >
            New here?{" "}
            <Link
              href="/auth/register"
              style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}
            >
              Create an account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <RouteGuard redirectIfAuthenticated>
      <LoginForm />
    </RouteGuard>
  );
}
