/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0D8ABC',
        secondary: '#f8fafc',
        accent: '#f59e0b',
        dark: '#0f172a',
        muted: '#64748b',
        border: '#e2e8f0'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}
