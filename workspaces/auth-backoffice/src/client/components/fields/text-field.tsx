"use client";

import {Field} from "@base-ui/react/field";
import type {ComponentProps} from "react";

import * as styles from "./text-field.css";

type FieldControlProps = ComponentProps<typeof Field.Control>;

type ExposedFieldControlProps = Omit<FieldControlProps, "className">;

type Props = ExposedFieldControlProps & {
  description?: string;
  error?: string;
  label: string;
};

const TextField = ({description, error, label, ...controlProps}: Props) => (
  <Field.Root className={styles.root} invalid={error !== undefined}>
    <Field.Label className={styles.label}>{label}</Field.Label>
    <Field.Control className={styles.input} {...controlProps} />
    {description !== undefined && (
      <Field.Description className={styles.description}>
        {description}
      </Field.Description>
    )}
    <Field.Error className={styles.error} match={error !== undefined}>
      {error}
    </Field.Error>
  </Field.Root>
);

export {TextField};
