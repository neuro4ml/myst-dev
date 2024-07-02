const colors = require('tailwindcss/colors');

module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    'node_modules/myst-to-react/dist/**/*.{js,ts,jsx,tsx}',
    'node_modules/@myst-theme/frontmatter/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.blue,
        success: colors.green[500]
      },
      // See https://github.com/tailwindlabs/tailwindcss-typography/blob/master/src/styles.js
      keyframes: {
        load: {
          '0%': { width: '0%' },
          '100%': { width: '50%' }
        },
        fadeIn: {
          '0%': { opacity: 0.0 },
          '25%': { opacity: 0.25 },
          '50%': { opacity: 0.5 },
          '75%': { opacity: 0.75 },
          '100%': { opacity: 1 }
        }
      },
      animation: {
        load: 'load 2.5s ease-out',
        'fadein-fast': 'fadeIn 1s ease-out'
      }
    }
  },
  corePlugins: {
    preflight: false
  },
  plugins: [require('@tailwindcss/typography')]
};



