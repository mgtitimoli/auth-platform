"use client";

import {Toast} from "@base-ui/react/toast";
import {X} from "lucide-react";
import type {ReactNode} from "react";

import * as styles from "./toast.css";

type Props = {
  children: ReactNode;
};

const ToastViewport = () => {
  const {toasts} = Toast.useToastManager();

  return (
    <Toast.Portal>
      <Toast.Viewport className={styles.viewport}>
        {toasts.map(toast => (
          <Toast.Root className={styles.root} key={toast.id} toast={toast}>
            <Toast.Title className={styles.title} />
            <Toast.Close aria-label="Close" className={styles.close}>
              <X size={16} />
            </Toast.Close>
          </Toast.Root>
        ))}
      </Toast.Viewport>
    </Toast.Portal>
  );
};

const ToastProvider = ({children}: Props) => (
  <Toast.Provider>
    {children}
    <ToastViewport />
  </Toast.Provider>
);

export {ToastProvider};
