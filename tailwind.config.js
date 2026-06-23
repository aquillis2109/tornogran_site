/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        graphite: '#172529',
        'graphite-2': '#edf2f4',
        petroleum: '#0f3b46',
        steel: '#62747b',
        orange: '#f47b20',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 40px rgba(244, 123, 32, 0.16)',
      },
    },
  },
  plugins: [],
};
