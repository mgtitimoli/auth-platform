import {style} from "@vanilla-extract/css";

import {applicationThemeVars} from "@/client/components/application/application-theme.css";

const {fontSizes, space} = applicationThemeVars;

const root = style({
  display: "flex",
  flexDirection: "column",
  gap: space.lg
});

const title = style({
  fontSize: fontSizes.xl,
  margin: 0
});

export {root, title};
