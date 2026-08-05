import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fff1f2",
          100: "#ffe1e3",
          200: "#ffc9cd",
          300: "#ffa2a8",
          400: "#ff6b74",
          500: "#f83a45",
          600: "#e61e2e",
          700: "#c11022",
          800: "#a01221",
          900: "#851622",
          950: "#490610",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,.06), 0 4px 16px rgba(0,0,0,.05)",
        "card-hover": "0 4px 12px rgba(230,30,46,.12), 0 8px 28px rgba(0,0,0,.08)",
        glow: "0 0 0 4px rgba(248,58,69,.12)",
      },
      animation: {
        "fade-up": "fadeUp .5s ease-out both",
        float: "float 6s ease-in-out infinite",
        "pulse-ring": "pulseRing 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        pulseRing: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: ".4" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
