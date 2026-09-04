"use client";

import * as React from "react";
import { DashboardHeader } from "@/presentation/dashboard/dashboard-header";
import { HabitCard } from "@/presentation/components/habits/habit-card";
import { HabitForm } from "@/presentation/components/habits/habit-form";
import { HabitDeleteDialog } from "@/presentation/components/habits/habit-delete-dialog";
import { StreakCalendar } from "@/presentation/components/habits/streak-calendar";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
} from "@/presentation/ui/modal";
import { Button } from "@/presentation/ui/button";
import { Card, CardContent } from "@/presentation/ui/card";
import {
  useHabits,
  useAllHabitStats,
  useCreateHabit,
  useUpdateHabit,
  useDeleteHabit,
  useCompleteHabit,
  useUncompleteHabit,
} from "@/application/hooks/useHabitsHooks";
const extractApiError = (e: unknown): string =>
  e instanceof Error ? e.message : "An error occurred";
import {
  Plus,
  Flame,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import type {
  Habit,
  HabitStats,
  CreateHabitPayload,
  UpdateHabitPayload,
} from "@/domain/entities/Habit";

export default function HabitsPage() {
  const {
    data: habits,
    isLoading: habitsLoading,
    isError,
    error,
  } = useHabits();
  const { data: allStats, isLoading: statsLoading } = useAllHabitStats();
  const createHabit = useCreateHabit();
  const updateHabit = useUpdateHabit();
  const deleteHabit = useDeleteHabit();
  const completeHabit = useCompleteHabit();
  const uncompleteHabit = useUncompleteHabit();

  const [createOpen, setCreateOpen] = React.useState(false);
  const [editHabit, setEditHabit] = React.useState<Habit | null>(null);
  const [deleteHabit_, setDeleteHabit] = React.useState<Habit | null>(null);

  const isLoading = habitsLoading || statsLoading;

  // Build a stats map for O(1) lookup
  const statsMap = React.useMemo(() => {
    const map: Record<string, HabitStats> = {};
    allStats?.forEach((s) => {
      map[s.habitId] = s;
    });
    return map;
  }, [allStats]);

  // Aggregate stats
  const activeHabits = habits?.filter((h) => h.status === "active") ?? [];
  const completedToday = allStats?.filter((s) => s.completedToday).length ?? 0;
  const bestStreak =
    allStats?.reduce((max, s) => Math.max(max, s.currentStreak), 0) ?? 0;
  const avgRate =
    allStats && allStats.length > 0
      ? Math.round(
          allStats.reduce((sum, s) => sum + s.completionRate, 0) /
            allStats.length
        )
      : 0;

  const handleCreate = (payload: CreateHabitPayload | UpdateHabitPayload) => {
    createHabit.mutate(payload as CreateHabitPayload, {
      onSuccess: () => setCreateOpen(false),
    });
  };

  const handleUpdate = (payload: CreateHabitPayload | UpdateHabitPayload) => {
    if (!editHabit) return;
    updateHabit.mutate(
      { id: editHabit.id, updates: payload as UpdateHabitPayload },
      { onSuccess: () => setEditHabit(null) }
    );
  };

  const handleDelete = (id: string) => {
    deleteHabit.mutate(id, {
      onSuccess: () => setDeleteHabit(null),
    });
  };

  const handleToggle = (habitId: string, completedToday: boolean) => {
    const habit = habits?.find((h) => h.id === habitId);
    if (!habit) return;
    if (completedToday) {
      uncompleteHabit.mutate(habit);
    } else {
      completeHabit.mutate(habit);
    }
  };

  const isTogglingId = completeHabit.isPending
    ? completeHabit.variables?.id
    : uncompleteHabit.isPending
      ? uncompleteHabit.variables?.id
      : null;

  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader
        title="Habits"
        subtitle="Build consistent routines that compound over time."
      />

      {/* Stats strip */}
      {!isLoading && activeHabits.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <StatChip
            icon={<CheckCircle2 className="h-4 w-4" />}
            label="Done Today"
            value={`${completedToday} / ${activeHabits.length}`}
          />
          <StatChip
            icon={<Flame className="h-4 w-4" />}
            label="Best Streak"
            value={`${bestStreak} days`}
          />
          <StatChip
            icon={<TrendingUp className="h-4 w-4" />}
            label="Weekly Rate"
            value={`${avgRate}%`}
          />
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-text-primary">
          {activeHabits.length > 0 &&
            `${activeHabits.length} Active Habit${activeHabits.length !== 1 ? "s" : ""}`}
        </h2>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Habit
        </Button>
      </div>

      {/* Habit list */}
      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-16 rounded-xl border border-border bg-surface animate-pulse"
            />
          ))}
        </div>
      ) : isError ? (
        <ErrorState message={extractApiError(error)} />
      ) : activeHabits.length === 0 ? (
        <EmptyState onCreateClick={() => setCreateOpen(true)} />
      ) : (
        <div className="flex flex-col gap-3">
          {activeHabits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              stats={statsMap[habit.id]}
              onEdit={setEditHabit}
              onDelete={setDeleteHabit}
              onToggle={handleToggle}
              isTogglingCompletion={isTogglingId === habit.id}
              isDeleting={
                deleteHabit.isPending && deleteHabit.variables === habit.id
              }
            />
          ))}
        </div>
      )}

      {/* Streak calendars */}
      {!isLoading && activeHabits.length > 0 && allStats && (
        <div className="flex flex-col gap-4">
          <h2 className="font-semibold text-text-primary">Streak History</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {activeHabits.map((habit) => {
              const stats = statsMap[habit.id];
              if (!stats) return null;
              return (
                <StreakCalendar key={habit.id} habit={habit} stats={stats} />
              );
            })}
          </div>
        </div>
      )}

      {/* Create Modal */}
      <Modal open={createOpen} onOpenChange={(o) => !o && setCreateOpen(false)}>
        <ModalContent className="max-w-xl">
          <ModalHeader>
            <ModalTitle>Create New Habit</ModalTitle>
            <ModalDescription>
              Small daily actions compound into extraordinary results.
            </ModalDescription>
          </ModalHeader>
          <HabitForm
            mode="create"
            onSubmit={handleCreate}
            onCancel={() => setCreateOpen(false)}
            isLoading={createHabit.isPending}
            error={
              createHabit.error ? extractApiError(createHabit.error) : null
            }
          />
        </ModalContent>
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={Boolean(editHabit)}
        onOpenChange={(o) => !o && setEditHabit(null)}
      >
        <ModalContent className="max-w-xl">
          <ModalHeader>
            <ModalTitle>Edit Habit</ModalTitle>
            <ModalDescription>Update your habit details.</ModalDescription>
          </ModalHeader>
          {editHabit && (
            <HabitForm
              mode="edit"
              initialValues={editHabit}
              onSubmit={handleUpdate}
              onCancel={() => setEditHabit(null)}
              isLoading={updateHabit.isPending}
              error={
                updateHabit.error ? extractApiError(updateHabit.error) : null
              }
            />
          )}
        </ModalContent>
      </Modal>

      {/* Delete Dialog */}
      <HabitDeleteDialog
        habit={deleteHabit_}
        open={Boolean(deleteHabit_)}
        onClose={() => setDeleteHabit(null)}
        onConfirm={handleDelete}
        isLoading={deleteHabit.isPending}
      />
    </div>
  );
}

