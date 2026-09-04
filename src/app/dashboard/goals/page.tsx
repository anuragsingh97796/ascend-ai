"use client";

import * as React from "react";
import { DashboardHeader } from "@/presentation/dashboard/dashboard-header";
import { GoalCard } from "@/presentation/components/goals/goal-card";
import { GoalForm } from "@/presentation/components/goals/goal-form";
import { GoalDeleteDialog } from "@/presentation/components/goals/goal-delete-dialog";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
} from "@/presentation/ui/modal";
import { Button } from "@/presentation/ui/button";
import {
  useGoals,
  useCreateGoal,
  useUpdateGoal,
  useDeleteGoal,
} from "@/application/hooks/useGoalsHooks";
const extractApiError = (e: unknown): string =>
  e instanceof Error ? e.message : "An error occurred";
import { Plus, Target, AlertCircle } from "lucide-react";
import type {
  Goal,
  GoalStatus,
  CreateGoalPayload,
  UpdateGoalPayload,
} from "@/domain/entities/Goal";

type FilterTab = GoalStatus | "all";

const FILTER_TABS: { value: FilterTab; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "paused", label: "Paused" },
  { value: "archived", label: "Archived" },
];

export default function GoalsPage() {
  const { data: goals, isLoading, isError, error } = useGoals();
  const createGoal = useCreateGoal();
  const updateGoal = useUpdateGoal();
  const deleteGoal = useDeleteGoal();

  const [filter, setFilter] = React.useState<FilterTab>("all");
  const [createOpen, setCreateOpen] = React.useState(false);
  const [editGoal, setEditGoal] = React.useState<Goal | null>(null);
  const [deleteGoal_, setDeleteGoal] = React.useState<Goal | null>(null);

  // Filtered goals
  const filtered = React.useMemo(() => {
    if (!goals) return [];
    if (filter === "all") return goals;
    return goals.filter((g) => g.status === filter);
  }, [goals, filter]);

  // Count per tab
  const counts = React.useMemo(() => {
    const c: Record<string, number> = { all: goals?.length ?? 0 };
    FILTER_TABS.slice(1).forEach(({ value }) => {
      c[value] = goals?.filter((g) => g.status === value).length ?? 0;
    });
    return c;
  }, [goals]);

  const handleCreate = (payload: CreateGoalPayload | UpdateGoalPayload) => {
    createGoal.mutate(
      {
        ...(payload as CreateGoalPayload),
        milestones: [],
      },
      {
        onSuccess: () => setCreateOpen(false),
      }
    );
  };

  const handleUpdate = (payload: CreateGoalPayload | UpdateGoalPayload) => {
    if (!editGoal) return;
    updateGoal.mutate(
      { id: editGoal.id, updates: payload as UpdateGoalPayload },
      { onSuccess: () => setEditGoal(null) }
    );
  };

  const handleDelete = (id: string) => {
    deleteGoal.mutate(id, {
      onSuccess: () => setDeleteGoal(null),
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader
        title="Goals"
        subtitle="Track your progress toward what matters most."
      />

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Filter tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {FILTER_TABS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                filter === value
                  ? "bg-brand-500/10 text-brand-500 border border-brand-500/20"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"
              }`}
            >
              {label}
              {counts[value] > 0 && (
                <span
                  className={`text-xs rounded-full px-1.5 ${
                    filter === value
                      ? "bg-brand-500/20 text-brand-500"
                      : "bg-surface-hover text-text-tertiary"
                  }`}
                >
                  {counts[value]}
                </span>
              )}
            </button>
          ))}
        </div>

        <Button onClick={() => setCreateOpen(true)} className="shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          New Goal
        </Button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-48 rounded-2xl border border-border bg-surface animate-pulse"
            />
          ))}
        </div>
      ) : isError ? (
        <ErrorState message={extractApiError(error)} />
      ) : filtered.length === 0 ? (
        <EmptyState filter={filter} onCreateClick={() => setCreateOpen(true)} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={setEditGoal}
              onDelete={setDeleteGoal}
              isDeleting={
                deleteGoal.isPending && deleteGoal.variables === goal.id
              }
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal open={createOpen} onOpenChange={(o) => !o && setCreateOpen(false)}>
        <ModalContent className="max-w-xl">
          <ModalHeader>
            <ModalTitle>Create New Goal</ModalTitle>
            <ModalDescription>
              Define a meaningful goal and track your progress.
            </ModalDescription>
          </ModalHeader>
          <GoalForm
            mode="create"
            onSubmit={handleCreate}
            onCancel={() => setCreateOpen(false)}
            isLoading={createGoal.isPending}
            error={createGoal.error ? extractApiError(createGoal.error) : null}
          />
        </ModalContent>
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={Boolean(editGoal)}
        onOpenChange={(o) => !o && setEditGoal(null)}
      >
        <ModalContent className="max-w-xl">
          <ModalHeader>
            <ModalTitle>Edit Goal</ModalTitle>
            <ModalDescription>
              Update the details of your goal.
            </ModalDescription>
          </ModalHeader>
          {editGoal && (
            <GoalForm
              mode="edit"
              initialValues={editGoal}
              onSubmit={handleUpdate}
              onCancel={() => setEditGoal(null)}
              isLoading={updateGoal.isPending}
              error={
                updateGoal.error ? extractApiError(updateGoal.error) : null
              }
            />
          )}
        </ModalContent>
      </Modal>

      {/* Delete Dialog */}
      <GoalDeleteDialog
        goal={deleteGoal_}
        open={Boolean(deleteGoal_)}
        onClose={() => setDeleteGoal(null)}
        onConfirm={handleDelete}
        isLoading={deleteGoal.isPending}
      />
    </div>
  );
}

/* ─── Empty State ─────────────────────────────────────── */

function EmptyState({
  filter,
  onCreateClick,
}: {
  filter: FilterTab;
  onCreateClick: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="h-16 w-16 rounded-2xl bg-brand-500/10 flex items-center justify-center">
        <Target className="h-8 w-8 text-brand-500" />
      </div>
      <div className="text-center">
        <h3 className="font-semibold text-text-primary mb-1">
          {filter === "all" ? "No goals yet" : `No ${filter} goals`}
        </h3>
        <p className="text-sm text-text-secondary max-w-xs">
          {filter === "all"
            ? "Create your first goal to start tracking your progress."
            : `You don't have any ${filter} goals right now.`}
        </p>
      </div>
      {filter === "all" && (
        <Button onClick={onCreateClick}>
          <Plus className="h-4 w-4 mr-2" />
          Create your first goal
        </Button>
      )}
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
          Unable to load goals
        </h3>
        <p className="text-sm text-text-secondary">{message}</p>
      </div>
    </div>
  );
}
