/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  darkMode: "class",
  theme: {
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
      },
    },
  },
  plugins: [],
};
