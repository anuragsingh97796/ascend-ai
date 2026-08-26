/**
 * Ascend AI — Habit Form Component
 */

"use client";

import * as React from "react";
import { Input } from "@/presentation/ui/input";
import { Textarea } from "@/presentation/ui/textarea";
import { Button } from "@/presentation/ui/button";
import { AlertCircle } from "lucide-react";
import type {
  Habit,
  HabitColor,
  HabitFrequency,
  CreateHabitPayload,
  UpdateHabitPayload,
} from "@/domain/entities/Habit";

const EMOJIS = [
  "🧘",
  "🏃",
  "💧",
  "📖",
  "💻",
  "🥗",
  "💤",
  "✍️",
  "🎨",
  "🎵",
  "🏋️",
  "🚴",
];

const COLORS: { value: HabitColor; class: string; label: string }[] = [
  { value: "purple", class: "bg-brand-500", label: "Purple" },
  { value: "cyan", class: "bg-cyan-500", label: "Cyan" },
  { value: "emerald", class: "bg-emerald-500", label: "Green" },
  { value: "amber", class: "bg-amber-500", label: "Amber" },
  { value: "rose", class: "bg-rose-500", label: "Rose" },
  { value: "indigo", class: "bg-indigo-500", label: "Indigo" },
];

const FREQUENCIES: { value: HabitFrequency; label: string }[] = [
  { value: "daily", label: "Every day" },
  { value: "weekdays", label: "Weekdays (Mon–Fri)" },
  { value: "weekends", label: "Weekends (Sat–Sun)" },
  { value: "weekly", label: "Once a week" },
];

interface HabitFormProps {
  initialValues?: Partial<Habit>;
  onSubmit: (payload: CreateHabitPayload | UpdateHabitPayload) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  error?: string | null;
  mode?: "create" | "edit";
}

interface FormErrors {
  name?: string;
  startDate?: string;
}

export function HabitForm({
  initialValues,
  onSubmit,
  onCancel,
  isLoading,
  error,
  mode = "create",
}: HabitFormProps) {
  const [name, setName] = React.useState(initialValues?.name ?? "");
  const [description, setDescription] = React.useState(
    initialValues?.description ?? ""
  );
  const [icon, setIcon] = React.useState(initialValues?.icon ?? EMOJIS[0]);
  const [color, setColor] = React.useState<HabitColor>(
    initialValues?.color ?? "purple"
  );
  const [frequency, setFrequency] = React.useState<HabitFrequency>(
    initialValues?.frequency ?? "daily"
  );
  const [startDate, setStartDate] = React.useState(
    initialValues?.startDate ?? new Date().toISOString().split("T")[0]
  );
  const [formErrors, setFormErrors] = React.useState<FormErrors>({});

  const validate = (): boolean => {
    const errors: FormErrors = {};
    if (!name.trim()) {
      errors.name = "Habit name is required.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (mode === "create") {
      const payload: CreateHabitPayload = {
        name: name.trim(),
        description: description.trim() || undefined,
        icon,
        color,
        frequency,
        startDate,
      };
      onSubmit(payload);
    } else {
      const payload: UpdateHabitPayload = {
        name: name.trim(),
        description: description.trim() || undefined,
        icon,
        color,
        frequency,
      };
      onSubmit(payload);
    }
  };

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
        label="Habit Name *"
        placeholder="e.g. Drink 2L of water"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={formErrors.name}
        required
      />

      <Textarea
        label="Description (Optional)"
        placeholder="What does this habit mean to you?"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
      />

      {/* Icon picker */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-text-primary ml-0.5">
          Icon
        </label>
        <div className="flex flex-wrap gap-2">
          {EMOJIS.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setIcon(e)}
              className={`flex h-10 w-10 items-center justify-center rounded-xl border text-xl transition-all ${
                icon === e
                  ? "border-brand-500 bg-brand-500/10"
                  : "border-border bg-surface hover:bg-surface-hover"
              }`}
              aria-label={`Select ${e} icon`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      {/* Color picker */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-text-primary ml-0.5">
          Color
        </label>
        <div className="flex gap-2">
          {COLORS.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setColor(c.value)}
              className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${
                color === c.value
                  ? "ring-2 ring-offset-2 ring-brand-500 scale-110"
                  : "opacity-70 hover:opacity-100"
              } ${c.class}`}
              aria-label={`Select ${c.label} color`}
            />
          ))}
        </div>
      </div>

      {/* Frequency */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-text-primary ml-0.5">
          Frequency
        </label>
        <div className="grid grid-cols-2 gap-2">
          {FREQUENCIES.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFrequency(f.value)}
              className={`px-3 py-2.5 rounded-xl border text-sm text-left transition-all ${
                frequency === f.value
                  ? "border-brand-500 bg-brand-500/10 text-brand-500"
                  : "border-border bg-surface hover:bg-surface-hover text-text-secondary"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Start Date (create mode only) */}
      {mode === "create" && (
        <Input
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          error={formErrors.startDate}
        />
      )}

      <div className="flex justify-end gap-3 mt-2 pt-4 border-t border-border">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading} disabled={!name.trim()}>
          {mode === "create" ? "Create Habit" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
