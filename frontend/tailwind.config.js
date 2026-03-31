/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/app/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
    "./src/features/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      /* =========================
         COLOR SYSTEM (Hardcoded)
         ========================= */
      colors: {
        primary: "#3525cd",
        "primary-container": "#4f46e5",
        "on-primary": "#ffffff",
        "on-primary-container": "#dad7ff",

        secondary: "#10b981",
        "secondary-container": "#6ffbbe",
        "on-secondary": "#003828",
        "on-secondary-container": "#005c42",

        tertiary: "#f97316",
        "tertiary-container": "#ffb084",
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#5a1a00",

        /* Surface Hierarchy */
        surface: "#f8f9fa",
        "surface-variant": "#e1e3e4",
        "on-surface": "#191c1d",
        "on-surface-variant": "#464555",

        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f3f4f5",
        "surface-container": "#f8fafc",
        "surface-container-high": "#e7e8e9",
        "surface-container-highest": "#e1e3e4",

        outline: "#c7c4d8",
        "outline-variant": "#e5e7eb",

        background: "#f8f9fa",
        text: "#191c1d",
      },

      /* =========================
         TYPOGRAPHY
         ========================= */
      fontFamily: {
        headline: ["Manrope", "sans-serif"],
        body: ["Inter", "sans-serif"],
        label: ["Inter", "sans-serif"],
      },

      fontSize: {
        "display-lg": ["3.5rem", { lineHeight: "1.1" }],
        "display-md": ["2.5rem", { lineHeight: "1.2" }],
        "headline-lg": ["1.75rem", { lineHeight: "1.3" }],
        "headline-md": ["1.5rem", { lineHeight: "1.3" }],
        "body-lg": ["1rem", { lineHeight: "1.6" }],
        "body-md": ["0.875rem", { lineHeight: "1.6" }],
        "label-md": ["0.75rem", { lineHeight: "1.4" }],
      },

      /* =========================
         BORDER RADIUS (Soft UI)
         ========================= */
      borderRadius: {
        lg: "1rem",
        xl: "1.5rem",
        "2xl": "2rem",
        "3xl": "2.5rem",
      },

      /* =========================
         SHADOWS (Ambient Only)
         ========================= */
      boxShadow: {
        ambient: "0 20px 40px -10px rgba(77, 68, 227, 0.08)",
        soft: "0 10px 25px rgba(0,0,0,0.05)",
        glass: "0 8px 32px rgba(0,0,0,0.08)",
      },

      /* =========================
         BACKDROP BLUR (Glassmorphism)
         ========================= */
      backdropBlur: {
        glass: "20px",
      },

      /* =========================
         GRADIENTS
         ========================= */
      backgroundImage: {
        "primary-gradient":
          "linear-gradient(135deg, #3525cd, #4f46e5)",
      },

      /* =========================
         SPACING SYSTEM
         ========================= */
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        26: "6.5rem",
        30: "7.5rem",
      },

      /* =========================
         TRANSITIONS
         ========================= */
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },

      transitionDuration: {
        250: "250ms",
        400: "400ms",
      },
    },
  },
  plugins: [],
};

module.exports = config;