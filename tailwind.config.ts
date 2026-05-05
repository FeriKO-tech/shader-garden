import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#07070b',
          soft: '#0d0e15',
          panel: '#11131c',
        },
        ink: {
          DEFAULT: '#e7e8ee',
          dim: '#9aa0b4',
          faint: '#5b6076',
        },
        accent: {
          DEFAULT: '#9d7bff',
          glow: '#c4b1ff',
        },
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 24px rgba(157, 123, 255, 0.35)',
      },
    },
  },
  plugins: [],
};

export default config;
