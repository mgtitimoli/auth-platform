import {style} from "@vanilla-extract/css";

import {applicationThemeVars} from "@/client/components/application/application-theme.css";

const {colors, fontSizes, radii, space} = applicationThemeVars;

const trigger = style({
  alignItems: "center",
  background: colors.background,
  border: "1px solid " + colors.border,
  borderRadius: radii.md,
  color: colors.foreground,
  cursor: "pointer",
  display: "flex",
  font: "inherit",
  justifyContent: "space-between",
  padding: space.sm,
  selectors: {
    "&[data-disabled]": {
      color: colors.mutedForeground,
      cursor: "not-allowed"
    }
  }
});

const popup = style({
  background: colors.background,
  border: "1px solid " + colors.border,
  borderRadius: radii.md,
  boxShadow: "0 4px 16px rgb(0 0 0 / 0.12)",
  color: colors.foreground,
  minWidth: "var(--anchor-width)",
  padding: space.sm
});

const item = style({
  alignItems: "center",
  borderRadius: radii.md,
  cursor: "pointer",
  display: "flex",
  fontSize: fontSizes.sm,
  outline: "none",
  padding: space.sm,
  selectors: {
    "&[data-highlighted]": {
      background: colors.border
    }
  }
});

const itemIndicator = style({
  display: "inline-flex",
  marginLeft: "auto"
});

export {item, itemIndicator, popup, trigger};
