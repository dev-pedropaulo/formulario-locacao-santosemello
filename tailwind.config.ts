import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          950: "#070d18",
          900: "#0b1629",
          800: "#0f1f38",
          700: "#162d50",
          600: "#1b365d",
          500: "#24497d",
          100: "#d9e2ec",
          50: "#f0f4f8",
        },
        gold: {
          400: "#d9b873",
          500: "#c5a059",
          600: "#b08b47",
          700: "#927233",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 25px -5px rgba(197, 160, 89, 0.25)",
        card: "0 4px 20px -2px rgba(15, 31, 56, 0.05)",
      },
    },
  },
  plugins: [],
};
export default config;
