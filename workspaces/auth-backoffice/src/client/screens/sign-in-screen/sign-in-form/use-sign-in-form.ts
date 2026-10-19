import {zodResolver} from "@hookform/resolvers/zod";
import {AuthApiResponseError} from "@mgtitimoli/auth-api-tools/auth-api-response-error";
import {signInInputSchema} from "@mgtitimoli/auth-domain/domain-schema";
import type {SignInInput} from "@mgtitimoli/auth-domain/domain-schema";
import * as withHttpStatusCode from "@mgtitimoli/utils/http/http-status-code";
import type {FormEvent} from "react";
import {useForm} from "react-hook-form";

import {authApi} from "@/client/utils/auth-api";

type Params = {
  onSignIn: () => unknown;
};

const {httpStatusCodes} = withHttpStatusCode;

const defaultValues: SignInInput = {
  email: "",
  password: ""
};

// Wrong credentials (401) don't say which field is wrong, and an inactive user
// (403) is about the account, so both go to the form instead of a field
const signInErrorStatuses: number[] = [
  httpStatusCodes.unauthorized,
  httpStatusCodes.forbidden
];

const useSignInForm = ({onSignIn}: Params) => {
  const signIn = authApi.useMutation("post", "/auth/sign-in");

  const {formState, handleSubmit, register, setError} = useForm({
    defaultValues,
    resolver: zodResolver(signInInputSchema)
  });

  const submitValues = handleSubmit(async values => {
    try {
      await signIn.mutateAsync({body: values});
    } catch (error) {
      setError("root", {
        message:
          error instanceof AuthApiResponseError &&
          signInErrorStatuses.includes(error.status)
            ? error.message
            : "Something went wrong, please try again"
      });

      return;
    }

    onSignIn();
  });

  // Every failure is set on the form, so the promise is never left rejected
  const submit = (event: FormEvent<HTMLFormElement>) => {
    void submitValues(event);
  };

  return {
    errors: formState.errors,
    isSubmitting: signIn.isPending,
    register,
    submit
  };
};

export {useSignInForm};
