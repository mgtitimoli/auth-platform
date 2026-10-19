import type {NewUserInput} from "@mgtitimoli/auth-domain/domain-schema";

import {authApi} from "@/client/utils/auth-api";

type Params = {
  onSignUp: () => unknown;
};

const useSignUpForm = ({onSignUp}: Params) => {
  const signUpMutation = authApi.useMutation("post", "/auth/sign-up");

  const signUp = async (input: NewUserInput) => {
    await signUpMutation.mutateAsync({body: input});

    onSignUp();
  };

  return {signUp};
};

export {useSignUpForm};