/* ─── Stat Chip ───────────────────────────────────────── */

function StatChip({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card>
      <CardContent className="p-4 flex flex-col gap-1">
        <div className="flex items-center gap-2 text-text-secondary">
          <span className="text-brand-500">{icon}</span>
          <span className="text-xs font-medium">{label}</span>
        </div>
        <span className="text-xl font-bold text-text-primary">{value}</span>
      </CardContent>
    </Card>
  );
}

/* ─── Empty State ─────────────────────────────────────── */

function EmptyState({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="h-16 w-16 rounded-2xl bg-brand-500/10 flex items-center justify-center">
        <Flame className="h-8 w-8 text-brand-500" />
      </div>
      <div className="text-center">
        <h3 className="font-semibold text-text-primary mb-1">No habits yet</h3>
        <p className="text-sm text-text-secondary max-w-xs">
          Start building powerful daily routines. Small habits lead to big
          transformations.
        </p>
      </div>
      <Button onClick={onCreateClick}>
        <Plus className="h-4 w-4 mr-2" />
        Create your first habit
      </Button>
    </div>
  );
}

/* ─── Error State ─────────────────────────────────────── */

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <div className="h-12 w-12 rounded-xl bg-error/10 flex items-center justify-center">
        <AlertCircle className="h-6 w-6 text-error" />
      </div>
      <div className="text-center">
        <h3 className="font-semibold text-text-primary mb-1">
          Unable to load habits
        </h3>
        <p className="text-sm text-text-secondary">{message}</p>
      </div>
    </div>
  );
}
