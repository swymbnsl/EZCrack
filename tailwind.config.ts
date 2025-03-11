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
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        poppins: ["var(--font-poppins)"],
      },
      typography: {
        DEFAULT: {
          css: {
            color: "#fff",
            a: {
              color: "#9333ea",
              "&:hover": {
                color: "#a855f7",
              },
            },
            strong: {
              color: "#fff",
            },
            h1: {
              color: "#fff",
            },
            h2: {
              color: "#fff",
            },
            h3: {
              color: "#fff",
            },
            h4: {
              color: "#fff",
            },
            code: {
              color: "#fff",
              backgroundColor: "rgba(147, 51, 234, 0.1)",
              borderRadius: "0.25rem",
              padding: "0.25rem",
            },
            "code::before": {
              content: '""',
            },
            "code::after": {
              content: '""',
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
