/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: "#1a1a1f",
        surface: "#222228",
        accent: "#7eb8ff",
      },
      fontFamily: {
        heading: ["Sora", "sans-serif"],
        body: ["DM Sans", "sans-serif"],
      },
      boxShadow: {
        glow: "0 8px 32px rgba(100, 160, 255, 0.22)",
      },
    },
  },
  plugins: [],
};

