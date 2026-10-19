"use client";

import {Menu as BaseMenu} from "@base-ui/react/menu";
import type {ComponentProps, ReactNode} from "react";

import * as styles from "./menu.css";

type MenuTriggerProps = ComponentProps<typeof BaseMenu.Trigger>;

type ExposedMenuTriggerProps = Omit<MenuTriggerProps, "children" | "className">;

type Props = ExposedMenuTriggerProps & {
  children: ReactNode;
  trigger: ReactNode;
};

const Menu = ({children, trigger, ...triggerProps}: Props) => (
  <BaseMenu.Root>
    <BaseMenu.Trigger className={styles.trigger} {...triggerProps}>
      {trigger}
    </BaseMenu.Trigger>
    <BaseMenu.Portal>
      <BaseMenu.Positioner align="end" sideOffset={8}>
        <BaseMenu.Popup className={styles.popup}>{children}</BaseMenu.Popup>
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  </BaseMenu.Root>
);

export {Menu};
