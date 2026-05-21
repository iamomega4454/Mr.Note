/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Blackboard-style color system
        blackboard: {
          primary: "#0D0D0D",
          secondary: "#161616",
          sidebar: "#121212",
          card: "#1A1A1A",
          border: "#2A2A2A",
        },
        chalk: {
          yellow: "#FFD84D",
          green: "#7CFC00",
          blue: "#4FC3F7",
          purple: "#C77DFF",
          pink: "#FF6EC7",
          orange: "#FFA94D",
        },
        text: {
          primary: "#F5F5F5",
          secondary: "#B0B0B0",
        },
      },
      fontFamily: {
        heading: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"],
        chalk: ["Caveat", "cursive"],
      },
      boxShadow: {
        glow: "0 0 20px rgba(255, 216, 77, 0.15)",
        "glow-green": "0 0 20px rgba(124, 252, 0, 0.15)",
        "glow-blue": "0 0 20px rgba(79, 195, 247, 0.15)",
        "glow-purple": "0 0 20px rgba(199, 125, 255, 0.15)",
        "glow-pink": "0 0 20px rgba(255, 110, 199, 0.15)",
        soft: "0 8px 32px rgba(0, 0, 0, 0.4)",
        "soft-lg": "0 12px 48px rgba(0, 0, 0, 0.5)",
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        shimmer: "shimmer 2s infinite linear",
        glow: "glow 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(255, 216, 77, 0.15)" },
          "50%": { boxShadow: "0 0 30px rgba(255, 216, 77, 0.25)" },
        },
      },
    },
  },
  plugins: [],
};