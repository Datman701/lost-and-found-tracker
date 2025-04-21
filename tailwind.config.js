/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      container: {
        center: true,
        padding: '1rem'
      },
      minHeight: {
        'screen-without-nav': 'calc(100vh - 64px)'
      }
    },
  },
  plugins: [],
}