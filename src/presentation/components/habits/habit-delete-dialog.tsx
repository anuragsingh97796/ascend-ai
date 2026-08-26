/**
 * Ascend AI — Habit Delete Dialog
 */

"use client";

import * as React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
} from "@/presentation/ui/modal";
import { Button } from "@/presentation/ui/button";
import { AlertTriangle } from "lucide-react";
import type { Habit } from "@/domain/entities/Habit";

interface HabitDeleteDialogProps {
  habit: Habit | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (id: string) => void;
  isLoading?: boolean;
}

export function HabitDeleteDialog({
  habit,
  open,
  onClose,
  onConfirm,
  isLoading,
}: HabitDeleteDialogProps) {
  return (
    <Modal open={open} onOpenChange={(o) => !o && onClose()}>
      <ModalContent className="max-w-md">
        <ModalHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-error/10 text-error">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <ModalTitle>Delete Habit</ModalTitle>
          </div>
          <ModalDescription>
            Are you sure you want to delete{" "}
            <strong className="text-text-primary">
              &ldquo;{habit?.name}&rdquo;
            </strong>
            ? All completion history will be permanently lost.
          </ModalDescription>
        </ModalHeader>
        <ModalFooter className="gap-2 mt-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            isLoading={isLoading}
            onClick={() => habit && onConfirm(habit.id)}
          >
            Delete Habit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
