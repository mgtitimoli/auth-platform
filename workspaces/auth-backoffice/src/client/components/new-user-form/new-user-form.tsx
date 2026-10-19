"use client";

import type {NewUserInput} from "@mgtitimoli/auth-domain/domain-schema";
import type {ComponentProps} from "react";

import {TextField} from "@/client/components/fields";
import {Form} from "@/client/components/form";

import {useNewUserForm} from "./use-new-user-form";

type FormProps = ComponentProps<typeof Form>;

type ExposedFormProps = Omit<FormProps, "children" | "error" | "onSubmit">;

type Props = ExposedFormProps & {
  // Awaited: a rejection is shown on the form (an existing email on its field)
  onSubmit: (input: NewUserInput) => Promise<unknown>;
};

const NewUserForm = ({isDisabled = false, onSubmit, submitLabel}: Props) => {
  const {errors, isSubmitting, register, submit} = useNewUserForm({onSubmit});

  return (
    <Form
      error={errors.root?.message}
      isDisabled={isDisabled || isSubmitting}
      onSubmit={submit}
      submitLabel={submitLabel}
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

export {NewUserForm};
