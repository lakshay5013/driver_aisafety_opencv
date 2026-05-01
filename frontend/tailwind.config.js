/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        night: {
          50: '#f3f7ff',
          100: '#d9e2ff',
          200: '#b1c4ff',
          300: '#7da0ff',
          400: '#4f73f2',
          500: '#2c4bd4',
          600: '#203aa8',
          700: '#172c82',
          800: '#101f5b',
          900: '#070b14',
          950: '#04070d'
        }
      },
      boxShadow: {
        glow: '0 0 40px rgba(79, 115, 242, 0.25)'
      },
      backgroundImage: {
        'dashboard-grid':
          'radial-gradient(circle at top left, rgba(79, 115, 242, 0.28), transparent 30%), radial-gradient(circle at bottom right, rgba(255, 255, 255, 0.06), transparent 24%)'
      },
      animation: {
        drift: 'drift 12s ease-in-out infinite',
        pulseSoft: 'pulseSoft 3s ease-in-out infinite'
      },
      keyframes: {
        drift: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(0, -12px, 0)' }
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.8' },
          '50%': { opacity: '1' }
        }
      }
    }
  },
  plugins: []
};
