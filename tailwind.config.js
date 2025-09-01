/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0f172a',          // Fondo principal oscuro
        'dark-surface': '#1e293b',    // Fondo de tarjetas y sidebar
        'dark-border': '#334155',      // Bordes
        'dark-text-primary': '#f8fafc',// Texto principal (casi blanco)
        'dark-text-secondary': '#94a3b8',// Texto secundario (gris claro)
        'brand-accent': '#3b82f6',     // Acento de color (azul)
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Usaremos la fuente Inter
      },
    },
  },
  plugins: [],
}