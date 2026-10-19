"use client";

import type {ReactNode} from "react";

import {useRedirectIfUnauthorized} from "@/client/utils/auth-api";

import {AccountMenu} from "./account-menu";
import * as styles from "./private-layout.css";

type Props = {
  children: ReactNode;
};

const PrivateLayout = ({children}: Props) => {
  const {isRedirecting} = useRedirectIfUnauthorized();

  if (isRedirecting) {
    return null;
  }

  return (
    <>
      <header className={styles.header}>
        <span className={styles.appName}>Auth Backoffice</span>
        <AccountMenu />
      </header>
      <main className={styles.main}>{children}</main>
    </>
  );
};

export {PrivateLayout};
