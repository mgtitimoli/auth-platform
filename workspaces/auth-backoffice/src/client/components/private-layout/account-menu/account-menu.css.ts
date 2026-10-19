import {style} from "@vanilla-extract/css";

import {applicationThemeVars} from "@/client/components/application/application-theme.css";

const {colors, fontSizes, space} = applicationThemeVars;

const user = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.125rem",
  padding: space.sm
});

const name = style({
  fontSize: fontSizes.sm,
  fontWeight: 600
});

const email = style({
  color: colors.mutedForeground,
  fontSize: fontSizes.sm
});

export {email, name, user};
