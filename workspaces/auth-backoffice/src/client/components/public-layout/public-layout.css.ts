import {style} from "@vanilla-extract/css";

import {applicationThemeVars} from "@/client/components/application/application-theme.css";

const {space} = applicationThemeVars;

const root = style({
  margin: "0 auto",
  maxWidth: "24rem",
  padding: space.xl + " " + space.md
});

export {root};
