"use client";

import {authApi, useRedirectIfUnauthorized} from "@/client/utils/auth-api";

import * as styles from "./users-screen.css";

const UsersScreen = () => {
  const {isRedirecting} = useRedirectIfUnauthorized();

  // Disabled while redirecting, so the cleared cache doesn't refetch it
  const {data: currentUser} = authApi.useQuery(
    "get",
    "/users/me",
    {},
    {enabled: !isRedirecting}
  );

  if (isRedirecting) {
    return null;
  }

  return (
    <main className={styles.root}>
      {currentUser !== undefined && (
        <h1 className={styles.title}>Hello {currentUser.data.firstName}</h1>
      )}
    </main>
  );
};

export {UsersScreen};
