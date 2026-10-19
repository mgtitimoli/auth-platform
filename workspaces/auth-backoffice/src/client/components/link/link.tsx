"use client";

import NextLink from "next/link";
import type {ComponentProps} from "react";

import * as styles from "./link.css";

type NextLinkProps = ComponentProps<typeof NextLink>;

type ExposedNextLinkProps = Omit<NextLinkProps, "className">;

type Props = ExposedNextLinkProps;

const Link = (props: Props) => <NextLink className={styles.root} {...props} />;

export {Link};
