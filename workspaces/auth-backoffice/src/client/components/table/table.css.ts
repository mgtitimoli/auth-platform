import {globalStyle, style} from "@vanilla-extract/css";

import {applicationThemeVars} from "@/client/components/application/application-theme.css";

const {colors, fontSizes, space} = applicationThemeVars;

const root = style({
  // Scrolls horizontally when the columns don't fit, instead of the page
  overflowX: "auto"
});

const table = style({
  borderCollapse: "collapse",
  fontSize: fontSizes.sm,
  selectors: {
    "&[aria-busy='true']": {
      opacity: 0.5
    }
  },
  // Widths come from the columns, not from the rows on screen, so they don't
  // shift between pages
  tableLayout: "fixed",
  transition: "opacity 150ms",
  width: "100%"
});

globalStyle(table + " th, " + table + " td", {
  borderBottom: "1px solid " + colors.border,
  padding: space.sm + " " + space.md,
  textAlign: "left"
});

globalStyle(table + " th", {
  color: colors.mutedForeground,
  fontWeight: 500
});

const cellText = style({
  display: "block",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap"
});

export {cellText, root, table};
