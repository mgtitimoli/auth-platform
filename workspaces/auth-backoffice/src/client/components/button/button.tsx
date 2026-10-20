"use client";

import {Button as BaseButton} from "@base-ui/react/button";
import type {ComponentProps} from "react";

import type {ButtonVariant} from "./button-variant";
import * as styles from "./button.css";

type BaseButtonProps = ComponentProps<typeof BaseButton>;

type ExposedBaseButtonProps = Omit<BaseButtonProps, "className">;

type Props = ExposedBaseButtonProps & {
  variant: ButtonVariant;
};

const Button = ({variant, ...buttonProps}: Props) => (
  <BaseButton className={styles.variants[variant]} {...buttonProps} />
);

export {Button};
