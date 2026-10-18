import {z} from "zod";

type UserStatus = (typeof userStatuses)[keyof typeof userStatuses];

const userStatuses = {
  active: "active",
  inactive: "inactive"
} as const;

const allUserStatuses = Object.values(userStatuses);

const userStatusSchema = z.enum(allUserStatuses);

export {allUserStatuses, userStatusSchema, userStatuses};
export type {UserStatus};
