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
      colors: {
        systembgLight : {
          300 : "#FFFFFFFF",
          200 : "#F2F2F7FF",
          100 : "#FFFFFFFF",
        },
        systembgDark : {
          300 : "#000000FF",
          200 : "#1C1C1EFF",
          100 : "#2C2C2EFF",
        },
        systemGbgLight : {
          300 : "#F2F2F7FF",
          200 : "#FFFFFFFF",
          100 : "#F2F2F7FF",
        },
        systemGbgDark : {
          300 : "#000000FF",
          200 : "#1C1C1EFF",
          100 : "#2C2C2EFF",
        },
        systemLbLight : {
          400 : "#000000FF",
          300 : "#3C3C4399",
          200 : "#3C3C434D",
          100 : "#3C3C432E",
          placeh: "#3C3C434D",
        },
        systemLbDark : {
          400 : "#FFFFFFFF",
          300 : "#EBEBF599",
          200 : "#EBEBF54D",
          100 : "#EBEBF52E",
          placeh: "#EBEBF54D",
        },
        systemGrayLight : {
          600 : "#8E8E93FF",
          500 : "#AEAEB2FF",
          400 : "#C7C7CCFF",
          300 : "#D1D1D6FF",
          200 : "#E5E5EAFF",
          100 : "#F2F2F7FF",
        },
        systemGrayDark : {
          600 : "#8E8E93FF",
          500 : "#636366FF",
          400 : "#48484AFF",
          300 : "#3A3A3CFF",
          200 : "#2C2C2EFF",
          100 : "#1C1C1EFF",
        },
        systemSepDark : {
          sep: "#54545899",
          opaque: "#38383AFF",
        },
        systemSepLight : {
          sep: "#3C3C434A",
          opaque: "#C6C6C8FF",
        },
        systemTintLight:{
          pink: "#FF2D55FF",
          purple: "#AF52DEFF",
          orange: "#FF9500FF",
          yellow: "#FFCC00FF",
          red:"#FF3B30FF",
          teal: "#5AC8FAFF",
          blue: "#007AFFFF",
          green: "#34C759FF",
          indigo: "#5856D6FF"
        },
        systemTintDark:{
          pink: "#FF375FFF",
          purple: "#BF5AF2FF",
          orange: "#FF9F0AFF",
          yellow: "#FFD60AFF",
          red:"#FF453AFF",
          teal: "#64D2FFFF",
          blue: "#0A84FFFF",
          green: "#30D158FF",
          indigo: "#5E5CE6FF"
        },
      }
    },
  },
  plugins: [],
};
