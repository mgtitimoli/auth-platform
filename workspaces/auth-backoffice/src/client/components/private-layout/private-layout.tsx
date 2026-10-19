"use client";

import type {ReactNode} from "react";

import {AccountMenu} from "./account-menu";
import * as styles from "./private-layout.css";
import {usePrivateLayout} from "./use-private-layout";

type Props = {
  children: ReactNode;
};

const PrivateLayout = ({children}: Props) => {
  const {handleSessionEnd, isUnauthorized} = usePrivateLayout();

  if (isUnauthorized) {
    return null;
  }

  return (
    <>
      <header className={styles.header}>
        <span className={styles.appName}>Auth Backoffice</span>
        <AccountMenu onSignOut={handleSessionEnd} />
      </header>
      <main className={styles.main}>{children}</main>
    </>
  );
};

export {PrivateLayout};
