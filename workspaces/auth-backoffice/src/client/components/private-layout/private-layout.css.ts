import {style} from "@vanilla-extract/css";

import {applicationThemeVars} from "@/client/components/application/application-theme.css";

const {colors, fontSizes, space} = applicationThemeVars;

const header = style({
  alignItems: "center",
  borderBottom: "1px solid " + colors.border,
  display: "flex",
  height: "3.5rem",
  justifyContent: "space-between",
  padding: "0 " + space.lg
});

const appName = style({
  fontSize: fontSizes.md,
  fontWeight: 600
});

const main = style({
  padding: space.xl + " " + space.lg
});

export {appName, header, main};
