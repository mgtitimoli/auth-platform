"use client";

import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {useState} from "react";
import type {ReactNode} from "react";

type Props = {
  children: ReactNode;
};

const Application = ({children}: Props) => {
  // One per mount, so server pre-rendering never shares a cache between requests
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export {Application};
