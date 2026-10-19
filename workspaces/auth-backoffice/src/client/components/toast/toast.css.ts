import {style} from "@vanilla-extract/css";

import {applicationThemeVars} from "@/client/components/application/application-theme.css";

const {colors, fontSizes, radii, space} = applicationThemeVars;

const viewport = style({
  bottom: space.lg,
  display: "flex",
  flexDirection: "column",
  gap: space.sm,
  position: "fixed",
  right: space.lg,
  width: "min(22rem, calc(100vw - 2 * " + space.lg + "))"
});

const root = style({
  alignItems: "center",
  background: colors.background,
  border: "1px solid " + colors.border,
  borderRadius: radii.md,
  boxShadow: "0 4px 16px rgb(0 0 0 / 0.12)",
  color: colors.foreground,
  display: "flex",
  gap: space.sm,
  justifyContent: "space-between",
  padding: space.md
});

const title = style({
  fontSize: fontSizes.sm,
  margin: 0
});

const close = style({
  background: "none",
  border: "none",
  color: colors.mutedForeground,
  cursor: "pointer",
  display: "inline-flex",
  padding: 0
});

export {close, root, title, viewport};
