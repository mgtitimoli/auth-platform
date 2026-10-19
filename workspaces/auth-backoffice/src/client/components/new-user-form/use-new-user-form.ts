import {zodResolver} from "@hookform/resolvers/zod";
import {AuthApiResponseError} from "@mgtitimoli/auth-api-tools/auth-api-response-error";
import {newUserInputSchema} from "@mgtitimoli/auth-domain/domain-schema";
import type {NewUserInput} from "@mgtitimoli/auth-domain/domain-schema";
import * as withHttpStatusCode from "@mgtitimoli/utils/http/http-status-code";
import {pick} from "@mgtitimoli/utils/object";
import {useForm} from "react-hook-form";
import {z} from "zod";

type NewUserFormValues = z.input<typeof newUserFormValuesSchema>;

const {httpStatusCodes} = withHttpStatusCode;

const newUserFormValuesSchema = newUserInputSchema
  .extend({passwordConfirmation: z.string()})
  .refine(values => values.password === values.passwordConfirmation, {
    message: "Passwords don't match",
    path: ["passwordConfirmation"]
  });

const defaultValues: NewUserFormValues = {
  email: "",
  firstName: "",
  lastName: "",
  password: "",
  passwordConfirmation: ""
};

type Params = {
  onSubmit: (input: NewUserInput) => Promise<unknown>;
};

const useNewUserForm = ({onSubmit}: Params) => {
  const {formState, handleSubmit, register, setError} = useForm({
    defaultValues,
    resolver: zodResolver(newUserFormValuesSchema)
  });

  const submit = handleSubmit(async values => {
    const input = pick(values, ["email", "firstName", "lastName", "password"]);

    try {
      await onSubmit(input);
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
    errors: formState.errors,
    isSubmitting: formState.isSubmitting,
    register,
    submit
  };
};

export {useNewUserForm};
