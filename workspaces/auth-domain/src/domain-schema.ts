import {z} from "zod";

import {userStatusSchema} from "./user-status";

const passwordMinLength = 8;

const passwordMaxLength = 128;

const nameSchema = z.string().trim().min(1).max(100);

const emailSchema = z.email().max(254);

const opaqueTokenSchema = z.string().min(1).meta({ref: "OpaqueToken"});

const passwordSchema = z
  .string()
  .min(passwordMinLength, {
    message: `Password must be at least ${passwordMinLength} characters long`
  })
  .max(passwordMaxLength, {
    message: `Password must be at most ${passwordMaxLength} characters long`
  })
  .regex(/\p{L}/u, {message: "Password must contain a letter"})
  .regex(/\p{N}/u, {message: "Password must contain a number"})
  .regex(/[^\p{L}\p{N}]/u, {
    message: "Password must contain a special character"
  })
  .meta({ref: "Password"});

const userSchema = z
  .object({
    createdAt: z.iso.datetime(),
    email: emailSchema,
    firstName: nameSchema,
    id: z.uuid(),
    lastName: nameSchema,
    loginsCounter: z.number().int().nonnegative(),
    status: userStatusSchema,
    updatedAt: z.iso.datetime()
  })
  .meta({ref: "User"});

const userCredentialSchema = z.object({
  createdAt: z.iso.datetime(),
  passwordHash: z.string(),
  updatedAt: z.iso.datetime(),
  userId: z.uuid()
});

const sessionSchema = z
  .object({
    createdAt: z.iso.datetime(),
    id: opaqueTokenSchema,
    terminationTime: z.iso.datetime().optional(),
    userId: z.uuid()
  })
  .meta({ref: "Session"});

const signUpInputSchema = z
  .object({
    email: emailSchema,
    firstName: nameSchema,
    lastName: nameSchema,
    password: passwordSchema
  })
  .meta({ref: "SignUpInput"});

type OpaqueToken = z.infer<typeof opaqueTokenSchema>;

type Session = z.infer<typeof sessionSchema>;

type SignUpInput = z.infer<typeof signUpInputSchema>;

type User = z.infer<typeof userSchema>;

type UserCredential = z.infer<typeof userCredentialSchema>;

export {
  opaqueTokenSchema,
  passwordSchema,
  sessionSchema,
  signUpInputSchema,
  userCredentialSchema,
  userSchema
};
export type {OpaqueToken, Session, SignUpInput, User, UserCredential};
