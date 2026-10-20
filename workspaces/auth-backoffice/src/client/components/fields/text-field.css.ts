import {style} from "@vanilla-extract/css";

import {applicationThemeVars} from "@/client/components/application/application-theme.css";

const {colors, fontSizes, radii, space} = applicationThemeVars;

const root = style({
  display: "flex",
  flexDirection: "column",
  gap: space.sm
});

const label = style({
  fontSize: fontSizes.sm,
  fontWeight: 500
});

const input = style({
  background: colors.background,
  border: "1px solid " + colors.border,
  borderRadius: radii.md,
  color: colors.foreground,
  font: "inherit",
  padding: space.sm,
  selectors: {
    "&[data-disabled]": {
      color: colors.mutedForeground,
      cursor: "not-allowed"
    },
    "&[data-invalid]": {
      borderColor: colors.danger
    }
  }
});

const description = style({
  color: colors.mutedForeground,
  fontSize: fontSizes.xs,
  margin: 0,
  // Half the field's gap: it belongs to the control above it
  marginTop: "calc(" + space.sm + " / -2)"
});

const error = style({
  color: colors.danger,
  fontSize: fontSizes.sm
});

export {description, error, input, label, root};
