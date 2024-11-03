/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,jsx,ts,vue,tsx}"],
  theme: {
    extend: {
      colors: {
        text: 'var(--text)',
        textLight: 'var(--textLight)',
        textLighter: 'var(--textLighter)',
        textDark: 'var(--textDark)',
        textDarker: 'var(--textDarker)',
        cardLight: 'var(--cardLight)',
        cardDark: 'var(--cardDark)',
        background: 'var(--background)',
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        tertiary: 'var(--tertiary)',
        menubg: 'var(--menubg)',
        backgroundHover: 'var(--backgroundHover)',
        webPrimary: 'var(--webPrimary)',
        webSecondary: 'var(--webSecondary)',
        webBackground: 'var(--webBackground)',
        webBackgroundDark: 'var(--webBackgroundDark)',
        webPrimaryHover: 'var(--webPrimaryHover)',
        webSecondaryHover: 'var(--webSecondaryHover)',
        webBackgroundHover: 'var(--webBackgroundHover)',
        webBackgroundDarkHover: 'var(--webBackgroundDarkHover)'
      }
    },
  },
  plugins: [],
};

module.exports = config;