import {style} from "@vanilla-extract/css";

import {applicationThemeVars} from "@/client/components/application/application-theme.css";

const {colors, radii, space} = applicationThemeVars;

const root = style({
  alignItems: "center",
  background: "none",
  border: "1px solid " + colors.border,
  borderRadius: radii.md,
  color: colors.foreground,
  cursor: "pointer",
  display: "inline-flex",
  justifyContent: "center",
  padding: space.sm,
  selectors: {
    "&[data-disabled]": {
      cursor: "not-allowed",
      opacity: 0.5
    }
  }
});

export {root};
