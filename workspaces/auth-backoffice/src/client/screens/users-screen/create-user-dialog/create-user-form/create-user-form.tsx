"use client";

import type {NewUserInput} from "@mgtitimoli/auth-domain/domain-schema";
import type {ComponentProps} from "react";

import {NewUserForm} from "@/client/components/new-user-form";

import {useCreateUserForm} from "./use-create-user-form";

type NewUserFormProps = ComponentProps<typeof NewUserForm>;

type ExposedNewUserFormProps = Omit<
  NewUserFormProps,
  "onSubmit" | "submitLabel"
>;

type Props = ExposedNewUserFormProps & {
  onCreate: (input: NewUserInput) => unknown;
};

const CreateUserForm = ({onCreate, ...newUserFormProps}: Props) => {
  const {createUser} = useCreateUserForm({onCreate});

  return (
    <NewUserForm
      {...newUserFormProps}
      onSubmit={createUser}
      submitLabel="Create user"
    />
  );
};

export {CreateUserForm};
