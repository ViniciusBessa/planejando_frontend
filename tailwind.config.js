/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  darkMode: "class",
  theme: {
    minHeight: {
      section: "500px",
    },
    extend: {
      colors: {
        primary: {
          900: "#1a41c0",
          800: "#0f62df",
          700: "#0074f2",
          600: "#0087ff",
          500: "#0096ff",
          400: "#22a6ff",
          300: "#56b6ff",
          200: "#8bcbff",
          100: "#badfff",
          50: "#e2f2ff",
        },
        dark: "#212529",
      },
      keyframes: {
        fadeIn: {
          "0%": { top: "8px", opacity: "0%" },
          "20%, 60%": { top: "36px", opacity: "100%" },
          "100%": { top: "36px", opacity: "0%" },
        },
      },
      animation: {
        fadeIn: "fadeIn 8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
