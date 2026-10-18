import * as withResponse from "@mgtitimoli/utils/fetch/response";
import {ensureIsDefined} from "@mgtitimoli/utils/validation";

import {sessionCookieName} from "@/utils/session-cookie/session-cookie";

const getSessionIdFrom = (response: Response) =>
  ensureIsDefined(
    withResponse.getCookie(response, sessionCookieName),
    "The response has no session cookie"
  );

export {getSessionIdFrom};
