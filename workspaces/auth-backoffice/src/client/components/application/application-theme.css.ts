import {
  assignVars,
  createThemeContract,
  globalStyle
} from "@vanilla-extract/css";

const applicationThemeVars = createThemeContract({
  colors: {
    background: null,
    border: null,
    foreground: null,
    mutedForeground: null
  },
  fontFamilies: {
    body: null
  },
  fontSizes: {
    lg: null,
    md: null,
    sm: null,
    xl: null
  },
  radii: {
    md: null
  },
  space: {
    lg: null,
    md: null,
    sm: null,
    xl: null
  }
});

const sharedValues = {
  fontFamilies: {
    body: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
  },
  fontSizes: {
    lg: "1.25rem",
    md: "1rem",
    sm: "0.875rem",
    xl: "1.875rem"
  },
  radii: {
    md: "0.5rem"
  },
  space: {
    lg: "1.5rem",
    md: "1rem",
    sm: "0.5rem",
    xl: "2.5rem"
  }
};

const lightValues = {
  ...sharedValues,
  colors: {
    background: "#ffffff",
    border: "#e5e5e5",
    foreground: "#0a0a0a",
    mutedForeground: "#737373"
  }
};

const darkValues = {
  ...sharedValues,
  colors: {
    background: "#0a0a0a",
    border: "#262626",
    foreground: "#fafafa",
    mutedForeground: "#a3a3a3"
  }
};

const darkColorSchemeQuery = "(prefers-color-scheme: dark)";

globalStyle(":root", {
  colorScheme: "light",
  vars: assignVars(applicationThemeVars, lightValues)
});

// The system theme, unless light was chosen explicitly
globalStyle(":root:not([data-theme='light'])", {
  "@media": {
    [darkColorSchemeQuery]: {
      colorScheme: "dark",
      vars: assignVars(applicationThemeVars, darkValues)
    }
  }
});

globalStyle(":root[data-theme='dark']", {
  colorScheme: "dark",
  vars: assignVars(applicationThemeVars, darkValues)
});

export {applicationThemeVars};
