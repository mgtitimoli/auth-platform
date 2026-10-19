import {style} from "@vanilla-extract/css";

import {applicationThemeVars} from "@/client/components/application/application-theme.css";

const {colors} = applicationThemeVars;

const root = style({
  color: colors.foreground,
  fontWeight: 500,
  textDecoration: "underline",
  textUnderlineOffset: "0.2em"
});

export {root};
