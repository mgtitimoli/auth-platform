"use client";

import type {User} from "@mgtitimoli/auth-domain/domain-schema";
import {EllipsisVertical} from "lucide-react";

import {Menu, MenuItem} from "@/client/components/menu";

type Props = {
  onEdit: () => unknown;
  user: User;
};

const UserActionsMenu = ({onEdit, user}: Props) => (
  <Menu
    aria-label={"Actions for " + user.firstName + " " + user.lastName}
    trigger={<EllipsisVertical size={16} />}
  >
    <MenuItem onClick={onEdit}>Edit</MenuItem>
  </Menu>
);

export {UserActionsMenu};
