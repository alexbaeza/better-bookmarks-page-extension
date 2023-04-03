const lightTheme = {
  'primary-dark': '#F0F5F9',
  'primary-dark-active': '#E1E8ED',
  'secondary-dark': '#9797e1',
  'secondary-dark-active': '#CFD6DC',
  'secondary-dark-muted': '#CDD3D8',
  accent: '#9797e1',
  'text-primary': '#3C4858',
  'text-primary-muted': '#95A5A6',
  'text-secondary': '#576574',
  'text-secondary-muted': '#8395A7'
};

const redTheme = {
  'primary-dark': '#FADBD8',
  'primary-dark-active': '#F1948A',
  'secondary-dark': '#E6B0AA',
  'secondary-dark-active': '#D98880',
  'secondary-dark-muted': '#d59898',
  accent: '#E57373',
  'text-primary': '#E57373',
  'text-primary-muted': '#F5B7B1',
  'text-secondary': '#F5B7B1',
  'text-secondary-muted': '#F7DC6F'
};

const orangeTheme = {
  'primary-dark': '#F8C471',
  'primary-dark-active': '#F0B27A',
  'secondary-dark': '#EB984E',
  'secondary-dark-active': '#DC7633',
  'secondary-dark-muted': '#ffcdbd',
  accent: '#FFAB91',
  'text-primary': '#F8FAFC',
  'text-primary-muted': '#D1D5DB',
  'text-secondary': '#F0E68C',
  'text-secondary-muted': '#F7DC6F'
};
const greenTheme = {
  'primary-dark': '#daffe9',
  'primary-dark-active': '#73C6B6',
  'secondary-dark': '#58D68D',
  'secondary-dark-active': '#45B39D',
  'secondary-dark-muted': '#d5fff7',
  accent: '#b8f3a9',
  'text-primary': '#78b469',
  'text-primary-muted': '#D1D5DB',
  'text-secondary': '#76D7C4',
  'text-secondary-muted': '#82E0AA'
};

const tealTheme = {
  'primary-dark': '#73C6B6',
  'primary-dark-active': '#5DADE2',
  'secondary-dark': '#85C1E9',
  'secondary-dark-active': '#1F618D',
  'secondary-dark-muted': '#d6eeff',
  accent: '#AED6F1',
  'text-primary': '#F8FAFC',
  'text-primary-muted': '#D1D5DB',
  'text-secondary': '#A9CCE3',
  'text-secondary-muted': '#AED6F1'
};
const blueTheme = {
  'primary-dark': '#AED6F1',
  'primary-dark-active': '#85C1E9',
  'secondary-dark': '#5DADE2',
  'secondary-dark-active': '#3498DB',
  'secondary-dark-muted': '#acddff',
  accent: '#6EC6FF',
  'text-primary': '#F8FAFC',
  'text-primary-muted': '#D1D5DB',
  'text-secondary': '#A9CCE3',
  'text-secondary-muted': '#AED6F1'
};

const indigoTheme = {
  'primary-dark': '#B0BEC5',
  'primary-dark-active': '#9FA8DA',
  'secondary-dark': '#7986CB',
  'secondary-dark-active': '#5C6BC0',
  'secondary-dark-muted': '#b2befc',
  accent: '#8C9EFF',
  'text-primary': '#F8FAFC',
  'text-primary-muted': '#D1D5DB',
  'text-secondary': '#C5CAE9',
  'text-secondary-muted': '#D1C4E9'
};

const purpleTheme = {
  'primary-dark': '#9c9cf3',
  'primary-dark-active': '#EDE7F6',
  'secondary-dark': '#9575CD',
  'secondary-dark-active': '#673AB7',
  'secondary-dark-muted': '#bb9af6',
  accent: '#9860ff',
  'text-primary': '#F8FAFC',
  'text-primary-muted': '#D1D5DB',
  'text-secondary': '#D1C4E9',
  'text-secondary-muted': '#E1BEE7'
};

const pinkTheme = {
  'primary-dark': '#FCE4EC',
  'primary-dark-active': '#F8BBD0',
  'secondary-dark': '#F06292',
  'secondary-dark-active': '#EC407A',
  'secondary-dark-muted': '#f8a6c2',
  accent: '#FF80AB',
  'text-primary': '#FF80AB',
  'text-primary-muted': '#D1D5DB',
  'text-secondary': '#F48FB1',
  'text-secondary-muted': '#F8BBD0'
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
            'primary-dark-active': '#222838',
            'secondary-dark': '#2e3649',
            'secondary-dark-active': '#283041',
            'secondary-dark-muted': '#2e3749',
            accent: '#5251f6',
            'text-primary': '#F8FAFC',
            'text-primary-muted': '#4B5563',
            'text-secondary': '#919bb7',
            'text-secondary-muted': '#4B5563'
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
