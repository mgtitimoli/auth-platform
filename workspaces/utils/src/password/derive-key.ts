import {scrypt} from "node:crypto";

type ScryptParams = {
  blockSize: number;
  cost: number;
  parallelization: number;
};

const keyLength = 64;

// scrypt needs 128 * cost * blockSize bytes, more than Node's 32 MiB default
// for the recommended cost
const getMaxMemory = ({blockSize, cost}: ScryptParams) =>
  2 * 128 * cost * blockSize;

const deriveKey = (
  password: string,
  salt: Buffer,
  scryptParams: ScryptParams
): Promise<Buffer> =>
  new Promise((resolve, reject) => {
    scrypt(
      password,
      salt,
      keyLength,
      {
        blockSize: scryptParams.blockSize,
        cost: scryptParams.cost,
        maxmem: getMaxMemory(scryptParams),
        parallelization: scryptParams.parallelization
      },
      (error, derivedKey) => (error ? reject(error) : resolve(derivedKey))
    );
  });

export {deriveKey};
export type {ScryptParams};
