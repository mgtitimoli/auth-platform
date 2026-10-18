// Set-Cookie is only readable outside browsers (e.g. in Node.js)
const getCookie = (response: Response, name: string): string | undefined =>
  response.headers
    .getSetCookie()
    .map(setCookie => setCookie.split(";")[0] ?? "")
    .find(pair => pair.startsWith(name + "="))
    ?.slice(name.length + 1);

export {getCookie};
