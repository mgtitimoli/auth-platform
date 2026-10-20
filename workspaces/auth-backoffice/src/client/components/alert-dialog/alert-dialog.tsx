"use client";

import {AlertDialog as BaseAlertDialog} from "@base-ui/react/alert-dialog";
import type {ReactNode} from "react";

import {Button, buttonVariants} from "@/client/components/button";

import * as styles from "./alert-dialog.css";

type Props = {
  confirmLabel: string;
  description: ReactNode;
  error?: string;
  isConfirming?: boolean;
  isOpen: boolean;
  onConfirm: () => unknown;
  onOpenChange: (isOpen: boolean) => unknown;
  title: string;
};

// A confirmation for irreversible actions: unlike Dialog, it doesn't close on
// an outside click
const AlertDialog = ({
  confirmLabel,
  description,
  error,
  isConfirming = false,
  isOpen,
  onConfirm,
  onOpenChange,
  title
}: Props) => (
  <BaseAlertDialog.Root onOpenChange={onOpenChange} open={isOpen}>
    <BaseAlertDialog.Portal>
      <BaseAlertDialog.Backdrop className={styles.backdrop} />
      <BaseAlertDialog.Popup className={styles.popup}>
        <BaseAlertDialog.Title className={styles.title}>
          {title}
        </BaseAlertDialog.Title>
        <BaseAlertDialog.Description className={styles.description}>
          {description}
        </BaseAlertDialog.Description>
        {error !== undefined && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
        <div className={styles.actions}>
          <BaseAlertDialog.Close
            disabled={isConfirming}
            render={<Button variant={buttonVariants.secondary} />}
          >
            Cancel
          </BaseAlertDialog.Close>
          <Button
            disabled={isConfirming}
            onClick={onConfirm}
            variant={buttonVariants.danger}
          >
            {confirmLabel}
          </Button>
        </div>
      </BaseAlertDialog.Popup>
    </BaseAlertDialog.Portal>
  </BaseAlertDialog.Root>
);

export {AlertDialog};
