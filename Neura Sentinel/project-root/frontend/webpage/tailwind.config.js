/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'dark-blue': '#051937',
        'navy-blue': '#062c54',
        'blue': '#0582CA',
        'light-blue': '#00A6FB',
        'accent-blue': '#0CECDD',
        'accent-purple': '#7B61FF',
        'alert-red': '#FF445A',
        'alert-orange': '#FF8A47',
        'alert-yellow': '#FFE345',
        'success-green': '#2DCA8C',
        'text-primary': '#FFFFFF',
        'text-secondary': '#A9B8D5',
        'surface-dark': '#091E3B',
        'surface-light': '#0C2E59',
      },
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px 0px rgba(0, 166, 251, 0.3)' },
          '50%': { boxShadow: '0 0 20px 5px rgba(0, 166, 251, 0.6)' },
        },
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        scanLine: {
          '0%': { transform: 'translateY(0%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
      animation: {
        pulse: 'pulse 3s infinite ease-in-out',
        glow: 'glow 2s infinite ease-in-out',
        fadeIn: 'fadeIn 0.5s ease-out forwards',
        scanLine: 'scanLine 2s linear infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'grid-pattern': 'linear-gradient(to right, #0582CA 1px, transparent 1px), linear-gradient(to bottom, #0582CA 1px, transparent 1px)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};