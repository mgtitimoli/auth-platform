import {style} from "@vanilla-extract/css";

import {applicationThemeVars} from "@/client/components/application/application-theme.css";

const root = style({
  display: "flex",
  flexDirection: "column",
  gap: applicationThemeVars.space.sm,
  padding: applicationThemeVars.space.xl
});

const title = style({
  fontSize: applicationThemeVars.fontSizes.xl,
  margin: 0
});

const description = style({
  color: applicationThemeVars.colors.mutedForeground,
  margin: 0
});

export {description, root, title};
