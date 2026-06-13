import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#F5F3EE',
          alt: '#EDEAE2',
        },
        ink: {
          DEFAULT: '#0E0E10',
          soft: '#1A1A1E',
        },
        surface: {
          DEFAULT: '#0546A0',
          elevated: '#0a3d8a',
          card: '#033576',
        },
        // Bleu PDS Humanity
        primary: {
          DEFAULT: '#0546A0',
          light: '#5B9BE8',
          dark: '#033576',
        },
        accent: {
          red: '#E1352B',
          rose: '#F472B6',
          cyan: '#5B9BE8',
          green: '#7BC67E',
          yellow: '#F5C542',
          purple: '#B794F6',
        },
        chalk: {
          white: '#F8F8F6',
          blue: '#5B9BE8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Cossette Titre"', 'Inter', 'sans-serif'],
        serif: ['"IM Fell DW Pica"', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'pds-texture': "url('/images/fond-pds.jpg')",
        'pds-street': "url('/images/fond-street.jpg')",
        'pds-dark': "url('/images/fond-dark.jpg')",
        'pds-white': "url('/images/fond-white.jpg')",
        'pds-cyan': "url('/images/fond-cyan.jpg')",
        'pds-logo': "url('/images/fond-logo.jpg')",
      },
      boxShadow: {
        glow: '0 0 40px rgba(91, 155, 232, 0.35)',
        chalk: '2px 2px 0 rgba(255,255,255,0.15)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
