"use client";

import {Menu as BaseMenu} from "@base-ui/react/menu";
import type {ComponentProps} from "react";

import * as styles from "./menu.css";

type MenuItemProps = ComponentProps<typeof BaseMenu.Item>;

type ExposedMenuItemProps = Omit<MenuItemProps, "className">;

type Props = ExposedMenuItemProps;

const MenuItem = (props: Props) => (
  <BaseMenu.Item className={styles.item} {...props} />
);

export {MenuItem};
