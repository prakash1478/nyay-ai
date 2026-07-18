/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      spacing: {
        4.5: '1.125rem',
        5.5: '1.375rem',
        6.5: '1.625rem',
      },
      colors: {
        ink: {
          50: '#F4F6F8',
          100: '#E3E8EE',
          200: '#B9C4D3',
          300: '#8194AB',
          400: '#516278',
          500: '#324258',
          600: '#233247',
          700: '#1A2739',
          800: '#16243A',
          900: '#0F1B2D',
          950: '#0B1220',
        },
        parchment: {
          50: '#FFFEFB',
          100: '#FBF9F3',
          200: '#F7F4EC',
          300: '#EFE8D8',
          400: '#E3D9C0',
        },
        brass: {
          300: '#E2C594',
          400: '#D0AD7B',
          500: '#B8935F',
          600: '#9C7A48',
          700: '#7C5F37',
        },
        emerald: {
          400: '#3E8E73',
          500: '#2A7A61',
          600: '#1F5C4A',
          700: '#164436',
        },
        crimson: {
          400: '#D9605F',
          500: '#C13B3B',
          600: '#9B2C2C',
          700: '#7A2222',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        soft: '0 4px 24px -4px rgba(15, 27, 45, 0.10)',
        card: '0 2px 12px -2px rgba(15, 27, 45, 0.08), 0 1px 3px rgba(15,27,45,0.06)',
        'card-dark': '0 4px 24px -4px rgba(0,0,0,0.35)',
        gold: '0 8px 30px -8px rgba(184, 147, 95, 0.45)',
      },
      backgroundImage: {
        'brief-lines': 'repeating-linear-gradient(to bottom, transparent, transparent 27px, rgba(15,27,45,0.05) 28px)',
        'gold-fade': 'linear-gradient(135deg, #D0AD7B 0%, #B8935F 60%, #9C7A48 100%)',
        'ink-fade': 'linear-gradient(135deg, #16243A 0%, #0F1B2D 60%, #0B1220 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'stamp-in': 'stampIn 0.4s cubic-bezier(.2,1.4,.4,1) forwards',
        blink: 'blink 1s step-end infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(16px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        stampIn: {
          '0%': { opacity: 0, transform: 'scale(1.4) rotate(-8deg)' },
          '100%': { opacity: 1, transform: 'scale(1) rotate(-8deg)' },
        },
        blink: { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0 } },
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
}
