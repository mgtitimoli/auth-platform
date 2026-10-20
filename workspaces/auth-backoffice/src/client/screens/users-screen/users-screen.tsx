"use client";

import {Button, buttonVariants} from "@/client/components/button";
import {Pagination} from "@/client/components/pagination";

import {CreateUserDialog} from "./create-user-dialog";
import {DeleteUserDialog} from "./delete-user-dialog";
import {EditUserDialog} from "./edit-user-dialog";
import {useUsersScreen} from "./use-users-screen";
import * as styles from "./users-screen.css";
import {UsersTable} from "./users-table";

const UsersScreen = () => {
  const {
    deletedUser,
    editedUser,
    handleCreate,
    handleDelete,
    handleDeleteUserDialogOpenChange,
    handleEdit,
    handleEditUserDialogOpenChange,
    isCreateUserDialogOpen,
    isPlaceholderData,
    page,
    pageCount,
    setDeletedUser,
    setEditedUser,
    setIsCreateUserDialogOpen,
    setPage,
    users
  } = useUsersScreen();

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h1 className={styles.title}>Users</h1>
        <Button
          onClick={() => setIsCreateUserDialogOpen(true)}
          variant={buttonVariants.primary}
        >
          Create user
        </Button>
      </div>
      {users !== undefined && (
        <>
          <UsersTable
            isBusy={isPlaceholderData}
            onDelete={setDeletedUser}
            onEdit={setEditedUser}
            users={users}
          />
          <Pagination
            isDisabled={isPlaceholderData}
            onPageChange={setPage}
            page={page}
            pageCount={pageCount}
          />
        </>
      )}
      <EditUserDialog
        onEdit={handleEdit}
        onOpenChange={handleEditUserDialogOpenChange}
        user={editedUser}
      />
      <DeleteUserDialog
        // A fresh dialog per user, so an error doesn't carry over
        key={deletedUser?.id}
        onDelete={handleDelete}
        onOpenChange={handleDeleteUserDialogOpenChange}
        user={deletedUser}
      />
      <CreateUserDialog
        isOpen={isCreateUserDialogOpen}
        onCreate={handleCreate}
        onOpenChange={setIsCreateUserDialogOpen}
      />
    </div>
  );
};

export {UsersScreen};
