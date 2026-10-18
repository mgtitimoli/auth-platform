type UserColumnName = (typeof userColumnNames)[keyof typeof userColumnNames];

const userColumnNames = {
  createdAt: "createdAt",
  email: "email",
  firstName: "firstName",
  id: "id",
  lastName: "lastName",
  loginsCounter: "loginsCounter",
  status: "status",
  updatedAt: "updatedAt"
} as const;

const allUserColumnNames = Object.values(userColumnNames);

export {allUserColumnNames, userColumnNames};
export type {UserColumnName};
