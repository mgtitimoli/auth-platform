import {z} from "zod";

const sortDirectionSchema = z.enum(["asc", "desc"]);

type SortDirection = z.infer<typeof sortDirectionSchema>;

export {sortDirectionSchema};
export type {SortDirection};
