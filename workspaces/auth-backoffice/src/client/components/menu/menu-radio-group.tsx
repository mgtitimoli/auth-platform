"use client";

import {Menu as BaseMenu} from "@base-ui/react/menu";
import type {ComponentProps} from "react";

import * as styles from "./menu.css";

type MenuRadioGroupProps = ComponentProps<typeof BaseMenu.RadioGroup>;

type ExposedMenuRadioGroupProps = Omit<MenuRadioGroupProps, "className">;

type Props = ExposedMenuRadioGroupProps & {
  label: string;
};

const MenuRadioGroup = ({children, label, ...radioGroupProps}: Props) => (
  <BaseMenu.RadioGroup {...radioGroupProps}>
    <BaseMenu.GroupLabel className={styles.groupLabel}>
      {label}
    </BaseMenu.GroupLabel>
    {children}
  </BaseMenu.RadioGroup>
);

export {MenuRadioGroup};
