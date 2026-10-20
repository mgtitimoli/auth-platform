import {zodResolver} from "@hookform/resolvers/zod";
import {AuthApiResponseError} from "@mgtitimoli/auth-api-tools/auth-api-response-error";
import {updateUserInputSchema} from "@mgtitimoli/auth-domain/domain-schema";
import type {
  UpdateUserInput,
  User
} from "@mgtitimoli/auth-domain/domain-schema";
import * as withUser from "@mgtitimoli/auth-domain/user";
import * as withHttpStatusCode from "@mgtitimoli/utils/http/http-status-code";
import {pick} from "@mgtitimoli/utils/object";
import {useForm} from "react-hook-form";

import {authApi} from "@/client/utils/auth-api";

type Params = {
  onEdit: (user: User) => unknown;
  user: User;
};

const {httpStatusCodes} = withHttpStatusCode;

const editableKeys: (keyof UpdateUserInput)[] = [
  "email",
  "firstName",
  "lastName",
  "status"
];

const useEditUserForm = ({onEdit, user}: Params) => {
  const {data: currentUserResponse} = authApi.useQuery("get", "/users/me");

  const editUserMutation = authApi.useMutation("patch", "/users/{userId}");

  // The API rejects names for an inactive user and deactivating yourself
  const areNamesDisabled = !withUser.isActive(user);

  const isStatusDisabled = currentUserResponse?.data.id === user.id;

  const {control, formState, handleSubmit, register, setError} = useForm({
    defaultValues: pick(user, editableKeys),
    resolver: zodResolver(updateUserInputSchema)
  });

  const submit = handleSubmit(async values => {
    // A partial update carries only the admin's changes, so it never
    // overwrites what someone else changed meanwhile
    const changedKeys = editableKeys.filter(key => formState.dirtyFields[key]);

    try {
      const {data: editedUser} = await editUserMutation.mutateAsync({
        body: pick(values, changedKeys),
        params: {path: {userId: user.id}}
      });

      onEdit(editedUser);
    } catch (error) {
      if (
        error instanceof AuthApiResponseError &&
        error.status === httpStatusCodes.conflict
      ) {
        setError("email", {message: error.message}, {shouldFocus: true});
      } else {
        setError("root", {message: "Something went wrong, please try again"});
      }
    }
  });

  return {
    areNamesDisabled,
    control,
    errors: formState.errors,
    isDirty: formState.isDirty,
    isStatusDisabled,
    isSubmitting: formState.isSubmitting,
    register,
    submit
  };
};

export {useEditUserForm};
