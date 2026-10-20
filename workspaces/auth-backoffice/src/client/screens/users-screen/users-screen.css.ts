import {style} from "@vanilla-extract/css";

import {applicationThemeVars} from "@/client/components/application/application-theme.css";

const {fontSizes, space} = applicationThemeVars;

const root = style({
  display: "flex",
  flexDirection: "column",
  gap: space.lg
});

const header = style({
  alignItems: "center",
  display: "flex",
  gap: space.md,
  justifyContent: "space-between"
});

const title = style({
  fontSize: fontSizes.lg,
  margin: 0
});

export {header, root, title};
