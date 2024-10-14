/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    fontFamily: {
      sans: ["Raleway", "sans-serif"],
    },
    extend: {
      colors: {
        darkblue: "#1E213A",
        gray: {
          150: "E7E7EB",
          250: "A09FB1",
          350: "88869D",
        },
      },
      spacing: {
        64: "16rem",
      },
    },
  },
  plugins: [require("tw-elements-react/dist/plugin.cjs")],
};
