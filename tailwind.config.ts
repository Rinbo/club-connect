import type { Config } from 'tailwindcss';

const defaultTheme = require('tailwindcss/defaultTheme');

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
    screens: {
      xs: '322px',
      ...defaultTheme.screens
    }
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        light: {
          ...require('daisyui/src/theming/themes')['[data-theme=light]'],
          primary: '#4BC375',
          'primary-content': '#233e31'
        },
        dark: {
          ...require('daisyui/src/theming/themes')['[data-theme=dark]'],
          primary: '#4BC375',
          'primary-content': '#233e31'
        }
      },
      'emerald'
    ]
  }
} satisfies Config;
