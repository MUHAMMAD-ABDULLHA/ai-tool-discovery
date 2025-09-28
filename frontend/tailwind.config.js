// tailwind.config.js

/** @type {import('tailwindcss').Config} */
// 

export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#F4511E",   // main brand color (buttons, highlights)
          dark: "#D84315",      // darker shade for hover states
          light: "#FF7043",     // lighter shade
        },
        neutral: {
          dark: "#1E1E1E",      // heading text
          DEFAULT: "#6B6B6B",   // body text
          light: "#F5F5F5",     // background sections
        },
        background: {
          DEFAULT: "#FFFFFF",   // page background
        }
      },
      fontFamily: {
        sans: ["Inter", "Helvetica", "Arial", "sans-serif"], // matches clean modern UI
      },
    },
  },
  plugins: [],
}
