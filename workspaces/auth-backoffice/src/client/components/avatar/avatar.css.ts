import {style} from "@vanilla-extract/css";

import {applicationThemeVars} from "@/client/components/application/application-theme.css";

const {colors, fontSizes} = applicationThemeVars;

const root = style({
  alignItems: "center",
  background: colors.primary,
  borderRadius: "50%",
  color: colors.primaryForeground,
  display: "inline-flex",
  height: "2rem",
  justifyContent: "center",
  overflow: "hidden",
  width: "2rem"
});

const fallback = style({
  fontSize: fontSizes.sm,
  fontWeight: 600
});

export {fallback, root};
