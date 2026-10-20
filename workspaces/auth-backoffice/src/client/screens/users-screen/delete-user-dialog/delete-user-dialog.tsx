"use client";

import type {User} from "@mgtitimoli/auth-domain/domain-schema";

import {AlertDialog} from "@/client/components/alert-dialog";

import {useDeleteUserDialog} from "./use-delete-user-dialog";

type Props = {
  onDelete: (user: User, wasAlreadyDeleted: boolean) => unknown;
  onOpenChange: (isOpen: boolean) => unknown;
  // The user to delete; the dialog is open while there's one
  user?: User;
};

const DeleteUserDialog = ({onDelete, onOpenChange, user}: Props) => {
  const {deleteUser, error, isDeleting} = useDeleteUserDialog({onDelete});

  return (
    <AlertDialog
      confirmLabel="Delete"
      description={
        user !== undefined &&
        user.firstName +
          " " +
          user.lastName +
          " (" +
          user.email +
          ") will be deleted, together with their sessions. This can't be undone."
      }
      error={error}
      isConfirming={isDeleting}
      isOpen={user !== undefined}
      onConfirm={() => user !== undefined && deleteUser(user)}
      onOpenChange={onOpenChange}
      title="Delete user?"
    />
  );
};

export {DeleteUserDialog};
