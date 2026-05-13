import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans:  ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      colors: {
        cream:       "#F7F5F0",
        "cream-dark":"#EAE6DE",
        "cream-card":"#F2EFE8",
        ink:         "#2C2C2C",
        "ink-soft":  "#787065",
        "ink-faint": "#A89E96",
        accent:      "#A38A6D",
        "accent-dark":"#8F765A",
        "accent-warm":"#C4A882",
      },
      backgroundImage: {
        "gradient-warm":  "linear-gradient(180deg, #F7F5F0 0%, #EAE6DE 100%)",
        "gradient-cream": "linear-gradient(135deg, #F2EFE8 0%, #EAE6DE 100%)",
      },
      boxShadow: {
        warm:    "0 4px 24px rgba(44,44,44,0.08)",
        "warm-lg":"0 8px 40px rgba(44,44,44,0.12)",
        accent:  "0 4px 20px rgba(163,138,109,0.25)",
      },
      animation: {
        "fade-in":     "fadeIn 0.6s ease-out forwards",
        "slide-up":    "slideUp 0.55s ease-out forwards",
        "drift":       "drift 25s ease-in-out infinite alternate",
        "grain":       "grain 8s steps(10) infinite",
        "warli-float": "warliFloat 8s ease-in-out infinite",
        "pulse-gold":  "pulseGold 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%":   { opacity: "0", transform: "translateY(22px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        drift: {
          "0%":   { transform: "translate(0,0) rotate(0deg)" },
          "50%":  { transform: "translate(6px,8px) rotate(1deg)" },
          "100%": { transform: "translate(-4px,4px) rotate(-0.5deg)" },
        },
        grain: {
          "0%,100%": { transform: "translate(0,0)" },
          "10%":  { transform: "translate(-4%,-4%)" },
          "20%":  { transform: "translate(-8%,4%)" },
          "30%":  { transform: "translate(4%,-8%)" },
          "40%":  { transform: "translate(-4%,12%)" },
          "50%":  { transform: "translate(-8%,4%)" },
          "60%":  { transform: "translate(12%,0%)" },
          "70%":  { transform: "translate(0%,8%)" },
          "80%":  { transform: "translate(-12%,0%)" },
          "90%":  { transform: "translate(8%,4%)" },
        },
        warliFloat: {
          "0%,100%": { transform: "translateY(0px) rotate(0deg)",  opacity: "0.045" },
          "50%":     { transform: "translateY(-8px) rotate(1.5deg)", opacity: "0.06" },
        },
        pulseGold: {
          "0%,100%": { boxShadow: "0 0 0 0 rgba(163,138,109,0.35)" },
          "50%":     { boxShadow: "0 0 0 8px rgba(163,138,109,0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
