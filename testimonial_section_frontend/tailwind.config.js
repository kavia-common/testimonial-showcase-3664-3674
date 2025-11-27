/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        secondary: "#F59E0B",
        success: "#F59E0B",
        error: "#EF4444",
        surface: "#ffffff",
        text: "#111827",
        background: "#f9fafb"
      },
      boxShadow: {
        "soft": "0 10px 15px -3px rgba(0,0,0,0.07), 0 4px 6px -4px rgba(0,0,0,0.06)"
      }
    },
  },
  plugins: [],
};
