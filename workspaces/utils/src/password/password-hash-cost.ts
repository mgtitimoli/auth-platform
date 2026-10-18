import {z} from "zod";

type PasswordHashCost = z.infer<typeof passwordHashCostSchema>;

// OWASP Password Storage Cheat Sheet: scrypt N=2^17
const defaultPasswordHashCost = 2 ** 17;

const isPowerOfTwo = (value: number) =>
  value > 1 && (value & (value - 1)) === 0;

// scrypt's N
const passwordHashCostSchema = z
  .number()
  .int()
  .refine(isPowerOfTwo, "The password hash cost must be a power of 2");

export {defaultPasswordHashCost, passwordHashCostSchema};
export type {PasswordHashCost};
