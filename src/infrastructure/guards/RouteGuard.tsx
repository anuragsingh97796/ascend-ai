"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/infrastructure/context/AuthContext";

interface RouteGuardProps {
  children: React.ReactNode;
  /** If true, redirects authenticated users away (for auth pages) */
  redirectIfAuthenticated?: boolean;
}

export function RouteGuard({
  children,
  redirectIfAuthenticated = false,
}: RouteGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated && !redirectIfAuthenticated) {
      router.replace("/auth/login");
    }
    if (isAuthenticated && redirectIfAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isLoading, redirectIfAuthenticated, router]);

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "2px solid rgba(255,255,255,0.1)",
            borderTopColor: "var(--accent)",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
      </div>
    );
  }

  if (!isAuthenticated && !redirectIfAuthenticated) return null;
  if (isAuthenticated && redirectIfAuthenticated) return null;

  return <>{children}</>;
}
