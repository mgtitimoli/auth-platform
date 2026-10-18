type UserStatus = (typeof userStatuses)[keyof typeof userStatuses];

const userStatuses = {
  active: "active",
  inactive: "inactive"
} as const;

export {userStatuses};
export type {UserStatus};
