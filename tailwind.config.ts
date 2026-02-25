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
        fpl: {
          purple: "#28002B",
          "purple-dark": "#1F0022",
          "purple-light": "#37003C",
          accent: "#FFE65B",
          100: "#EBE5EB",
          200: "#D7CCD8",
          300: "#C3B2C4",
          400: "#AF99B1",
          500: "#9B809D",
          600: "#87668A",
          700: "#7D5980",
          800: "#541E5D",
          900: "#41054B",
          1000: "#37003C",
          1100: "#28002B",
          1200: "#1E0021",
        },
      },
      fontFamily: {
        sans: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
