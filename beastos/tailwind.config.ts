import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#050505",
          900: "#090909",
          800: "#111111",
          700: "#171717",
        },
        fg: {
          DEFAULT: "#ffffff",
          soft: "#e5e5e5",
          mute: "#9ca3af",
        },
        primary: "#0066ff",
        secondary: "#00d4ff",
        accent: "#7c3aed",
        success: "#10b981",
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      maxWidth: {
        shell: "1400px",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.45" },
          "50%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        /* Slow, gentle drift for the artwork band — compositor-only transform so
           it stays smooth and cheap. Resting state (0%) is the unzoomed frame. */
        kenburns: {
          "0%": { transform: "scale(1.03) translate3d(0, 0, 0)" },
          "100%": { transform: "scale(1.13) translate3d(-2.5%, -1.8%, 0)" },
        },
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        pulseSoft: "pulseSoft 3.2s ease-in-out infinite",
        shimmer: "shimmer 2.4s linear infinite",
        kenburns: "kenburns 22s ease-in-out infinite alternate",
      },
    },
  },
  plugins: [],
};

export default config;
