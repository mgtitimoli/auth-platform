import {defineConfig} from "kysely-ctl";

import {databaseDialect, databasePlugins} from "./database";

// The environment variables are loaded by scripts/environment.sh run, which
// the database script goes through
const kyselyConfig = defineConfig({
  dialect: databaseDialect,
  plugins: databasePlugins
});

export default kyselyConfig;
