import type {SignInInput} from "@mgtitimoli/auth-domain/domain-schema";

import {getSessionCookieFrom} from "./get-session-cookie-from";
import {postJson} from "./post-json";

// Returns the Cookie header of the new session
const signIn = async (input: SignInInput) => {
  const response = await postJson("/auth/sign-in", input);

  return getSessionCookieFrom(response);
};

export {signIn};
