"use client";

import {Dialog as BaseDialog} from "@base-ui/react/dialog";
import {X} from "lucide-react";
import {useRef} from "react";
import type {ReactNode} from "react";

import * as styles from "./dialog.css";

type Props = {
  children: ReactNode;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => unknown;
  title: string;
};

const Dialog = ({children, isOpen, onOpenChange, title}: Props) => {
  const popupRef = useRef<HTMLDivElement>(null);

  // A form starts at its first field instead of the close button
  const getInitialFocus = () =>
    popupRef.current?.querySelector<HTMLElement>("input, select, textarea") ??
    true;

  return (
    <BaseDialog.Root onOpenChange={onOpenChange} open={isOpen}>
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className={styles.backdrop} />
        <BaseDialog.Popup
          className={styles.popup}
          initialFocus={getInitialFocus}
          ref={popupRef}
        >
          <BaseDialog.Title className={styles.title}>{title}</BaseDialog.Title>
          <BaseDialog.Close aria-label="Close" className={styles.close}>
            <X size={16} />
          </BaseDialog.Close>
          {children}
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
};

export {Dialog};
