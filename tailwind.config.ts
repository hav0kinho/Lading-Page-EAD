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
        background: "#0D1117",
        surface: "#161B22",
        "surface-border": "#30363D",
        primary: {
          DEFAULT: "#8A2BE2",
          hover: "#9d44e8",
          glow: "rgba(138, 43, 226, 0.45)",
        },
        accent: {
          DEFAULT: "#A855F7",
          cyan: "#00CED1",
        },
        text: {
          main: "#F0F0F0",
          muted: "#8B949E",
        },
      },
      fontFamily: {
        heading: ["var(--font-poppins)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 25px rgba(138, 43, 226, 0.4)",
        "glow-lg": "0 0 45px rgba(138, 43, 226, 0.55)",
      },
    },
  },
  plugins: [],
};
export default config;
