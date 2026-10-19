"use client";

import {Link} from "@/client/components/link";

import {SignInForm} from "./sign-in-form";
import * as styles from "./sign-in-screen.css";
import {useSignInScreen} from "./use-sign-in-screen";

const SignInScreen = () => {
  const {isNavigating, onSignIn} = useSignInScreen();

  return (
    <div className={styles.root}>
      <h1 className={styles.title}>Sign in</h1>
      <SignInForm isDisabled={isNavigating} onSignIn={onSignIn} />
      <p className={styles.footer}>
        Don&apos;t have an account? <Link href="/sign-up">Sign up</Link>
      </p>
    </div>
  );
};

export {SignInScreen};
