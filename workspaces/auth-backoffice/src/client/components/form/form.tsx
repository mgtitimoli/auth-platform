"use client";

import type {FormEvent, ReactNode} from "react";

import {Button, buttonVariants} from "@/client/components/button";

import * as styles from "./form.css";

type Props = {
  children: ReactNode;
  error?: string;
  isDisabled?: boolean;
  // Only the submit button, e.g. until there's something to save
  isSubmitDisabled?: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => unknown;
  submitLabel: string;
};

const Form = ({
  children,
  error,
  isDisabled = false,
  isSubmitDisabled = false,
  onSubmit,
  submitLabel
}: Props) => (
  <form noValidate onSubmit={onSubmit}>
    <fieldset className={styles.fieldset} disabled={isDisabled}>
      {children}
      {error !== undefined && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      <div className={styles.actions}>
        <Button
          disabled={isSubmitDisabled}
          type="submit"
          variant={buttonVariants.primary}
        >
          {submitLabel}
        </Button>
      </div>
    </fieldset>
  </form>
);

export {Form};
