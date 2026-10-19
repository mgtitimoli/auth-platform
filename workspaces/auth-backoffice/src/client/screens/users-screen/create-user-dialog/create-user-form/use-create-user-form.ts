import type {NewUserInput} from "@mgtitimoli/auth-domain/domain-schema";

import {authApi} from "@/client/utils/auth-api";

type Params = {
  onCreate: (input: NewUserInput) => unknown;
};

const useCreateUserForm = ({onCreate}: Params) => {
  const createUserMutation = authApi.useMutation("post", "/users");

  const createUser = async (input: NewUserInput) => {
    await createUserMutation.mutateAsync({body: input});

    onCreate(input);
  };

  return {createUser};
};

export {useCreateUserForm};
