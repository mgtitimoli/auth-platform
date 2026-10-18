type UserUniqueConstraintName =
  (typeof userUniqueConstraintNames)[keyof typeof userUniqueConstraintNames];

const userUniqueConstraintNames = {
  email: "users_email_unique"
} as const;

export {userUniqueConstraintNames};
export type {UserUniqueConstraintName};
