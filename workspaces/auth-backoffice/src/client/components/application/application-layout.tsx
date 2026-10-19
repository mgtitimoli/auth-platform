import {ThemeProvider} from "@wrksz/themes/next";
import type {Metadata} from "next";
import type {ReactNode} from "react";

import "./application-global-style.css";

import {Application} from "./application";

type Props = {
  children: ReactNode;
};

const metadata: Metadata = {
  description: "Sign up, sign in and manage users",
  title: "Auth Backoffice"
};

// The root layout (a server component), rendered by src/app/layout.tsx.
// ThemeProvider sets <html>'s data-theme before hydration, hence
// suppressHydrationWarning
const ApplicationLayout = ({children}: Props) => (
  <html lang="en" suppressHydrationWarning>
    <body>
      <ThemeProvider attribute="data-theme">
        <Application>{children}</Application>
      </ThemeProvider>
    </body>
  </html>
);

export {ApplicationLayout, metadata};
