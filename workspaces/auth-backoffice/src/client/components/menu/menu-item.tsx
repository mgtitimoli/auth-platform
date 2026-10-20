"use client";

import {Menu as BaseMenu} from "@base-ui/react/menu";
import type {ComponentProps} from "react";

import {menuItemVariants} from "./menu-item-variant";
import type {MenuItemVariant} from "./menu-item-variant";
import * as styles from "./menu.css";

type MenuItemProps = ComponentProps<typeof BaseMenu.Item>;

type ExposedMenuItemProps = Omit<MenuItemProps, "className">;

type Props = ExposedMenuItemProps & {
  variant?: MenuItemVariant;
};

const MenuItem = ({
  variant = menuItemVariants.default,
  ...itemProps
}: Props) => (
  <BaseMenu.Item className={styles.itemVariants[variant]} {...itemProps} />
);

export {MenuItem};
