/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');

const plugin = require('tailwindcss/plugin')

module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
	],
  theme: {
    extend: {
      textShadow: {
        xs: '1px 1px 0px var(--tw-shadow-color)',
        sm: '2px 2px 0px var(--tw-shadow-color)',
        DEFAULT: '2.5px 2.5px 0px var(--tw-shadow-color)',
        lg: '3.5px 3.5px 0px var(--tw-shadow-color)',
      },
      screens: {
        '2xs': '380px',
        'xs': '425px',
      },
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
        'gradient': {
          to: { 'background-position': '200% center' },
        },
        "blob": {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(10px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
        "spotlight": {
          '0%': {
            transform: 'translate(-100px, 0px) scale(1)',
          },
          '20%': {
            transform: 'translate(100px, -80px) scale(1.15)',
          },
          '40%': {
            transform: 'translate(-100px, -100px) scale(0.6)',
          },
          '60%': {
            transform: 'translate(100px, 10px) scale(1)',
          },
          '80%': {
            transform: 'translate(-20px, -80px) scale(0.7)',
          },
          '100%': {
            transform: 'translate(-100px, 0px) scale(1)',
          },
        }
      },
      animation: {
        'gradient': 'gradient 8s linear infinite',
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "blob": "blob 4s infinite",
        "spotlight": "spotlight 10s infinite",
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'text-shadow': (value) => ({
            textShadow: value,
          }),
        },
        { values: theme('textShadow') }
      )
    }),
  ],
}