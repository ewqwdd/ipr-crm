/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors');

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: [
    {
      pattern: /grid-cols-(\d+)/,
    },
  ],
  theme: {
    extend: {
      colors: {
        cyan: colors.cyan,
      },
      width: {
        sidebar: 'var(--sidebar-width)',
        'no-sidebar': 'calc(100dvw - var(--sidebar-width))',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
