"use client";

import {Avatar as BaseAvatar} from "@base-ui/react/avatar";
import type {ComponentProps} from "react";

import * as styles from "./avatar.css";

type AvatarRootProps = ComponentProps<typeof BaseAvatar.Root>;

type ExposedAvatarRootProps = Omit<AvatarRootProps, "children" | "className">;

type Props = ExposedAvatarRootProps & {
  initials?: string;
};

const Avatar = ({initials, ...rootProps}: Props) => (
  <BaseAvatar.Root className={styles.root} {...rootProps}>
    <BaseAvatar.Fallback className={styles.fallback}>
      {initials}
    </BaseAvatar.Fallback>
  </BaseAvatar.Root>
);

export {Avatar};
