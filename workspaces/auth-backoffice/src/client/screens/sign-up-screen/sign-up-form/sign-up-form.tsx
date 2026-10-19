"use client";

import {Button} from "@/client/components/button";
import {TextField} from "@/client/components/fields";

import * as styles from "./sign-up-form.css";
import {useSignUpForm} from "./use-sign-up-form";

type Props = {
  isDisabled?: boolean;
  onSignUp: () => unknown;
};

const SignUpForm = ({isDisabled = false, onSignUp}: Props) => {
  const {errors, isSubmitting, register, submit} = useSignUpForm({onSignUp});

  return (
    <form noValidate onSubmit={submit}>
      <fieldset
        className={styles.fieldset}
        disabled={isDisabled || isSubmitting}
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
        {errors.root?.message !== undefined && (
          <p className={styles.error} role="alert">
            {errors.root.message}
          </p>
        )}
        <Button type="submit">Sign up</Button>
      </fieldset>
    </form>
  );
};

export {SignUpForm};
