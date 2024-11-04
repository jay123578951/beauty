/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
    "./node_modules/flowbite/**/*.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#F4F1EC",
          DEFAULT: "#D0C5B6",
          dark: "#23262C",
        },
      },
      textColor: {
        DEFAULT: "#23262C",
      },
      aspectRatio: {
        "3/2": "3 / 2",
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
