"use client";

import {useRouter} from "next/navigation";

import {Avatar} from "@/client/components/avatar";
import {Menu, MenuItem, MenuSeparator} from "@/client/components/menu";
import {authApi, useSignOut} from "@/client/utils/auth-api";

import * as styles from "./account-menu.css";

type Names = {
  firstName: string;
  lastName: string;
};

const getInitials = ({firstName, lastName}: Names) =>
  (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();

const AccountMenu = () => {
  const router = useRouter();

  const {data: currentUserResponse} = authApi.useQuery("get", "/users/me");

  const signOut = useSignOut(() => router.replace("/sign-in"));

  const currentUser = currentUserResponse?.data;

  return (
    <Menu
      aria-label="Account"
      trigger={
        <Avatar
          {...(currentUser !== undefined && {
            initials: getInitials(currentUser)
          })}
        />
      }
    >
      {currentUser !== undefined && (
        <>
          <div className={styles.user}>
            <span className={styles.name}>
              {currentUser.firstName + " " + currentUser.lastName}
            </span>
            <span className={styles.email}>{currentUser.email}</span>
          </div>
          <MenuSeparator />
        </>
      )}
      <MenuItem onClick={signOut}>Log out</MenuItem>
    </Menu>
  );
};

export {AccountMenu};
