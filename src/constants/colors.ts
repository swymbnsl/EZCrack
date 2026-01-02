// =============================================================================
// LIGHT THEME COLORS
// =============================================================================
export const lightTheme = {
  // Primary colors
  primary: "#76ABAE", // Teal - main accent color
  primaryHover: "#5a8f91", // Darker teal for hover states

  // Secondary colors
  secondary: "#FFD56B", // Yellow - secondary accent
  secondaryAlt: "#FFB26B", // Orange-yellow variant

  // Accent/CTA colors
  accent: "#FF7B54", // Orange - call-to-action, important elements
  accentHover: "#e66a45", // Darker orange for hover

  // Background colors
  background: "#FFFFFF", // White - main background
  backgroundAlt: "#F8F8F8", // Light gray - alternate background
  backgroundMuted: "#EFEFEF", // Muted gray background
  // backgroundCard: "#F5F5F5", // Card background
  backgroundCard: "#FFFFFF", // Card background
  backgroundPaper: "#FFFFFA", // Off-white paper-like background
  backgroundQuestionViewCard: "#F5F5F0", // Very light background with slight warmth

  // Text colors
  // text: "#2D2A32", // Dark gray - primary text
  text: "#000000", // Dark gray - primary text
  textMuted: "#6b7280", // Muted text (with opacity in usage)
  textOnPrimary: "#000000", // Text on primary backgrounds
  textOnAccent: "#000000", // Text on accent backgrounds

  // Border colors
  border: "#000000", // Black - neobrutalism borders

  // Semantic colors
  success: "#76ABAE", // Same as primary
  warning: "#FFD56B", // Same as secondary
  error: "#FF7B54", // Same as accent

  // Special colors
  linkedin: "#0A66C2", // LinkedIn brand color
  linkedinHover: "#004182", // LinkedIn hover state

  // Neutral/Gray colors
  gray: "#424C4D", // Dark gray for shapes/accents
} as const

// =============================================================================
// DARK THEME COLORS
// =============================================================================
export const darkTheme = {
  // Primary colors
  primary: "#4ECDC4", // Cyan-teal - main accent color
  primaryHover: "#3dbdb5", // Darker cyan for hover states

  // Secondary colors
  secondary: "#FFE66D", // Bright yellow - secondary accent
  secondaryAlt: "#FF9F1C", // Orange variant

  // Accent/CTA colors
  accent: "#FF6B6B", // Coral red - call-to-action
  accentHover: "#e85a5a", // Darker coral for hover

  // Background colors
  background: "#121212", // Very dark - main background
  backgroundCard: "#1E1E1E", // Slightly lighter - card backgrounds
  backgroundMuted: "#252525", // Muted dark background
  backgroundCode: "#1a1a1a", // Code block background
  backgroundQuestionViewCard: "#121212", // Dark card background
  // Text colors
  text: "#FFFFFF", // White - primary text
  textMuted: "#9CA3AF", // Light gray - muted text (using gray-400)
  textOnPrimary: "#121212", // Dark text on primary backgrounds
  textOnAccent: "#121212", // Dark text on accent backgrounds

  // Border colors
  border: "#FFFFFF", // White - neobrutalism borders

  // Semantic colors
  success: "#4ECDC4", // Same as primary
  warning: "#FFE66D", // Same as secondary
  error: "#FF6B6B", // Same as accent

  // Special colors
  linkedin: "#0A66C2", // LinkedIn brand color
  linkedinHover: "#004182", // LinkedIn hover state

  // Additional accent colors (for animated background)
  accentGreen: "#7A9E7E", // Muted green
  accentPink: "#F38181", // Soft pink
} as const

// =============================================================================
// COMMON/SHARED COLORS
// =============================================================================
export const commonColors = {
  // Transparent overlays
  overlay: "rgba(0, 0, 0, 0.7)",

  // Shadow colors
  shadowLight: "rgba(0, 0, 0, 1)",
  shadowDark: "rgba(255, 255, 255, 0.8)",
} as const

// =============================================================================
// TAILWIND CLASS HELPERS
// =============================================================================

/**
 * Get theme-aware color classes
 * @param isLight - Whether light theme is active
 * @returns Object with color class names
 */
export const getThemeColors = (isLight: boolean) => ({
  // Primary
  bgPrimary: isLight ? "bg-neo-primary-light" : "bg-neo-primary-dark",
  textPrimary: isLight ? "text-neo-primary-light" : "text-neo-primary-dark",
  borderPrimary: isLight
    ? "border-neo-primary-light"
    : "border-neo-primary-dark",

  // Secondary
  bgSecondary: isLight ? "bg-neo-secondary-light" : "bg-neo-secondary-dark",
  textSecondary: isLight
    ? "text-neo-secondary-light"
    : "text-neo-secondary-dark",

  // Accent
  bgAccent: isLight ? "bg-neo-accent-light" : "bg-neo-accent-dark",
  textAccent: isLight ? "text-neo-accent-light" : "text-neo-accent-dark",

  // Background
  bgMain: isLight ? "bg-neo-bg-light" : "bg-neo-bg-dark",
  bgCard: isLight ? "bg-neo-card-light" : "bg-neo-card-dark",

  // Text
  textMain: isLight ? "text-neo-text-light" : "text-neo-text-dark",
  textMuted: isLight ? "text-neo-text-light/80" : "text-gray-300",

  // Border
  borderMain: isLight ? "border-black" : "border-white",

  // Neobrutalism shadows
  shadow: isLight
    ? "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
    : "shadow-[4px_4px_0px_0px_rgba(255,255,255,0.8)]",
  shadowHover: isLight
    ? "shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
    : "shadow-[6px_6px_0px_0px_rgba(255,255,255,0.8)]",
  shadowLarge: isLight
    ? "shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
    : "shadow-[8px_8px_0px_0px_rgba(255,255,255,0.8)]",
})

export type LightTheme = typeof lightTheme
export type DarkTheme = typeof darkTheme
export type CommonColors = typeof commonColors
