/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  darkMode: "class",
  theme: {
    minHeight: {
      section: "500px",
      main: "80vh",
      footer: "20vh",
      userSettings: "600px",
    },
    minWidth: {
      table: "460px",
    },
    extend: {
      width: {
        120: "480px",
        "3/10": "30%",
      },
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
        loadingElasticBefore: {
          "0%": {
            transform: "scale(1, 1)",
          },
          "25%": {
            transform: "scale(1, 1.5)",
          },
          "50%": {
            transform: "scale(1, 0.67)",
          },
          "75%": {
            transform: "scale(1, 1)",
          },
          "100%": {
            transform: "scale(1, 1)",
          },
        },
        loadingElastic: {
          "0%": {
            transform: "scale(1, 1)",
          },
          "25%": {
            transform: "scale(1, 1)",
          },
          "50%": {
            transform: "scale(1, 1.5)",
          },
          "75%": {
            transform: "scale(1, 1)",
          },
          "100%": {
            transform: "scale(1, 1)",
          },
        },
        loadingElasticAfter: {
          "0%": {
            transform: "scale(1, 1)",
          },
          "25%": {
            transform: "scale(1, 1)",
          },
          "50%": {
            transform: "scale(1, 0.67)",
          },
          "75%": {
            transform: "scale(1, 1.5)",
          },
          "100%": {
            transform: "scale(1, 1)",
          },
        },
      },
      animation: {
        fadeIn: "fadeIn 8s ease-in-out infinite",
        loadingElastic: "loadingElastic 1s infinite linear",
        loadingElasticBefore: "loadingElasticBefore 1s infinite linear",
        loadingElasticAfter: "loadingElasticAfter 1s infinite linear",
      },
    },
  },
  plugins: [],
};
