/**
 * Ascend AI — Textarea Component
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const textareaVariants = cva(
  "flex min-h-[80px] w-full rounded-xl border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-disabled focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 resize-y",
  {
    variants: {
      variant: {
        default: "border-border hover:border-border/80 focus-visible:border-brand-500/50 focus-visible:ring-brand-500/20",
        error: "border-error/50 bg-error/5 focus-visible:border-error focus-visible:ring-error/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  label?: string;
  error?: string;
  helperText?: string;
  wrapperClassName?: string;
  maxCount?: number;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { className, variant, label, error, helperText, wrapperClassName, maxCount, id, value, onChange, ...props },
    ref
  ) => {
    const textareaId = id ?? React.useId();
    const isError = Boolean(error);
    const activeVariant = isError ? "error" : variant;

    const count = typeof value === "string" ? value.length : 0;
    const isOverLimit = maxCount ? count > maxCount : false;

    return (
      <div className={cn("flex flex-col gap-1.5 w-full", wrapperClassName)}>
        {label && (
          <label htmlFor={textareaId} className="text-sm font-medium text-text-primary ml-0.5">
            {label}
          </label>
        )}
        <div className="relative">
          <textarea
            id={textareaId}
            className={cn(textareaVariants({ variant: activeVariant }), className)}
            ref={ref}
            value={value}
            onChange={onChange}
            aria-invalid={isError || isOverLimit}
            aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
            {...props}
          />
        </div>
        <div className="flex items-start justify-between gap-4 ml-0.5">
          <div className="flex-1">
            {error && (
              <p id={`${textareaId}-error`} className="text-xs text-error font-medium animate-in slide-in-from-top-1 fade-in-50 duration-200">
                {error}
              </p>
            )}
            {helperText && !error && (
              <p id={`${textareaId}-helper`} className="text-xs text-text-tertiary">
                {helperText}
              </p>
            )}
          </div>
          {maxCount && (
            <p className={cn("text-[11px] shrink-0 mt-0.5", isOverLimit ? "text-error font-medium" : "text-text-disabled")}>
              {count} / {maxCount}
            </p>
          )}
        </div>
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
