/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        Green: '#27ae60',
        violet: '#8e44ad',
        red: '#e74c3c',
        customBlue: '#192434',
        customHoverBlue: '#1D4ED8',
      },
    },
  },
  plugins: [],
}

