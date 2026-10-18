import {z} from "zod";

import {userStatusSchema} from "./user-status";

type CreateUserInput = z.infer<typeof createUserInputSchema>;

type OpaqueToken = z.infer<typeof opaqueTokenSchema>;

type Session = z.infer<typeof sessionSchema>;

type SignInInput = z.infer<typeof signInInputSchema>;

type SignUpInput = z.infer<typeof signUpInputSchema>;

type User = z.infer<typeof userSchema>;

type UserCredential = z.infer<typeof userCredentialSchema>;

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

const createUserInputSchema = z
  .object({
    email: emailSchema,
    firstName: nameSchema,
    lastName: nameSchema,
    password: passwordSchema
  })
  .meta({ref: "CreateUserInput"});

const signUpInputSchema = z
  .object({
    email: emailSchema,
    firstName: nameSchema,
    lastName: nameSchema,
    password: passwordSchema
  })
  .meta({ref: "SignUpInput"});

// The password policy is only checked on sign-up, so sign-in doesn't reveal it
const signInInputSchema = z
  .object({
    email: emailSchema,
    password: z.string().min(1)
  })
  .meta({ref: "SignInInput"});

export {
  createUserInputSchema,
  opaqueTokenSchema,
  passwordSchema,
  sessionSchema,
  signInInputSchema,
  signUpInputSchema,
  userCredentialSchema,
  userSchema
};
export type {
  CreateUserInput,
  OpaqueToken,
  Session,
  SignInInput,
  SignUpInput,
  User,
  UserCredential
};
