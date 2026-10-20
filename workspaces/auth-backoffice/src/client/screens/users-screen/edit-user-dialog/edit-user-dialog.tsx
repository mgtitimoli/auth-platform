"use client";

import type {User} from "@mgtitimoli/auth-domain/domain-schema";

import {Dialog} from "@/client/components/dialog";

import {EditUserForm} from "./edit-user-form";

type Props = {
  onEdit: (user: User) => unknown;
  onOpenChange: (isOpen: boolean) => unknown;
  // The user being edited; the dialog is open while there's one
  user?: User;
};

const EditUserDialog = ({onEdit, onOpenChange, user}: Props) => (
  <Dialog
    isOpen={user !== undefined}
    onOpenChange={onOpenChange}
    title="Edit user"
  >
    {user !== undefined && (
      <EditUserForm key={user.id} onEdit={onEdit} user={user} />
    )}
  </Dialog>
);

export {EditUserDialog};
