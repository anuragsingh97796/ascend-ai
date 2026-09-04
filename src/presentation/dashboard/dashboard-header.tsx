/**
 * Ascend AI — Dashboard Header Component
 */

"use client";

import * as React from "react";
import {
  useCurrentUser,
  useLogoutMutation,
} from "@/application/hooks/useAuthHooks";
import { Bell, Search } from "lucide-react";
import { Button } from "@/presentation/ui/button";

interface DashboardHeaderProps {
  title?: string;
  subtitle?: string;
}

export function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  const { data: user } = useCurrentUser();
  const logout = useLogoutMutation();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 mb-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
          {title ??
            `${getGreeting()}, ${user?.name?.split(" ")[0] ?? "there"} 👋`}
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          {subtitle ?? "Here's a summary of your progress today."}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-text-secondary hover:text-text-primary"
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-text-secondary hover:text-text-primary"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </Button>
        <button
          onClick={() => logout.mutate()}
          className="h-8 w-8 rounded-full bg-brand-500/20 text-brand-600 flex items-center justify-center font-bold ml-2 cursor-pointer border border-brand-500/30 hover:bg-brand-500/30 transition-colors text-sm"
          title="Sign out"
          aria-label="Sign out"
        >
          {initials}
        </button>
      </div>
    </header>
  );
}
