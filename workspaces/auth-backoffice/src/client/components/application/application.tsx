"use client";

import type {ReactNode} from "react";

type Props = {
  children: ReactNode;
};

const Application = ({children}: Props) => children;

export {Application};
