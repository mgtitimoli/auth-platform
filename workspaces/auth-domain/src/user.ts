import type {User} from "./domain-schema";
import {userStatuses} from "./user-status";

const isActive = (user: User) => user.status === userStatuses.active;

export {isActive};
