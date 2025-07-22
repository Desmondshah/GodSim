const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  mode: "jit",
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["JetBrains Mono", "Courier New", "monospace", ...fontFamily.mono],
        display: ["Impact", "Arial Black", "sans-serif"],
        brutal: ["Helvetica", "Arial", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0px",
        none: "0px",
        brutal: "2px",
      },
      boxShadow: {
        DEFAULT: "4px 4px 0px #000000",
        brutal: "6px 6px 0px #000000",
        "brutal-lg": "8px 8px 0px #000000",
        "brutal-xl": "12px 12px 0px #000000",
        inset: "inset 4px 4px 0px #000000",
        none: "none",
      },
      colors: {
        // Brutalist color palette - stark, raw, industrial
        primary: {
          DEFAULT: "#FF0000", // Aggressive red
          dark: "#CC0000",
          light: "#FF3333",
        },
        secondary: {
          DEFAULT: "#000000", // Pure black
          light: "#333333",
        },
        accent: {
          DEFAULT: "#FFFF00", // Electric yellow
          orange: "#FF6600",
          cyan: "#00FFFF",
          lime: "#00FF00",
        },
        neutral: {
          DEFAULT: "#FFFFFF", // Pure white
          gray: "#808080",
          dark: "#1A1A1A",
        },
        danger: "#FF0000",
        warning: "#FF6600",
        success: "#00FF00",
        info: "#00FFFF",
      },
      spacing: {
        "form-field": "24px",
        section: "48px",
        "brutal-gap": "16px",
      },
      fontSize: {
        "brutal-xs": ["10px", { lineHeight: "1.2", letterSpacing: "0.05em" }],
        "brutal-sm": ["12px", { lineHeight: "1.3", letterSpacing: "0.05em" }],
        "brutal-base": ["16px", { lineHeight: "1.4", letterSpacing: "0.02em" }],
        "brutal-lg": ["20px", { lineHeight: "1.4", letterSpacing: "0.02em" }],
        "brutal-xl": ["24px", { lineHeight: "1.3", letterSpacing: "0.01em" }],
        "brutal-2xl": ["32px", { lineHeight: "1.2", letterSpacing: "0.01em" }],
        "brutal-3xl": ["48px", { lineHeight: "1.1", letterSpacing: "-0.01em" }],
        "brutal-4xl": ["64px", { lineHeight: "1.0", letterSpacing: "-0.02em" }],
      },
      animation: {
        "glitch": "glitch 0.3s infinite",
        "flicker": "flicker 2s infinite",
        "shake": "shake 0.5s infinite",
      },
      keyframes: {
        glitch: {
          "0%, 100%": { transform: "translate(0)" },
          "10%": { transform: "translate(-2px, 2px)" },
          "20%": { transform: "translate(-2px, -2px)" },
          "30%": { transform: "translate(2px, 2px)" },
          "40%": { transform: "translate(2px, -2px)" },
          "50%": { transform: "translate(-2px, 2px)" },
          "60%": { transform: "translate(-2px, -2px)" },
          "70%": { transform: "translate(2px, 2px)" },
          "80%": { transform: "translate(-2px, -2px)" },
          "90%": { transform: "translate(2px, 2px)" },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-2px)" },
          "75%": { transform: "translateX(2px)" },
        },
      },
    },
  },
  variants: {
    extend: {
      boxShadow: ["hover", "active", "focus"],
      transform: ["hover", "active"],
    },
  },
};
