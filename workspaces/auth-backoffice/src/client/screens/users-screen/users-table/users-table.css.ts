import {style, styleVariants} from "@vanilla-extract/css";

import {applicationThemeVars} from "@/client/components/application/application-theme.css";

const {colors, fontSizes, space} = applicationThemeVars;

const statusBase = style({
  border: "1px solid " + colors.border,
  borderRadius: "999px",
  fontSize: fontSizes.sm,
  padding: "0 " + space.sm
});

const status = styleVariants({
  active: [statusBase, {color: colors.foreground}],
  inactive: [statusBase, {color: colors.mutedForeground}]
});

export {status};
