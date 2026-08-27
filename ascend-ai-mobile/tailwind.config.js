/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Brand - Iris
        iris: {
          50: '#F0F1FF',
          100: '#E0E3FF',
          200: '#C7CBFF',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          900: '#312E81',
        },
        // Dark theme surfaces
        zinc: {
          950: '#09090B',
          900: '#18181B',
          800: '#27272A',
          700: '#3F3F46',
          600: '#52525B',
          400: '#A1A1AA',
          300: '#D4D4D8',
          100: '#F4F4F5',
        },
        // Semantic
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
      },
      fontFamily: {
        sans: ['System'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};
