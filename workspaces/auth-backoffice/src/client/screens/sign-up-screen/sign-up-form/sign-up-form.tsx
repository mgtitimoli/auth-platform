"use client";

import type {ComponentProps} from "react";

import {NewUserForm} from "@/client/components/new-user-form";

import {useSignUpForm} from "./use-sign-up-form";

type NewUserFormProps = ComponentProps<typeof NewUserForm>;

type ExposedNewUserFormProps = Omit<
  NewUserFormProps,
  "onSubmit" | "submitLabel"
>;

type Props = ExposedNewUserFormProps & {
  onSignUp: () => unknown;
};

const SignUpForm = ({onSignUp, ...newUserFormProps}: Props) => {
  const {signUp} = useSignUpForm({onSignUp});

  return (
    <NewUserForm
      {...newUserFormProps}
      onSubmit={signUp}
      submitLabel="Sign up"
    />
  );
};

export {SignUpForm};
