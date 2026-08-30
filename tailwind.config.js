/** @type {import('tailwindcss').Config} */
module.exports = {
      content: [
              './pages/**/*.{js,ts,jsx,tsx}',
              './components/**/*.{js,ts,jsx,tsx}',
            ],
      theme: {
              extend: {
                        colors: {
                                    ink: {
                                                  950: '#120F0D',
                                                  900: '#1B1613',
                                                  800: '#292019',
                                                  700: '#3B2E23',
                                                  500: '#6B5B4C',
                                                  400: '#93816E',
                                    },
                                    bone: {
                                                  50: '#FBF8F2',
                                                  100: '#F4EDE0',
                                                  200: '#E9DCC4',
                                    },
                                    brass: {
                                                  700: '#7C5E2E',
                                                  600: '#9C7A3C',
                                                  500: '#B08D57',
                                                  400: '#C7A874',
                                                  300: '#DDC9A3',
                                    },
                                    oxblood: {
                                                  700: '#5C1A1E',
                                                  600: '#732128',
                                                  500: '#8A2C30',
                                    },
                        },
                        fontFamily: {
                                    serif: ['var(--font-display)'],
                                    sans: ['var(--font-body)'],
                        },
                        maxWidth: {
                                    '8xl': '90rem',
                        },
              },
      },
      plugins: [],
};
