/**
 * Ascend AI — Goal Form
 */

"use client";

import * as React from "react";
import { Input } from "@/presentation/ui/input";
import { Textarea } from "@/presentation/ui/textarea";
import { Button } from "@/presentation/ui/button";
import { CalendarIcon, AlertCircle } from "lucide-react";
import type {
  Goal,
  GoalCategory,
  GoalPriority,
  GoalStatus,
  CreateGoalPayload,
  UpdateGoalPayload,
} from "@/domain/entities/Goal";

const CATEGORIES: GoalCategory[] = [
  "health",
  "career",
  "learning",
  "finance",
  "relationships",
  "mindfulness",
  "creativity",
  "other",
];

const PRIORITIES: GoalPriority[] = ["low", "medium", "high"];
const STATUSES: GoalStatus[] = ["active", "paused", "completed", "archived"];

interface GoalFormProps {
  initialValues?: Partial<Goal>;
  onSubmit: (payload: CreateGoalPayload | UpdateGoalPayload) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  error?: string | null;
  mode?: "create" | "edit";
}

interface FormErrors {
  title?: string;
  targetDate?: string;
}

export function GoalForm({
  initialValues,
  onSubmit,
  onCancel,
  isLoading,
  error,
  mode = "create",
}: GoalFormProps) {
  const [title, setTitle] = React.useState(initialValues?.title ?? "");
  const [description, setDescription] = React.useState(
    initialValues?.description ?? ""
  );
  const [category, setCategory] = React.useState<GoalCategory>(
    initialValues?.category ?? "other"
  );
  const [priority, setPriority] = React.useState<GoalPriority>(
    initialValues?.priority ?? "medium"
  );
  const [status, setStatus] = React.useState<GoalStatus>(
    initialValues?.status ?? "active"
  );
  const [progress, setProgress] = React.useState<number>(
    initialValues?.progress ?? 0
  );
  const [targetDate, setTargetDate] = React.useState(
    initialValues?.targetDate ?? ""
  );
  const [formErrors, setFormErrors] = React.useState<FormErrors>({});

  const validate = (): boolean => {
    const errors: FormErrors = {};
    if (!title.trim()) {
      errors.title = "Goal title is required.";
    }
    if (targetDate) {
      const date = new Date(targetDate);
      if (isNaN(date.getTime())) {
        errors.targetDate = "Invalid date.";
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload: CreateGoalPayload | UpdateGoalPayload = {
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      status,
      ...(mode === "edit" && { progress }),
      ...(targetDate ? { targetDate } : {}),
    };

    onSubmit(payload);
  };

  const selectClass =
    "flex h-11 w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/20 focus-visible:border-brand-500/50 transition-all";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-2">
      {/* Server error */}
      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-error/30 bg-error/5 px-4 py-3 text-sm text-error">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <Input
        label="Goal Title *"
        placeholder="What do you want to achieve?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={formErrors.title}
        required
      />

      <Textarea
        label="Description"
        placeholder="Why is this important to you? What's the impact?"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
        maxCount={500}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Category */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-primary ml-0.5">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as GoalCategory)}
            className={selectClass}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Priority */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-primary ml-0.5">
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as GoalPriority)}
            className={selectClass}
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Status (edit mode only) */}
        {mode === "edit" && (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-primary ml-0.5">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as GoalStatus)}
              className={selectClass}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Target Date */}
        <Input
          label="Target Date (Optional)"
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          leftAdornment={<CalendarIcon className="h-4 w-4" />}
          error={formErrors.targetDate}
        />
      </div>

      {/* Progress slider (edit mode only) */}
      {mode === "edit" && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-text-primary ml-0.5">
              Progress
            </label>
            <span className="text-sm font-medium text-brand-500">
              {progress}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            className="w-full h-2 bg-surface-hover rounded-full appearance-none cursor-pointer accent-brand-500"
          />
        </div>
      )}

      <div className="flex justify-end gap-3 mt-2 pt-4 border-t border-border">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading} disabled={!title.trim()}>
          {mode === "create" ? "Create Goal" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
