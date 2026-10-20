import {style, styleVariants} from "@vanilla-extract/css";

import {applicationThemeVars} from "@/client/components/application/application-theme.css";

import {menuItemVariants} from "./menu-item-variant";

const {colors, fontSizes, radii, space} = applicationThemeVars;

const trigger = style({
  background: "none",
  border: "none",
  borderRadius: "50%",
  cursor: "pointer",
  display: "inline-flex",
  padding: 0
});

const popup = style({
  background: colors.background,
  border: "1px solid " + colors.border,
  borderRadius: radii.md,
  boxShadow: "0 4px 16px rgb(0 0 0 / 0.12)",
  color: colors.foreground,
  minWidth: "6rem",
  padding: space.sm
});

const item = style({
  borderRadius: radii.md,
  cursor: "pointer",
  fontSize: fontSizes.sm,
  outline: "none",
  padding: space.sm,
  selectors: {
    "&[data-disabled]": {
      cursor: "not-allowed",
      opacity: 0.5
    },
    "&[data-highlighted]": {
      background: colors.border
    }
  }
});

const itemVariants = styleVariants({
  [menuItemVariants.danger]: [item, {color: colors.danger}],
  [menuItemVariants.default]: [item]
});

const radioItem = style([
  item,
  {
    alignItems: "center",
    display: "flex",
    gap: space.sm
  }
]);

const radioItemIndicator = style({
  display: "inline-flex",
  marginLeft: "auto"
});

const groupLabel = style({
  color: colors.mutedForeground,
  fontSize: fontSizes.sm,
  padding: space.sm
});

const separator = style({
  background: colors.border,
  height: "1px",
  margin: space.sm + " 0"
});

export {
  groupLabel,
  item,
  itemVariants,
  popup,
  radioItem,
  radioItemIndicator,
  separator,
  trigger
};
