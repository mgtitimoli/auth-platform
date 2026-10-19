"use client";

import type {FormEvent, ReactNode} from "react";

import {Button} from "@/client/components/button";

import * as styles from "./form.css";

type Props = {
  children: ReactNode;
  error?: string;
  isDisabled?: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => unknown;
  submitLabel: string;
};

const Form = ({
  children,
  error,
  isDisabled = false,
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
      <Button type="submit">{submitLabel}</Button>
    </fieldset>
  </form>
);

export {Form};
