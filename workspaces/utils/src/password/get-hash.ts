import {randomBytes} from "node:crypto";

import {deriveKey} from "./derive-key";
import type {ScryptParams} from "./derive-key";
import * as withPasswordHash from "./password-hash";

// OWASP Password Storage Cheat Sheet: N=2^17, r=8, p=1
const scryptParams: ScryptParams = {
  blockSize: 8,
  cost: 2 ** 17,
  parallelization: 1
};

const saltLength = 16;

const getHash = async (password: string): Promise<string> => {
  const salt = randomBytes(saltLength);

  const key = await deriveKey(password, salt, scryptParams);

  return withPasswordHash.toString({key, salt, scryptParams});
};

export {getHash};
