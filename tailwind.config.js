export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        accent: "#e8cfcf",
        blush: "#f5e9eb",
        gold: "var(--color-gold)",
      },
      fontFamily: {
        sans: ["Montserrat", "sans-serif"],
      },
      boxShadow: {
        soft: "0 20px 60px rgba(17, 17, 17, 0.10)",
      }
    },
  },
  plugins: [],
}
