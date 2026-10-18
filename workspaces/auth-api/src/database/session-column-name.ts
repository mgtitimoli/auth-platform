type SessionColumnName =
  (typeof sessionColumnNames)[keyof typeof sessionColumnNames];

const sessionColumnNames = {
  createdAt: "createdAt",
  id: "id",
  terminationTime: "terminationTime",
  userId: "userId"
} as const;

const allSessionColumnNames = Object.values(sessionColumnNames);

export {allSessionColumnNames, sessionColumnNames};
export type {SessionColumnName};
