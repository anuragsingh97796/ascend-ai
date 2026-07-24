/**
 * Ascend AI — Input Component
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  "flex h-11 w-full rounded-xl border bg-surface px-3 py-2 text-sm text-text-primary ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-disabled focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
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

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  helperText?: string;
  leftAdornment?: React.ReactNode;
  rightAdornment?: React.ReactNode;
  wrapperClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, variant, label, error, helperText, leftAdornment, rightAdornment, wrapperClassName, id, ...props },
    ref
  ) => {
    const inputId = id ?? React.useId();
    const isError = Boolean(error);
    const activeVariant = isError ? "error" : variant;

    return (
      <div className={cn("flex flex-col gap-1.5 w-full", wrapperClassName)}>
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-text-primary ml-0.5">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftAdornment && (
            <div className="absolute left-3 flex items-center justify-center text-text-tertiary pointer-events-none">
              {leftAdornment}
            </div>
          )}
          <input
            id={inputId}
            className={cn(
              inputVariants({ variant: activeVariant }),
              leftAdornment && "pl-9",
              rightAdornment && "pr-9",
              className
            )}
            ref={ref}
            aria-invalid={isError}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            {...props}
          />
          {rightAdornment && (
            <div className="absolute right-3 flex items-center justify-center">
              {rightAdornment}
            </div>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} className="text-xs text-error font-medium ml-0.5 animate-in slide-in-from-top-1 fade-in-50 duration-200">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="text-xs text-text-tertiary ml-0.5">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
