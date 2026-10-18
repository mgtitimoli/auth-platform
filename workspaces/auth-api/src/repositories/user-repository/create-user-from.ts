import type {User} from "@mgtitimoli/auth-domain/domain-schema";

import type {SelectableUser} from "@/database/database-schema";

const createUserFrom = (selectableUser: SelectableUser): User => selectableUser;

export {createUserFrom};
