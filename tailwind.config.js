/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'custom-primary-dark': '#212839',
        'custom-primary-dark-active': '#222838',
        'custom-secondary-dark': '#2e3649',
        'custom-secondary-dark-active': '#283041',
        'custom-primary': '#5251f6',
        'custom-text-primary': '#F8FAFC',
        'custom-text-primary-muted': '#4B5563',
        'custom-text-secondary': '#919bb7',
        'custom-text-secondary-muted': '#4B5563'
      }
    }
  },
  plugins: [require('@tailwindcss/line-clamp')],
  colors: {}
};
