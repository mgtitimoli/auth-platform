import {timingSafeEqual} from "node:crypto";

import {deriveKey} from "./derive-key";
import * as withPasswordHash from "./password-hash";

const isMatchingHash = async (
  password: string,
  passwordHash: string
): Promise<boolean> => {
  const parsedPasswordHash = withPasswordHash.parse(passwordHash);

  if (!parsedPasswordHash) {
    return false;
  }

  const {key, salt, scryptParams} = parsedPasswordHash;

  const derivedKey = await deriveKey(password, salt, scryptParams);

  return derivedKey.length === key.length && timingSafeEqual(derivedKey, key);
};

export {isMatchingHash};
