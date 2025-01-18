/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}", // Pre súbory v priečinku `pages`
    "./components/**/*.{js,ts,jsx,tsx}", // Pre súbory v priečinku `components`
    "./app/**/*.{js,ts,jsx,tsx}", // Ak používaš priečinok `app`
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
