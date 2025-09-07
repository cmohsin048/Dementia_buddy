/**
 * Award-winning color palette inspired by modern health and wellness apps
 * Features accessibility-compliant colors with beautiful gradients and modern design
 */

// Primary brand colors - Calming blue palette
const primaryBlue = "#4A90E2";
const primaryBlueDark = "#357ABD";
const primaryBlueLight = "#6BA3E8";

// Secondary colors - Warm, supportive palette
const secondaryGreen = "#7ED321";
const secondaryGreenDark = "#6BB91A";
const secondaryGreenLight = "#9AE03A";

// Accent colors
const accentPurple = "#9013FE";
const accentOrange = "#FF6B35";
const accentCoral = "#FF8A80";

// Neutral palette
const neutralGray = "#8E8E93";
const neutralGrayLight = "#F2F2F7";
const neutralGrayDark = "#3A3A3C";

// Status colors
const successGreen = "#34C759";
const warningOrange = "#FF9500";
const errorRed = "#FF3B30";
const infoBlue = "#007AFF";

// Background colors
const backgroundLight = "#FFFFFF";
const backgroundSecondary = "#F8F9FA";
const backgroundDark = "#1C1C1E";
const backgroundDarkSecondary = "#2C2C2E";

// Text colors
const textPrimary = "#1D1D1F";
const textSecondary = "#8E8E93";
const textTertiary = "#C7C7CC";
const textInverse = "#FFFFFF";

// Shadow colors
const shadowLight = "rgba(0, 0, 0, 0.1)";
const shadowMedium = "rgba(0, 0, 0, 0.15)";
const shadowDark = "rgba(0, 0, 0, 0.25)";

export const Colors = {
  light: {
    // Primary colors
    primary: primaryBlue,
    primaryDark: primaryBlueDark,
    primaryLight: primaryBlueLight,

    // Secondary colors
    secondary: secondaryGreen,
    secondaryDark: secondaryGreenDark,
    secondaryLight: secondaryGreenLight,

    // Accent colors
    accent: accentPurple,
    accentOrange: accentOrange,
    accentCoral: accentCoral,

    // Background colors
    background: backgroundLight,
    backgroundSecondary: backgroundSecondary,
    surface: "#FFFFFF",
    surfaceElevated: "#FFFFFF",

    // Text colors
    text: textPrimary,
    textSecondary: textSecondary,
    textTertiary: textTertiary,
    textInverse: textInverse,

    // Status colors
    success: successGreen,
    warning: warningOrange,
    error: errorRed,
    info: infoBlue,

    // Border and divider colors
    border: "#E5E5EA",
    divider: "#F2F2F7",

    // Icon colors
    icon: neutralGray,
    iconSelected: primaryBlue,
    iconDisabled: textTertiary,

    // Tab colors
    tabIconDefault: neutralGray,
    tabIconSelected: primaryBlue,
    tabBackground: backgroundLight,

    // Shadow colors
    shadow: shadowLight,
    shadowMedium: shadowMedium,

    // Gradient colors
    gradientStart: primaryBlue,
    gradientEnd: primaryBlueLight,
    gradientSecondaryStart: secondaryGreen,
    gradientSecondaryEnd: secondaryGreenLight,
  },
  dark: {
    // Primary colors
    primary: primaryBlueLight,
    primaryDark: primaryBlue,
    primaryLight: "#8BB5F0",

    // Secondary colors
    secondary: secondaryGreenLight,
    secondaryDark: secondaryGreen,
    secondaryLight: "#B3E85A",

    // Accent colors
    accent: "#B347FF",
    accentOrange: "#FF8A65",
    accentCoral: "#FFAB91",

    // Background colors
    background: backgroundDark,
    backgroundSecondary: backgroundDarkSecondary,
    surface: "#2C2C2E",
    surfaceElevated: "#3A3A3C",

    // Text colors
    text: textInverse,
    textSecondary: "#8E8E93",
    textTertiary: "#636366",
    textInverse: textPrimary,

    // Status colors
    success: "#30D158",
    warning: "#FF9F0A",
    error: "#FF453A",
    info: "#0A84FF",

    // Border and divider colors
    border: "#38383A",
    divider: "#2C2C2E",

    // Icon colors
    icon: "#8E8E93",
    iconSelected: primaryBlueLight,
    iconDisabled: "#636366",

    // Tab colors
    tabIconDefault: "#8E8E93",
    tabIconSelected: primaryBlueLight,
    tabBackground: backgroundDark,

    // Shadow colors
    shadow: "rgba(0, 0, 0, 0.3)",
    shadowMedium: "rgba(0, 0, 0, 0.4)",

    // Gradient colors
    gradientStart: primaryBlueLight,
    gradientEnd: "#8BB5F0",
    gradientSecondaryStart: secondaryGreenLight,
    gradientSecondaryEnd: "#B3E85A",
  },

  // Common colors that work in both themes
  common: {
    white: "#FFFFFF",
    black: "#000000",
    transparent: "transparent",

    // Status colors (consistent across themes)
    success: successGreen,
    warning: warningOrange,
    error: errorRed,
    info: infoBlue,

    // Reminder status colors
    reminderTaken: successGreen,
    reminderMissed: errorRed,
    reminderPending: warningOrange,
    reminderOverdue: "#FF6B6B",
  },
};
