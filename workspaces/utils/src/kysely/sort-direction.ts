import {z} from "zod";

type SortDirection = z.infer<typeof sortDirectionSchema>;

const sortDirectionSchema = z.enum(["asc", "desc"]);

export {sortDirectionSchema};
export type {SortDirection};
