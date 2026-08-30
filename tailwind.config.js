/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
          './pages/**/*.{js,ts,jsx,tsx}',
          './components/**/*.{js,ts,jsx,tsx}',
        ],
    theme: {
          extend: {
                  colors: {
                            slate: {
                                        950: '#0a0a0a',
                                        900: '#0f172a',
                                        800: '#1e293b',
                                        700: '#334155',
                                        500: '#64748b',
                                        400: '#94a3b8',
                                        300: '#cbd5e1',
                            },
                            amber: {
                                        600: '#d97706',
                                        500: '#f59e0b',
                                        400: '#fbbf24',
                                        300: '#fcd34d',
                            },
                  },
          },
    },
    plugins: [],
};
