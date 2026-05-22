// frontend/src/constants/theme.ts
export const COLORS = {
  // Brand — deep violet primary, warm coral energy
  primary: "#7C5CFC",
  primaryLight: "#EDE8FF",
  primaryDark: "#5438D0",
  primaryGlow: "#7C5CFC30",

  coral: "#FF6B52",
  coralLight: "#FFF0ED",
  coralDark: "#CC4A34",

  gold: "#F5B942",
  goldLight: "#FEF6E4",

  // Surfaces — near-black depth
  bg: "#0D0D0F",
  bgCard: "#18181C",
  bgElevated: "#222228",
  bgSheet: "#1C1C22",

  // Text
  text: "#F5F4F2",
  textSecondary: "#9A98A6",
  textTertiary: "#5E5C6E",
  textInverse: "#0D0D0F",

  // Borders
  border: "#2C2C38",
  borderLight: "#3A3A4A",

  // Semantic
  success: "#3DD68C",
  successBg: "#0F2E1E",
  error: "#FF5A5A",
  errorBg: "#2E0F0F",
  warning: "#F5B942",
  warningBg: "#2E220F",

  // Talent badge colors
  singing:     { bg: "#1E1640", text: "#A78BFA" },
  dancing:     { bg: "#2E1028", text: "#F472B6" },
  cooking:     { bg: "#2E1800", text: "#FB923C" },
  art:         { bg: "#0F2E1E", text: "#34D399" },
  photography: { bg: "#0F1E2E", text: "#38BDF8" },
  comedy:      { bg: "#2E2800", text: "#FACC15" },
  fitness:     { bg: "#1E2E10", text: "#86EFAC" },
  fashion:     { bg: "#2E1020", text: "#F9A8D4" },
  music:       { bg: "#1A1040", text: "#818CF8" },
  poetry:      { bg: "#201020", text: "#D8B4FE" },
  default:     { bg: "#222228", text: "#9A98A6" },
};

export const FONTS = {
  heading: "Poppins_700Bold",
  headingMedium: "Poppins_600SemiBold",
  body: "Inter_400Regular",
  bodyMedium: "Inter_500Medium",
  mono: "SpaceMono_400Regular",
};

export const RADIUS = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  full: 999,
};

export const SHADOW = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  glow: {
    shadowColor: "#7C5CFC",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
};

export const TALENT_BADGE = (slug: string) =>
  COLORS[slug as keyof typeof COLORS] as { bg: string; text: string } ??
  COLORS.default;
