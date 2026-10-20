"use client";

import type {User} from "@mgtitimoli/auth-domain/domain-schema";
import {EllipsisVertical} from "lucide-react";

import {Menu, MenuItem, menuItemVariants} from "@/client/components/menu";
import {authApi} from "@/client/utils/auth-api";

type Props = {
  onDelete: () => unknown;
  onEdit: () => unknown;
  user: User;
};

const UserActionsMenu = ({onDelete, onEdit, user}: Props) => {
  const {data: currentUserResponse} = authApi.useQuery("get", "/users/me");

  // The API rejects deleting yourself
  const isCurrentUser = currentUserResponse?.data.id === user.id;

  return (
    <Menu
      aria-label={"Actions for " + user.firstName + " " + user.lastName}
      trigger={<EllipsisVertical size={16} />}
    >
      <MenuItem onClick={onEdit}>Edit</MenuItem>
      <MenuItem
        disabled={isCurrentUser}
        onClick={onDelete}
        variant={menuItemVariants.danger}
      >
        Delete
      </MenuItem>
    </Menu>
  );
};

export {UserActionsMenu};
