import type {ScryptParams} from "./derive-key";

type PasswordHash = {
  key: Buffer;
  salt: Buffer;
  scryptParams: ScryptParams;
};

const algorithmName = "scrypt";

const separator = "$";

const encoding = "base64url";

const toString = ({key, salt, scryptParams}: PasswordHash) =>
  [
    algorithmName,
    scryptParams.cost,
    scryptParams.blockSize,
    scryptParams.parallelization,
    salt.toString(encoding),
    key.toString(encoding)
  ].join(separator);

const parsePositiveInteger = (value: string | undefined) => {
  const number = Number(value);

  return Number.isSafeInteger(number) && number > 0 ? number : undefined;
};

const parse = (value: string): PasswordHash | undefined => {
  const [name, cost, blockSize, parallelization, salt, key, ...rest] =
    value.split(separator);

  const scryptParams = {
    blockSize: parsePositiveInteger(blockSize),
    cost: parsePositiveInteger(cost),
    parallelization: parsePositiveInteger(parallelization)
  };

  if (
    name !== algorithmName ||
    rest.length > 0 ||
    !salt ||
    !key ||
    scryptParams.blockSize === undefined ||
    scryptParams.cost === undefined ||
    scryptParams.parallelization === undefined
  ) {
    return undefined;
  }

  return {
    key: Buffer.from(key, encoding),
    salt: Buffer.from(salt, encoding),
    scryptParams: {
      blockSize: scryptParams.blockSize,
      cost: scryptParams.cost,
      parallelization: scryptParams.parallelization
    }
  };
};

export {parse, toString};
export type {PasswordHash};
