"use client";

import {TextField} from "@/client/components/fields";
import {Form} from "@/client/components/form";

import {useSignUpForm} from "./use-sign-up-form";

type Props = {
  isDisabled?: boolean;
  onSignUp: () => unknown;
};

const SignUpForm = ({isDisabled = false, onSignUp}: Props) => {
  const {errors, isSubmitting, register, submit} = useSignUpForm({onSignUp});

  return (
    <Form
      error={errors.root?.message}
      isDisabled={isDisabled || isSubmitting}
      onSubmit={submit}
      submitLabel="Sign up"
    >
      <TextField
        autoComplete="given-name"
        error={errors.firstName?.message}
        label="First name"
        {...register("firstName")}
      />
      <TextField
        autoComplete="family-name"
        error={errors.lastName?.message}
        label="Last name"
        {...register("lastName")}
      />
      <TextField
        autoComplete="email"
        error={errors.email?.message}
        label="Email"
        type="email"
        {...register("email")}
      />
      <TextField
        autoComplete="new-password"
        error={errors.password?.message}
        label="Password"
        type="password"
        {...register("password")}
      />
      <TextField
        autoComplete="new-password"
        error={errors.passwordConfirmation?.message}
        label="Confirm password"
        type="password"
        {...register("passwordConfirmation")}
      />
    </Form>
  );
};

export {SignUpForm};
