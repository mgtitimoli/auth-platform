import {style} from "@vanilla-extract/css";

import {applicationThemeVars} from "@/client/components/application/application-theme.css";

const {colors, fontSizes, radii, space} = applicationThemeVars;

const root = style({
  background: colors.primary,
  border: "none",
  borderRadius: radii.md,
  color: colors.primaryForeground,
  cursor: "pointer",
  font: "inherit",
  fontSize: fontSizes.sm,
  fontWeight: 500,
  padding: space.sm + " " + space.md,
  selectors: {
    "&[data-disabled]": {
      cursor: "not-allowed",
      opacity: 0.5
    }
  }
});

export {root};
