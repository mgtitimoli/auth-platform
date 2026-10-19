import {globalStyle} from "@vanilla-extract/css";

import {applicationThemeVars} from "./application-theme.css";

globalStyle("*, *::before, *::after", {
  boxSizing: "border-box"
});

globalStyle("body", {
  backgroundColor: applicationThemeVars.colors.background,
  color: applicationThemeVars.colors.foreground,
  fontFamily: applicationThemeVars.fontFamilies.body,
  fontSize: applicationThemeVars.fontSizes.md,
  margin: 0
});
