import type { Config } from "tailwindcss"
import defaultTheme from "tailwindcss/defaultTheme"

const config = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Patoarchitekci-inspired color palette
        // Primary orange for emphasis and CTAs
        orange: {
          DEFAULT: "#ff4405",
          50: "#fff6f2",
          100: "#ffedde",
          200: "#ffd9b8",
          300: "#ffb882",
          400: "#ff8f47",
          500: "#ff4405",
          600: "#f03a04",
          700: "#c72e03",
          800: "#9f2607",
          900: "#7d1d05",
        },
        // Dark black for backgrounds and text
        "dark-black": {
          DEFAULT: "#1a1a1a",
          50: "#f7f7f7",
          100: "#e3e3e3",
          200: "#c7c7c7",
          300: "#a3a3a3",
          400: "#7a7a7a",
          500: "#555555",
          600: "#3a3a3a",
          700: "#262626",
          800: "#1a1a1a",
          900: "#0d0d0d",
        },
        // Accent yellow for secondary sections
        yellow: {
          DEFAULT: "#ffd700",
          50: "#fffef0",
          100: "#fffce0",
          200: "#fff9bb",
          300: "#fff695",
          400: "#ffed4e",
          500: "#ffd700",
          600: "#ffb700",
          700: "#cc9200",
          800: "#996d00",
          900: "#664800",
        },
        // Sky blue for additional accents
        "sky-blue": {
          DEFAULT: "#e0f2fe",
          50: "#f0f9fe",
          100: "#e0f2fe",
          200: "#b9e7fe",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c3d66",
        },
        // Pink accent for special highlights
        pink: {
          DEFAULT: "#ff1493",
          50: "#fff0f6",
          100: "#ffe1ed",
          200: "#ffc2db",
          300: "#ff93c3",
          400: "#ff57a2",
          500: "#ff1493",
          600: "#f50884",
          700: "#d90470",
          800: "#b10366",
          900: "#7a035f",
        },
        // Grayscale for neutral elements
        gray: {
          0: "#ffffff",
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
          950: "#030712",
        },
        // Semantic colors
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        primary: {
          DEFAULT: "hsl(var(--primary, 18 100% 50%) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground, 0 0% 100%) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary, 45 100% 50%) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground, 0 0% 9%) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive, 0 84% 60%) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground, 0 0% 100%) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted, 0 0% 96%) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground, 0 0% 45%) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent, 18 100% 50%) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground, 0 0% 100%) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover, 0 0% 100%) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground, 0 0% 10%) / <alpha-value>)",
        },
        card: {
          DEFAULT: "hsl(var(--card, 0 0% 100%) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground, 0 0% 10%) / <alpha-value>)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config


