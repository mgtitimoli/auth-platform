import type {Metadata} from "next";
import type {ReactNode} from "react";

import {Application} from "./application";

type Props = {
  children: ReactNode;
};

const metadata: Metadata = {
  description: "Sign up, sign in and manage users",
  title: "Auth Backoffice"
};

// The root layout (a server component), rendered by src/app/layout.tsx
const ApplicationLayout = ({children}: Props) => (
  <html lang="en">
    <body>
      <Application>{children}</Application>
    </body>
  </html>
);

export {ApplicationLayout, metadata};
