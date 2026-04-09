/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "surface": "#0c0e10",
        "surface-container": "#161a1e",
        "surface-container-low": "#111416",
        "surface-container-high": "#1b2025",
        "surface-container-highest": "#20262c",
        "surface-container-lowest": "#000000",
        "surface-bright": "#252d33",
        "on-surface": "#e0e6ed",
        "on-surface-variant": "#a6acb2",
        "secondary": "#9f9d9d",
        "on-secondary": "#202020",
        "secondary-container": "#3c3b3b",
        "on-secondary-container": "#c1bfbe",
        "outline-variant": "#42494e",
        "primary": "#c1c7ce",
        "on-primary": "#3b4147",
        "primary-container": "#41474d",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}