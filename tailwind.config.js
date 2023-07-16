/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      spacing: {
        "112": "28rem",
        "128": "32rem",
        "144": "36rem",
      },
      colors: {
        "GSGray": "#141414",
        "googleBlue": "#4285F4",
        "discordBlue": "#5865F2",
      }
    }
  },
  plugins: [],
}

