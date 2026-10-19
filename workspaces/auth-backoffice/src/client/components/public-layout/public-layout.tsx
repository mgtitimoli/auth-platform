"use client";

import type {ReactNode} from "react";

import * as styles from "./public-layout.css";

type Props = {
  children: ReactNode;
};

const PublicLayout = ({children}: Props) => (
  <main className={styles.root}>{children}</main>
);

export {PublicLayout};
