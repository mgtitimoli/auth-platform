import {zodResolver} from "@hookform/resolvers/zod";
import {AuthApiResponseError} from "@mgtitimoli/auth-api-tools/auth-api-response-error";
import {signUpInputSchema} from "@mgtitimoli/auth-domain/domain-schema";
import * as withHttpStatusCode from "@mgtitimoli/utils/http/http-status-code";
import {pick} from "@mgtitimoli/utils/object";
import {useForm} from "react-hook-form";
import {z} from "zod";

import {authApi} from "@/client/utils/auth-api";

type SignUpFormValues = z.input<typeof signUpFormValuesSchema>;

type Params = {
  onSignUp: () => unknown;
};

const {httpStatusCodes} = withHttpStatusCode;

const signUpFormValuesSchema = signUpInputSchema
  .extend({passwordConfirmation: z.string()})
  .refine(values => values.password === values.passwordConfirmation, {
    message: "Passwords don't match",
    path: ["passwordConfirmation"]
  });

const defaultValues: SignUpFormValues = {
  email: "",
  firstName: "",
  lastName: "",
  password: "",
  passwordConfirmation: ""
};

const useSignUpForm = ({onSignUp}: Params) => {
  const signUp = authApi.useMutation("post", "/auth/sign-up");

  const {formState, handleSubmit, register, setError} = useForm({
    defaultValues,
    resolver: zodResolver(signUpFormValuesSchema)
  });

  const submit = handleSubmit(async values => {
    try {
      await signUp.mutateAsync({
        body: pick(values, ["email", "firstName", "lastName", "password"])
      });
    } catch (error) {
      if (
        error instanceof AuthApiResponseError &&
        error.status === httpStatusCodes.conflict
      ) {
        setError("email", {message: error.message}, {shouldFocus: true});
      } else {
        setError("root", {message: "Something went wrong, please try again"});
      }

      return;
    }

    onSignUp();
  });

  return {
    errors: formState.errors,
    isSubmitting: signUp.isPending,
    register,
    submit
  };
};

export {useSignUpForm};
