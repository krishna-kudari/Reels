/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        Inter: ["Inter var", "sans serif"],
      },
      animation: {
        "fill-radial": "fill 2s forwards",
      },
      keyframes: {
        fill: {
          "0% 100%": {
            background: "radial-gradient(circle, #000 0%, #000 100%)",
          },
        },
      },
    },
  },
  plugins: [],
};
