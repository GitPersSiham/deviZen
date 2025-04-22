import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [{
      mydark: {
        "primary": "#4F46E5",
        "secondary": "#7C3AED",
        "accent": "#37CDBE",
        "neutral": "#2A2E37",
        "base-100": "#1F2937",
        "base-200": "#111827",
        "base-300": "#0F172A",
        "info": "#3ABFF8",
        "success": "#36D399",
        "warning": "#FBBD23",
        "error": "#F87272",
      },
    }],
  },
} satisfies Config;
