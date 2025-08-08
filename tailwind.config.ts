import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        gameboy: {
          bg: '#c7d7a4',
          text: '#204b24',
          accent: '#2f6b3a',
          dark: '#15301a',
        },
      },
      boxShadow: {
        lcd: 'inset 0 6px 12px rgba(0,0,0,0.25)',
      },
      borderRadius: {
        pixel: '0',
      },
    },
  },
  plugins: [],
} satisfies Config