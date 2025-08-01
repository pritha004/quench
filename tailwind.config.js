/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "bg":"#19191a",
        "surface": '#2b2b2b',
        "primary": "#5BC8AF",
        "accent": "#82D4C9",
        "textprimary": "#E0E6E9",
        "textsecondary": "#A3B1B9",
        "cta": "#3AAFA9",
      },
      fontFamily: {
        "inter": ["Inter"],
        "inter-italic": ["Inter-Italic"],
        "raleway": ["Raleway", "sans-serif"],
      }
    },
  },
  plugins: [],
};
