const { themes } = require('./src/styles/themes');

module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx,css}'],
  plugins: [
    require('tailwindcss-themer')({
      // pick any theme as default (here “dark”)
      defaultTheme: {
        extend: { colors: themes.default },
      },
      themes: Object.entries(themes).map(([name, colors]) => ({
        name,
        extend: { colors },
      })),
    }),
  ],
};
