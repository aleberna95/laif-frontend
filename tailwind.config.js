/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'color-primary': '#f0f0f0', // Definisci il tuo colore personalizzato qui
      },
    },
  },
  plugins: [],
};
