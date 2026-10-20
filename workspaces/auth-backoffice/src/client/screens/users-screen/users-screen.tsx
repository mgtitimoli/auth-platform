"use client";

import {Button} from "@/client/components/button";
import {Pagination} from "@/client/components/pagination";

import {CreateUserDialog} from "./create-user-dialog";
import {EditUserDialog} from "./edit-user-dialog";
import {useUsersScreen} from "./use-users-screen";
import * as styles from "./users-screen.css";
import {UsersTable} from "./users-table";

const UsersScreen = () => {
  const {
    editedUser,
    handleCreate,
    handleEdit,
    handleEditUserDialogOpenChange,
    isCreateUserDialogOpen,
    isPlaceholderData,
    page,
    pageCount,
    setEditedUser,
    setIsCreateUserDialogOpen,
    setPage,
    users
  } = useUsersScreen();

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h1 className={styles.title}>Users</h1>
        <Button onClick={() => setIsCreateUserDialogOpen(true)}>
          Create user
        </Button>
      </div>
      {users !== undefined && (
        <>
          <UsersTable
            isBusy={isPlaceholderData}
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
      <CreateUserDialog
        isOpen={isCreateUserDialogOpen}
        onCreate={handleCreate}
        onOpenChange={setIsCreateUserDialogOpen}
      />
    </div>
  );
};

export {UsersScreen};
