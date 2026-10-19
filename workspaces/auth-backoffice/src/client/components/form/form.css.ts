import {style} from "@vanilla-extract/css";

import {applicationThemeVars} from "@/client/components/application/application-theme.css";

const {colors, fontSizes, space} = applicationThemeVars;

const fieldset = style({
  border: "none",
  display: "flex",
  flexDirection: "column",
  gap: space.md,
  margin: 0,
  padding: 0
});

const error = style({
  color: colors.danger,
  fontSize: fontSizes.sm,
  margin: 0
});

export {error, fieldset};
