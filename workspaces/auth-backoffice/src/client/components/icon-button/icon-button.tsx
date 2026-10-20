"use client";

import {Button} from "@base-ui/react/button";
import type {ComponentProps} from "react";

import * as styles from "./icon-button.css";

type ButtonProps = ComponentProps<typeof Button>;

type ExposedButtonProps = Omit<ButtonProps, "aria-label" | "className">;

type Props = ExposedButtonProps & {
  // An icon has no text, so the label names the button
  "aria-label": string;
};

const IconButton = (props: Props) => (
  <Button className={styles.root} {...props} />
);

export {IconButton};
