import {randomBytes} from "node:crypto";

import {deriveKey} from "./derive-key";
import * as withPasswordHash from "./password-hash";
import {defaultPasswordHashCost} from "./password-hash-cost";
import type {PasswordHashCost} from "./password-hash-cost";

const saltLength = 16;

const getHash = async (
  password: string,
  passwordHashCost: PasswordHashCost = defaultPasswordHashCost
): Promise<string> => {
  const salt = randomBytes(saltLength);

  // OWASP Password Storage Cheat Sheet: r=8, p=1
  const scryptParams = {
    blockSize: 8,
    cost: passwordHashCost,
    parallelization: 1
  };

  const key = await deriveKey(password, salt, scryptParams);

  return withPasswordHash.toString({key, salt, scryptParams});
};

export {getHash};
