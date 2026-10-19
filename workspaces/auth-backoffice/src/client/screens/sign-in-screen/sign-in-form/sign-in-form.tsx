"use client";

import type {ComponentProps} from "react";

import {TextField} from "@/client/components/fields";
import {Form} from "@/client/components/form";

import {useSignInForm} from "./use-sign-in-form";

type FormProps = ComponentProps<typeof Form>;

type ExposedFormProps = Omit<
  FormProps,
  "children" | "error" | "onSubmit" | "submitLabel"
>;

type Props = ExposedFormProps & {
  onSignIn: () => unknown;
};

const SignInForm = ({isDisabled = false, onSignIn}: Props) => {
  const {errors, isSubmitting, register, submit} = useSignInForm({onSignIn});

  return (
    <Form
      error={errors.root?.message}
      isDisabled={isDisabled || isSubmitting}
      onSubmit={submit}
      submitLabel="Sign in"
    >
      <TextField
        autoComplete="email"
        error={errors.email?.message}
        label="Email"
        type="email"
        {...register("email")}
      />
      <TextField
        autoComplete="current-password"
        error={errors.password?.message}
        label="Password"
        type="password"
        {...register("password")}
      />
    </Form>
  );
};

export {SignInForm};
