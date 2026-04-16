/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Manrope", "Segoe UI", "sans-serif"],
        display: ["Sora", "Manrope", "sans-serif"]
      },
      colors: {
        surface: "rgb(var(--surface) / <alpha-value>)",
        shell: "rgb(var(--shell) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        text: "rgb(var(--text) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        "accent-strong": "rgb(var(--accent-strong) / <alpha-value>)",
        "accent-soft": "rgb(var(--accent-soft) / <alpha-value>)"
      },
      boxShadow: {
        glass: "0 24px 60px rgba(15, 23, 42, 0.18)",
        glow: "0 0 0 1px rgba(255,255,255,0.08), 0 22px 50px rgba(14, 116, 144, 0.18)"
      },
      backgroundImage: {
        "mesh-light":
          "radial-gradient(circle at top left, rgba(236, 253, 245, 0.95), transparent 32%), radial-gradient(circle at top right, rgba(224, 231, 255, 0.72), transparent 28%), radial-gradient(circle at bottom left, rgba(255, 237, 213, 0.75), transparent 24%)",
        "mesh-dark":
          "radial-gradient(circle at top left, rgba(20, 184, 166, 0.18), transparent 30%), radial-gradient(circle at top right, rgba(59, 130, 246, 0.18), transparent 28%), radial-gradient(circle at bottom, rgba(244, 114, 182, 0.12), transparent 24%)"
      }
    }
  },
  plugins: []
};
