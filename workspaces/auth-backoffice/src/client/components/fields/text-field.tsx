"use client";

import {Field} from "@base-ui/react/field";
import type {ComponentProps} from "react";

import * as styles from "./text-field.css";

type FieldControlProps = ComponentProps<typeof Field.Control>;

type ExposedFieldControlProps = Omit<FieldControlProps, "className">;

type Props = ExposedFieldControlProps & {
  error?: string;
  label: string;
};

const TextField = ({error, label, ...controlProps}: Props) => (
  <Field.Root className={styles.root} invalid={error !== undefined}>
    <Field.Label className={styles.label}>{label}</Field.Label>
    <Field.Control className={styles.input} {...controlProps} />
    <Field.Error className={styles.error} match={error !== undefined}>
      {error}
    </Field.Error>
  </Field.Root>
);

export {TextField};
