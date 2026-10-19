"use client";

import {Button as BaseButton} from "@base-ui/react/button";
import type {ComponentProps} from "react";

import * as styles from "./button.css";

type BaseButtonProps = ComponentProps<typeof BaseButton>;

type ExposedBaseButtonProps = Omit<BaseButtonProps, "className">;

type Props = ExposedBaseButtonProps;

const Button = (props: Props) => (
  <BaseButton className={styles.root} {...props} />
);

export {Button};
