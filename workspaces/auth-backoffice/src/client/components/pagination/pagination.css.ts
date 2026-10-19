import {style} from "@vanilla-extract/css";

import {applicationThemeVars} from "@/client/components/application/application-theme.css";

const {colors, fontSizes, space} = applicationThemeVars;

const root = style({
  alignItems: "center",
  display: "flex",
  gap: space.md,
  justifyContent: "flex-end"
});

const status = style({
  color: colors.mutedForeground,
  fontSize: fontSizes.sm
});

export {root, status};
