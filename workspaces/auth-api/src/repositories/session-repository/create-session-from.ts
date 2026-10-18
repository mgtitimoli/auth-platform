import type {Session} from "@mgtitimoli/auth-domain/domain-schema";

import type {SelectableSession} from "@/database/database-schema";

const createSessionFrom = (selectableSession: SelectableSession): Session => ({
  createdAt: selectableSession.createdAt,
  id: selectableSession.id,
  userId: selectableSession.userId,
  ...(selectableSession.terminationTime !== null && {
    terminationTime: selectableSession.terminationTime
  })
});

export {createSessionFrom};
