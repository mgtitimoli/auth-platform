"use client";

import {SignUpForm} from "./sign-up-form";
import * as styles from "./sign-up-screen.css";
import {useSignUpScreen} from "./use-sign-up-screen";

const SignUpScreen = () => {
  const {isNavigating, onSignUp} = useSignUpScreen();

  return (
    <main className={styles.root}>
      <h1 className={styles.title}>Sign up</h1>
      <SignUpForm isDisabled={isNavigating} onSignUp={onSignUp} />
    </main>
  );
};

export {SignUpScreen};
