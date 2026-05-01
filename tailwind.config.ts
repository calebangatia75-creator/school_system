import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#1e3a5f",
        "navy-light": "#2a4a73",
        purple: "#8b5cf6",
        "purple-light": "#a78bfa",
        light: "#f8fafc",
        bg: "#f8fafc",
        surface: "#ffffff",
        textBody: "#64748b",
        textDark: "#0f172a",
        success: "#16a34a",
        warning: "#f97316",
        glass: "rgba(255,255,255,0.08)",
        "glass-border": "rgba(255,255,255,0.12)",
        background: "#f8fafc",
        foreground: "#0f172a",
        "card-foreground": "#ffffff",
        "popover-foreground": "#ffffff",
        primary: "#1e3a8a",
        "primary-foreground": "#ffffff",
        secondary: "#f1f5f9",
        "secondary-foreground": "#1e293b",
        muted: "#f8fafc",
        "muted-foreground": "#64748b",
        accent: "#ffffff",
        "accent-foreground": "#1e293b",
        destructive: "#ef4444",
        "destructive-foreground": "#ffffff",
        border: "#e2e8f0",
        input: "#f1f5f9",
        ring: "#3b82f6"
      },
      animation: {
        "count-up": "countUp 2s ease-out",
        parallax: "parallax 20s infinite linear"
      },
      keyframes: {
        countUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        parallax: {
          "0%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
          "100%": { transform: "translateY(0px)" }
        }
      },
      backdropBlur: {
        xs: "2px"
      }
    }
  },
  plugins: [],
  darkMode: "class"
};

export default config;
