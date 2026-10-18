import type {Session} from "./domain-schema";
import * as withOpaqueToken from "./opaque-token";

// 192 bits, express-session's default
const sessionIdByteLength = 24;

const createId = () => withOpaqueToken.create(sessionIdByteLength);

const isActive = (session: Session) => session.terminationTime === undefined;

export {createId, isActive};
