import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17201b",
        leaf: "#2d6a4f",
        mint: "#d8f3dc",
        cloud: "#f7faf8",
        line: "#dce6df",
      },
      boxShadow: {
        soft: "0 12px 30px rgba(23, 32, 27, 0.08)",
      },
      height: {
        13: "3.25rem",
      },
      minHeight: {
        13: "3.25rem",
      },
      animation: {
        "soft-fade-in": "soft-fade-in 520ms ease-out both",
        "soft-float": "soft-float 2.6s ease-in-out infinite",
        "duck-bob": "duck-bob 3.2s ease-in-out infinite",
        "mascot-float": "mascot-float 3s ease-in-out infinite",
        "mascot-breathe": "mascot-breathe 2.4s ease-in-out infinite",
        "mascot-breathe-svg": "mascot-breathe-svg 2.5s ease-in-out infinite",
        "soft-blink": "soft-blink 4.2s ease-in-out infinite",
        "soft-blink-svg": "soft-blink-svg 4.2s ease-in-out infinite",
        "wave-paw": "wave-paw 1.6s ease-in-out infinite",
        "wave-paw-svg": "wave-paw-svg 1.7s ease-in-out infinite",
        "ear-wiggle": "ear-wiggle 2.6s ease-in-out infinite",
        "ear-wiggle-delayed": "ear-wiggle-delayed 2.6s ease-in-out 280ms infinite",
        "ear-wiggle-svg": "ear-wiggle-svg 2.8s ease-in-out infinite",
        "ear-wiggle-svg-delayed": "ear-wiggle-svg-delayed 2.8s ease-in-out 260ms infinite",
        "foot-tap": "foot-tap 2.2s ease-in-out infinite",
        "foot-tap-delayed": "foot-tap 2.2s ease-in-out 320ms infinite",
        "foot-tap-svg": "foot-tap-svg 2.3s ease-in-out infinite",
        "foot-tap-svg-delayed": "foot-tap-svg 2.3s ease-in-out 320ms infinite",
        "bubble-in": "bubble-in 520ms ease-out 180ms both",
      },
    },
  },
  plugins: [],
};

export default config;
