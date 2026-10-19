import {authApiSessionCookieName} from "@mgtitimoli/auth-api-tools/auth-api-session-cookie-name";
import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";

const authPaths = ["/sign-in", "/sign-up"];

const redirectTo = (request: NextRequest, pathname: string) =>
  NextResponse.redirect(new URL(pathname, request.url));

// Optimistic: it can only see whether the cookie exists, not whether its
// session is still active (a stale one is removed by the API's 401)
const proxy = (request: NextRequest) => {
  const hasSession = request.cookies.has(authApiSessionCookieName);

  const {pathname} = request.nextUrl;

  if (pathname === "/") {
    return redirectTo(request, hasSession ? "/users" : "/sign-up");
  }

  const isAuthPath = authPaths.includes(pathname);

  if (isAuthPath && hasSession) {
    return redirectTo(request, "/users");
  }

  if (!isAuthPath && !hasSession) {
    return redirectTo(request, "/sign-in");
  }

  return NextResponse.next();
};

// Every page, but not Next's assets or the favicon. Next reads it statically,
// so it must be exported where it's declared
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
export default proxy;
