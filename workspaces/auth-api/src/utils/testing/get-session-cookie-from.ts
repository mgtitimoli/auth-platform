import {sessionCookieName} from "@/utils/session-cookie/session-cookie";

import {getSessionIdFrom} from "./get-session-id-from";

const getSessionCookieFrom = (response: Response) => {
  const sessionId = getSessionIdFrom(response);

  return sessionCookieName + "=" + sessionId;
};

export {getSessionCookieFrom};
