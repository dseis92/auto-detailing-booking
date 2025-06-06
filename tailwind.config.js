/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/flowbite/**/*.js", // ✅ add this line
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin'), // ✅ add this line
  ],
}