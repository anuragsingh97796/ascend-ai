import type { Config } from "tailwindcss";

/**
 * Tailwind CSS v4 Configuration — Ascend AI Design System
 *
 * Extends Tailwind with our custom design tokens defined as
 * CSS custom properties in styles/globals.css.
 *
 * Color values use RGB channels so Tailwind can apply opacity modifiers.
 * Example: `text-brand-500/80` → rgb(139 92 246 / 0.8)
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/**/*.css",
  ],
  theme: {
    extend: {
      /* ─── Colors ─────────────────────────────────────── */
      colors: {
        brand: {
          50: "rgb(var(--color-brand-50) / <alpha-value>)",
          100: "rgb(var(--color-brand-100) / <alpha-value>)",
          200: "rgb(var(--color-brand-200) / <alpha-value>)",
          300: "rgb(var(--color-brand-300) / <alpha-value>)",
          400: "rgb(var(--color-brand-400) / <alpha-value>)",
          500: "rgb(var(--color-brand-500) / <alpha-value>)",
          600: "rgb(var(--color-brand-600) / <alpha-value>)",
          700: "rgb(var(--color-brand-700) / <alpha-value>)",
          800: "rgb(var(--color-brand-800) / <alpha-value>)",
          900: "rgb(var(--color-brand-900) / <alpha-value>)",
          950: "rgb(var(--color-brand-950) / <alpha-value>)",
        },
        accent: {
          cyan: "rgb(var(--color-accent-cyan) / <alpha-value>)",
          indigo: "rgb(var(--color-accent-indigo) / <alpha-value>)",
          rose: "rgb(var(--color-accent-rose) / <alpha-value>)",
          amber: "rgb(var(--color-accent-amber) / <alpha-value>)",
          emerald: "rgb(var(--color-accent-emerald) / <alpha-value>)",
        },
        background: {
          DEFAULT: "rgb(var(--color-background) / <alpha-value>)",
          secondary: "rgb(var(--color-background-secondary) / <alpha-value>)",
          tertiary: "rgb(var(--color-background-tertiary) / <alpha-value>)",
        },
        surface: {
          DEFAULT: "rgb(var(--color-surface) / <alpha-value>)",
          elevated: "rgb(var(--color-surface-elevated) / <alpha-value>)",
        },
        border: {
          DEFAULT: "rgb(var(--color-border) / <alpha-value>)",
          subtle: "rgb(var(--color-border-subtle) / <alpha-value>)",
        },
        text: {
          primary: "rgb(var(--color-text-primary) / <alpha-value>)",
          secondary: "rgb(var(--color-text-secondary) / <alpha-value>)",
          tertiary: "rgb(var(--color-text-tertiary) / <alpha-value>)",
          disabled: "rgb(var(--color-text-disabled) / <alpha-value>)",
          inverse: "rgb(var(--color-text-inverse) / <alpha-value>)",
        },
        success: "rgb(var(--color-success) / <alpha-value>)",
        warning: "rgb(var(--color-warning) / <alpha-value>)",
        error: "rgb(var(--color-error) / <alpha-value>)",
        info: "rgb(var(--color-info) / <alpha-value>)",
      },

      /* ─── Typography ─────────────────────────────────── */
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },

      /* ─── Spacing ─────────────────────────────────────── */
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "26": "6.5rem",
        "30": "7.5rem",
        "34": "8.5rem",
        "sidebar": "16rem",
        "sidebar-collapsed": "4.5rem",
        "navbar": "4rem",
      },

      /* ─── Border Radius ──────────────────────────────── */
      borderRadius: {
        none: "var(--radius-none)",
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        "3xl": "var(--radius-3xl)",
        "4xl": "var(--radius-4xl)",
        full: "var(--radius-full)",
      },

      /* ─── Box Shadow ─────────────────────────────────── */
      boxShadow: {
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        "2xl": "var(--shadow-2xl)",
        brand: "var(--shadow-brand)",
        glow: "var(--shadow-glow)",
        none: "none",
      },

      /* ─── Keyframe Animations ────────────────────────── */
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-down": {
          from: { opacity: "0", transform: "translateY(-16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "pulse-glow": {
          "0%, 100%": {
            boxShadow: "0 0 20px rgb(139 92 246 / 0.3)",
          },
          "50%": {
            boxShadow:
              "0 0 40px rgb(139 92 246 / 0.6), 0 0 80px rgb(139 92 246 / 0.2)",
          },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },

      /* ─── Animation Durations ────────────────────────── */
      animation: {
        "fade-in": "fade-in 500ms ease-out forwards",
        "fade-in-up": "fade-in-up 500ms ease-out forwards",
        "fade-in-down": "fade-in-down 500ms ease-out forwards",
        "scale-in": "scale-in 300ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        float: "float 3s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        "gradient-shift": "gradient-shift 4s ease infinite",
        "spin-slow": "spin-slow 8s linear infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },

      /* ─── Max Width ──────────────────────────────────── */
      maxWidth: {
        "8xl": "88rem",
        "9xl": "96rem",
      },

      /* ─── Z-Index ────────────────────────────────────── */
      zIndex: {
        "60": "60",
        "70": "70",
        "80": "80",
        "90": "90",
        "100": "100",
      },

      /* ─── Backdrop Blur ──────────────────────────────── */
      backdropBlur: {
        xs: "2px",
        "4xl": "60px",
      },

      /* ─── Transition Duration ────────────────────────── */
      transitionDuration: {
        "50": "50ms",
        "2000": "2000ms",
      },
    },
  },
  plugins: [],
};

export default config;
