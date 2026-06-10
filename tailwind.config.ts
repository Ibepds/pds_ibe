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
        // Fond sombre teinté bleu nuit (identité PDS Humanity)
        surface: {
          DEFAULT: '#040814',
          elevated: '#081226',
          card: '#0C1B38',
        },
        // Bleu PDS Humanity : R5 G70 B160 = #0546A0
        primary: {
          DEFAULT: '#0546A0',
          light: '#5B9BE8',
          dark: '#033576',
        },
        accent: {
          rose: '#F472B6',
          cyan: '#6AB3FF',
          green: '#4ADE80',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        // Titres impactants condensés
        display: ['"Cossette Titre"', 'Inter', 'sans-serif'],
        // Accents serif élégants
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
        glow: '0 0 40px rgba(5, 70, 160, 0.45)',
        'glow-cyan': '0 0 30px rgba(91, 155, 232, 0.30)',
        'glow-rose': '0 0 30px rgba(244, 114, 182, 0.25)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'count-up': 'countUp 1.2s ease-out forwards',
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
        countUp: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
