/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      spacing: {
        "112": "28rem",
        "120": "30rem",
        "128": "32rem",
        "136": "34rem",
        "144": "36rem",
        "152": "38rem",
        "160": "40rem",
        "168": "42rem",
      },
      colors: {
        "GSGray": "#141414",
        "googleBlue": "#4285F4",
        "discordBlue": "#5865F2",
      }
    },
    screens: {
      '2xs': '320px',
      'xs': '425px',
      ...defaultTheme.screens,
    },
  },
  plugins: [],
}

