const { themes } = require('./src/styles/themes');

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,css}'],
  darkMode: 'class',
  plugins: [
    require('tailwindcss-themer')({
      // pick any theme as default (here “dark”)
      defaultTheme: {
        extend: { colors: themes.default },
      },
      themes: Object.entries(themes).map(([name, colors]) => ({
        extend: { colors },
        name,
      })),
    }),
  ],
};
