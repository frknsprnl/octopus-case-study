import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["var(--font-poppins)", "sans-serif"]
      },
      animation: {
        "fade-up":        "fade-up 0.45s cubic-bezier(0.22,1,0.36,1) both",
        "fade-in":        "fade-in 0.35s ease both",
        "slide-in-left":  "slide-in-left 0.55s cubic-bezier(0.22,1,0.36,1) both",
        "slide-in-right": "slide-in-right 0.55s cubic-bezier(0.22,1,0.36,1) both",
        "scale-in":       "scale-in 0.22s cubic-bezier(0.34,1.56,0.64,1) both",
        "badge-pop":      "badge-pop 0.38s cubic-bezier(0.34,1.56,0.64,1) both",
        shimmer:          "shimmer 1.6s linear infinite",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to:   { opacity: "1", transform: "translateY(0)" }
        },
        "fade-in": {
          from: { opacity: "0" },
          to:   { opacity: "1" }
        },
        "slide-in-left": {
          from: { opacity: "0", transform: "translateX(-36px)" },
          to:   { opacity: "1", transform: "translateX(0)" }
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(36px)" },
          to:   { opacity: "1", transform: "translateX(0)" }
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.93) translateY(-6px)" },
          to:   { opacity: "1", transform: "scale(1) translateY(0)" }
        },
        "badge-pop": {
          "0%":   { transform: "scale(0.3)", opacity: "0" },
          "60%":  { transform: "scale(1.35)" },
          "100%": { transform: "scale(1)",   opacity: "1" }
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        }
      }
    }
  },
  plugins: []
};

export default config;
