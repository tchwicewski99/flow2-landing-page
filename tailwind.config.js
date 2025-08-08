/** @type {import('tailwindcss').Config} */
module.exports = {
  // Upewnij się, że ścieżki do plików, które używają klas Tailwind, są poprawne.
  content: [
    './*.html',
    './src/**/*.{html,js}',
  ],
  plugins: [
    // W ten sposób ładuje się wtyczki JS w Tailwind
    require('@tailwindplus/elements'),
  ],
}