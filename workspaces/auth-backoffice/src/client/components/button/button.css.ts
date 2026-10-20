import {style, styleVariants} from "@vanilla-extract/css";

import {applicationThemeVars} from "@/client/components/application/application-theme.css";

import {buttonVariants} from "./button-variant";

const {colors, fontSizes, radii, space} = applicationThemeVars;

const base = style({
  border: "1px solid transparent",
  borderRadius: radii.md,
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

const variants = styleVariants({
  [buttonVariants.danger]: [
    base,
    {background: colors.danger, color: colors.primaryForeground}
  ],
  [buttonVariants.primary]: [
    base,
    {background: colors.primary, color: colors.primaryForeground}
  ],
  [buttonVariants.secondary]: [
    base,
    {
      background: "none",
      borderColor: colors.border,
      color: colors.foreground
    }
  ]
});

export {variants};
