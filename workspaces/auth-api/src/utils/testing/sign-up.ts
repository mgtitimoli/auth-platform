import type {SignUpInput} from "@mgtitimoli/auth-domain/domain-schema";

import {createSignUpInput} from "./create-sign-up-input";
import {getSessionCookieFrom} from "./get-session-cookie-from";
import {postJson} from "./post-json";

// Returns the Cookie header of the new user's session
const signUp = async (input: SignUpInput = createSignUpInput()) => {
  const response = await postJson("/auth/sign-up", input);

  return getSessionCookieFrom(response);
};

export {signUp};
