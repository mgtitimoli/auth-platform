type UserCredentialColumnName =
  (typeof userCredentialColumnNames)[keyof typeof userCredentialColumnNames];

const userCredentialColumnNames = {
  createdAt: "createdAt",
  passwordHash: "passwordHash",
  updatedAt: "updatedAt",
  userId: "userId"
} as const;

const allUserCredentialColumnNames = Object.values(userCredentialColumnNames);

export {allUserCredentialColumnNames, userCredentialColumnNames};
export type {UserCredentialColumnName};
