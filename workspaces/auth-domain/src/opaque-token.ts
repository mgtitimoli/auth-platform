import type {OpaqueToken} from "./domain-schema";

// OWASP ASVS: session tokens have at least 128 bits of entropy
const minByteLength = 16;

const toBase64Url = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/=+$/, "");

const create = (byteLength: number): OpaqueToken => {
  if (byteLength < minByteLength) {
    throw new RangeError(
      `An opaque token needs at least ${minByteLength} bytes, ${byteLength} given`
    );
  }

  return toBase64Url(crypto.getRandomValues(new Uint8Array(byteLength)));
};

export {create};
