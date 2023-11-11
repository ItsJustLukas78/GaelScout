/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
	],
  theme: {
    screens: {
      '2xs': '320px',
      'xs': '425px',
      ...defaultTheme.screens,
    },
    extend: {
      fontSize: {
        '2xs': ['.625rem', '.75rem'],
        '3xs': ['.5rem', '.75rem'],
      },
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
        "GSGreen": "#2be222",
        "GSGreenDark": "#1e9e1e",
      },

      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}