/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#FFF8F8', // soft light background
        },
        text: {
          DEFAULT: '#2C1E1E', // deep visible text color
        },
        accent: {
          DEFAULT: '#D94371', // from banner, for buttons, highlights
          dark: '#B53059',
        },
        gold: {
          DEFAULT: '#FFD65E',
          dark: '#E6B800',
        },
        blush: {
          light: '#FDEDED',
        },
        error: {
          DEFAULT: '#D72638',
        },
        success: {
          DEFAULT: '#10B981',
          light: '#34D399',
          dark: '#059669',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FBBF24',
          dark: '#D97706',
        },
      },
      fontFamily: {
        'playfair': ['"Playfair Display"', 'serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [],
}
