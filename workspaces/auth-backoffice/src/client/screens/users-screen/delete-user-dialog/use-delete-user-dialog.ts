import {AuthApiResponseError} from "@mgtitimoli/auth-api-tools/auth-api-response-error";
import type {User} from "@mgtitimoli/auth-domain/domain-schema";
import * as withHttpStatusCode from "@mgtitimoli/utils/http/http-status-code";
import {useState} from "react";

import {authApi} from "@/client/utils/auth-api";

type Params = {
  onDelete: (user: User, wasAlreadyDeleted: boolean) => unknown;
};

const {httpStatusCodes} = withHttpStatusCode;

const useDeleteUserDialog = ({onDelete}: Params) => {
  const deleteUserMutation = authApi.useMutation("delete", "/users/{userId}");

  const [error, setError] = useState<string>();

  const deleteUser = async (user: User) => {
    setError(undefined);

    try {
      await deleteUserMutation.mutateAsync({
        params: {path: {userId: user.id}}
      });

      onDelete(user, false);
    } catch (error) {
      // Someone else deleted them meanwhile: what the admin wanted is done
      if (
        error instanceof AuthApiResponseError &&
        error.status === httpStatusCodes.notFound
      ) {
        onDelete(user, true);

        return;
      }

      setError("Something went wrong, please try again");
    }
  };

  return {deleteUser, error, isDeleting: deleteUserMutation.isPending};
};

export {useDeleteUserDialog};
