"use client";

import type {User} from "@mgtitimoli/auth-domain/domain-schema";
import * as withUserStatus from "@mgtitimoli/auth-domain/user-status";
import type {UserStatus} from "@mgtitimoli/auth-domain/user-status";
import {Controller} from "react-hook-form";

import {SelectField, TextField} from "@/client/components/fields";
import type {SelectFieldOption} from "@/client/components/fields";
import {Form} from "@/client/components/form";

import {useEditUserForm} from "./use-edit-user-form";

type Props = {
  onEdit: (user: User) => unknown;
  user: User;
};

const {userStatuses} = withUserStatus;

const statusOptions: SelectFieldOption<UserStatus>[] = [
  {label: "Active", value: userStatuses.active},
  {label: "Inactive", value: userStatuses.inactive}
];

const EditUserForm = ({onEdit, user}: Props) => {
  const {
    areNamesDisabled,
    control,
    errors,
    isDirty,
    isStatusDisabled,
    isSubmitting,
    register,
    submit
  } = useEditUserForm({onEdit, user});

  const namesDescription = areNamesDisabled
    ? "Activate the user to change their name"
    : undefined;

  return (
    <Form
      error={errors.root?.message}
      isDisabled={isSubmitting}
      isSubmitDisabled={!isDirty}
      onSubmit={submit}
      submitLabel="Save"
    >
      <TextField
        autoComplete="off"
        description={namesDescription}
        error={errors.firstName?.message}
        label="First name"
        {...register("firstName", {disabled: areNamesDisabled})}
      />
      <TextField
        autoComplete="off"
        description={namesDescription}
        error={errors.lastName?.message}
        label="Last name"
        {...register("lastName", {disabled: areNamesDisabled})}
      />
      <TextField
        autoComplete="off"
        error={errors.email?.message}
        label="Email"
        type="email"
        {...register("email")}
      />
      <Controller
        control={control}
        name="status"
        render={({field}) => (
          <SelectField
            description={
              isStatusDisabled ? "You can't deactivate yourself" : undefined
            }
            error={errors.status?.message}
            isDisabled={isStatusDisabled}
            label="Status"
            onValueChange={field.onChange}
            options={statusOptions}
            value={field.value ?? userStatuses.active}
          />
        )}
      />
    </Form>
  );
};

export {EditUserForm};
