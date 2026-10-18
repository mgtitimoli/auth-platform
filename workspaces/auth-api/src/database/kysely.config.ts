import {defineConfig} from "kysely-ctl";

import {databaseDialect, databasePlugins} from "./database";

// The environment variables are loaded by scripts/database.sh, from the env
// file of the environment it's given
const kyselyConfig = defineConfig({
  dialect: databaseDialect,
  plugins: databasePlugins
});

export default kyselyConfig;
