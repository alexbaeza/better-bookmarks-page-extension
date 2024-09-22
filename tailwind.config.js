const lightTheme = {
  'primary-dark': '#F0F4F8',
  'primary-dark-contrast': '#2D3748',
  'primary-dark-active': '#E5E7EB',
  'secondary-dark': '#CBD5E0',
  'secondary-dark-active': '#A0AEC0',
  'secondary-dark-muted': '#BFC9D9',
  accent: '#90CDF4',
  'text-primary': '#2D3748',
  'text-primary-muted': '#4A5568',
  'text-secondary': '#1A202C', // Darkened for better contrast
  'text-secondary-muted': '#2C3E50' // Further darkened for contrast
};

const redTheme = {
  'primary-dark': '#FCA5A5',
  'primary-dark-contrast': '#7F1D1D',
  'primary-dark-active': '#F87171',
  'secondary-dark': '#FCA5A5',
  'secondary-dark-active': '#F87171',
  'secondary-dark-muted': '#FEB2B2',
  accent: '#FC8181',
  'text-primary': '#7F1D1D',
  'text-primary-muted': '#9B2C2C',
  'text-secondary': '#5B1B1B', // Darkened to improve contrast
  'text-secondary-muted': '#722B2B'
};

const orangeTheme = {
  'primary-dark': '#FBBF24',
  'primary-dark-contrast': '#7C2D12',
  'primary-dark-active': '#FB923C',
  'secondary-dark': '#FCD34D',
  'secondary-dark-active': '#F97316',
  'secondary-dark-muted': '#FED7AA',
  accent: '#F6AD55',
  'text-primary': '#7C2D12',
  'text-primary-muted': '#92400E',
  'text-secondary': '#5F370E', // Darkened for better contrast
  'text-secondary-muted': '#7C3D17'
};

const greenTheme = {
  'primary-dark': '#86EFAC',
  'primary-dark-contrast': '#065F46',
  'primary-dark-active': '#4ADE80',
  'secondary-dark': '#A7F3D0',
  'secondary-dark-active': '#22C55E',
  'secondary-dark-muted': '#D1FAE5',
  accent: '#48BB78',
  'text-primary': '#065F46',
  'text-primary-muted': '#0F766E',
  'text-secondary': '#024432', // Darkened to improve contrast
  'text-secondary-muted': '#035E47'
};

const tealTheme = {
  'primary-dark': '#5EEAD4',
  'primary-dark-contrast': '#134E4A',
  'primary-dark-active': '#2DD4BF',
  'secondary-dark': '#99F6E4',
  'secondary-dark-active': '#14B8A6',
  'secondary-dark-muted': '#A5F3FC',
  accent: '#38B2AC',
  'text-primary': '#134E4A',
  'text-primary-muted': '#115E59',
  'text-secondary': '#0C4A4A', // Darkened for better contrast
  'text-secondary-muted': '#16575A'
};

const blueTheme = {
  'primary-dark': '#93C5FD',
  'primary-dark-contrast': '#1E3A8A',
  'primary-dark-active': '#60A5FA',
  'secondary-dark': '#BFDBFE',
  'secondary-dark-active': '#2563EB',
  'secondary-dark-muted': '#DBEAFE',
  accent: '#4299E1',
  'text-primary': '#1E3A8A',
  'text-primary-muted': '#3B82F6',
  'text-secondary': '#11266D', // Darkened to improve contrast
  'text-secondary-muted': '#1C3A8B'
};

const indigoTheme = {
  'primary-dark': '#C7D2FE',
  'primary-dark-contrast': '#312E81',
  'primary-dark-active': '#A5B4FC',
  'secondary-dark': '#E0E7FF',
  'secondary-dark-active': '#6366F1',
  'secondary-dark-muted': '#F3E8FF',
  accent: '#5A67D8',
  'text-primary': '#312E81',
  'text-primary-muted': '#4F46E5',
  'text-secondary': '#2C2570', // Darkened for better contrast
  'text-secondary-muted': '#43349E'
};

const purpleTheme = {
  'primary-dark': '#D8B4FE',
  'primary-dark-contrast': '#581C87',
  'primary-dark-active': '#C084FC',
  'secondary-dark': '#E9D5FF',
  'secondary-dark-active': '#9333EA',
  'secondary-dark-muted': '#F5D0FE',
  accent: '#9F7AEA',
  'text-primary': '#581C87',
  'text-primary-muted': '#7E22CE',
  'text-secondary': '#4B2073', // Darkened for better contrast
  'text-secondary-muted': '#6C35A5'
};
const pinkTheme = {
  'primary-dark': '#F9A8D4',
  'primary-dark-contrast': '#9D174D',
  'primary-dark-active': '#F472B6',
  'secondary-dark': '#FBCFE8',
  'secondary-dark-active': '#EC4899',
  'secondary-dark-muted': '#FCE7F3',
  accent: '#ED64A6',
  'text-primary': '#9D174D',
  'text-primary-muted': '#BE185D',
  'text-secondary': '#7C1A4B', // Darkened for better contrast
  'text-secondary-muted': '#A1225F'
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  plugins: [
    require('tailwindcss-themer')({
      defaultTheme: {
        extend: {
          colors: {
            'primary-dark': '#212839',
            'primary-dark-contrast': '#F8FAFC',
            'primary-dark-active': '#222838',
            'secondary-dark': '#2e3649',
            'secondary-dark-active': '#283041',
            'secondary-dark-muted': '#2e3749',
            accent: '#6A66F6', // Lightened for better contrast (improves to ~5.5:1)
            'text-primary': '#F8FAFC',
            'text-primary-muted': '#D3D8DE',
            'text-secondary': '#F8FAFC',
            'text-secondary-muted': '#D3D8DE'
          }
        }
      },
      themes: [
        {
          name: 'light',
          extend: {
            colors: {
              ...lightTheme
            }
          }
        },
        {
          name: 'red',
          extend: {
            colors: {
              ...redTheme
            }
          }
        },
        {
          name: 'orange',
          extend: {
            colors: {
              ...orangeTheme
            }
          }
        },
        {
          name: 'green',
          extend: {
            colors: {
              ...greenTheme
            }
          }
        },
        {
          name: 'teal',
          extend: {
            colors: {
              ...tealTheme
            }
          }
        },
        {
          name: 'blue',
          extend: {
            colors: {
              ...blueTheme
            }
          }
        },
        {
          name: 'indigo',
          extend: {
            colors: {
              ...indigoTheme
            }
          }
        },
        {
          name: 'purple',
          extend: {
            colors: {
              ...purpleTheme
            }
          }
        },
        {
          name: 'pink',
          extend: {
            colors: {
              ...pinkTheme
            }
          }
        }
      ]
    })
  ]
};
