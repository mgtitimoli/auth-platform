"use client";

import {authApi} from "@/client/utils/auth-api";

import * as styles from "./users-screen.css";

const UsersScreen = () => {
  const {data: currentUser} = authApi.useQuery("get", "/users/me");

  return (
    <main className={styles.root}>
      {currentUser !== undefined && (
        <h1 className={styles.title}>Hello {currentUser.data.firstName}</h1>
      )}
    </main>
  );
};

export {UsersScreen};
