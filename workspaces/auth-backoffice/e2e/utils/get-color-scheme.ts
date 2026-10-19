import type {Page} from "@playwright/test";

// Set by the theme's CSS together with its colors, so it tells which theme
// applies without depending on their values
const getColorScheme = (page: Page) =>
  page.evaluate(() => getComputedStyle(document.documentElement).colorScheme);

export {getColorScheme};
