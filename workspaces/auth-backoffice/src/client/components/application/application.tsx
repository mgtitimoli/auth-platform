"use client";

import {QueryClientProvider} from "@tanstack/react-query";
import {useState} from "react";
import type {ReactNode} from "react";

import * as withApplicationQueryClient from "./application-query-client";

type Props = {
  children: ReactNode;
};

const Application = ({children}: Props) => {
  // One per mount, so server pre-rendering never shares a cache between requests
  const [queryClient] = useState(withApplicationQueryClient.create);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export {Application};
