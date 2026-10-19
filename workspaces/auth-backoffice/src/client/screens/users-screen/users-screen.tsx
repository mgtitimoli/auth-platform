"use client";

import {Pagination} from "@/client/components/pagination";

import {useUsersScreen} from "./use-users-screen";
import * as styles from "./users-screen.css";
import {UsersTable} from "./users-table";

const UsersScreen = () => {
  const {isPlaceholderData, page, pageCount, setPage, users} = useUsersScreen();

  return (
    <div className={styles.root}>
      <h1 className={styles.title}>Users</h1>
      {users !== undefined && (
        <>
          <UsersTable isBusy={isPlaceholderData} users={users} />
          <Pagination
            isDisabled={isPlaceholderData}
            onPageChange={setPage}
            page={page}
            pageCount={pageCount}
          />
        </>
      )}
    </div>
  );
};

export {UsersScreen};
