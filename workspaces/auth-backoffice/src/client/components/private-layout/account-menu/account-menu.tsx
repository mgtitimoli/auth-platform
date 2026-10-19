"use client";

import {useTheme} from "@wrksz/themes/client";
import type {ThemeSelection} from "@wrksz/themes/client";
import {Monitor, Moon, Sun} from "lucide-react";
import type {LucideIcon} from "lucide-react";

import {Avatar} from "@/client/components/avatar";
import {
  Menu,
  MenuItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator
} from "@/client/components/menu";
import {authApi, useSignOut} from "@/client/utils/auth-api";

import * as styles from "./account-menu.css";

type Names = {
  firstName: string;
  lastName: string;
};

type Props = {
  onSignOut: () => unknown;
};

type ThemeOption = {
  Icon: LucideIcon;
  label: string;
  value: ThemeSelection;
};

const themeOptions: ThemeOption[] = [
  {Icon: Sun, label: "Light", value: "light"},
  {Icon: Moon, label: "Dark", value: "dark"},
  {Icon: Monitor, label: "System", value: "system"}
];

const getInitials = ({firstName, lastName}: Names) =>
  (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();

const AccountMenu = ({onSignOut}: Props) => {
  const {setTheme, theme} = useTheme();

  const {data: currentUserResponse} = authApi.useQuery("get", "/users/me");

  const signOut = useSignOut(onSignOut);

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
      <MenuRadioGroup label="Theme" onValueChange={setTheme} value={theme}>
        {themeOptions.map(({Icon, label, value}) => (
          <MenuRadioItem key={value} value={value}>
            <Icon size={16} />
            {label}
          </MenuRadioItem>
        ))}
      </MenuRadioGroup>
      <MenuSeparator />
      <MenuItem onClick={signOut}>Log out</MenuItem>
    </Menu>
  );
};

export {AccountMenu};
