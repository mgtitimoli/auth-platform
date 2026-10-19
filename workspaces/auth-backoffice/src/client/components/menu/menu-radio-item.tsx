"use client";

import {Menu as BaseMenu} from "@base-ui/react/menu";
import {Check} from "lucide-react";
import type {ComponentProps} from "react";

import * as styles from "./menu.css";

type MenuRadioItemProps = ComponentProps<typeof BaseMenu.RadioItem>;

type ExposedMenuRadioItemProps = Omit<MenuRadioItemProps, "className">;

type Props = ExposedMenuRadioItemProps;

const MenuRadioItem = ({children, ...radioItemProps}: Props) => (
  <BaseMenu.RadioItem className={styles.radioItem} {...radioItemProps}>
    {children}
    <BaseMenu.RadioItemIndicator className={styles.radioItemIndicator}>
      <Check size={16} />
    </BaseMenu.RadioItemIndicator>
  </BaseMenu.RadioItem>
);

export {MenuRadioItem};
