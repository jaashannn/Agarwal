/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#046A38',
          light: '#0A8C4C',
          dark: '#034C28',
        },
        gold: {
          DEFAULT: '#D4AF37',
          light: '#E5C766',
          dark: '#B39020',
        },
        cream: {
          DEFAULT: '#F9F4EF',
          light: '#FFFCF9',
          dark: '#EAE0D4',
        },
        saffron: {
          DEFAULT: '#FF9933',
          light: '#FFB366',
          dark: '#E57300',
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
        error: {
          DEFAULT: '#EF4444',
          light: '#F87171',
          dark: '#DC2626',
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
        }
      },
      borderWidth: {
        '3': '3px',
      }
    },
  },
  plugins: [],
}