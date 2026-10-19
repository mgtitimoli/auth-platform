"use client";

import {Link} from "@/client/components/link";

import {SignUpForm} from "./sign-up-form";
import * as styles from "./sign-up-screen.css";
import {useSignUpScreen} from "./use-sign-up-screen";

const SignUpScreen = () => {
  const {isNavigating, onSignUp} = useSignUpScreen();

  return (
    <div className={styles.root}>
      <h1 className={styles.title}>Sign up</h1>
      <SignUpForm isDisabled={isNavigating} onSignUp={onSignUp} />
      <p className={styles.footer}>
        Already have an account? <Link href="/sign-in">Sign in</Link>
      </p>
    </div>
  );
};

export {SignUpScreen};
