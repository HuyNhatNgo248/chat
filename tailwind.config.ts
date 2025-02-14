import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: "media",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Oxygen",
          "Ubuntu",
          "Cantarell",
          "Fira Sans",
          "Droid Sans",
          "Helvetica Neue",
          "sans-serif",
        ],
      },
      colors: {
        "deep-sea": "#054c44",
        teal: "#0e6b5e",
        "light-green": "#25d366",
        "dark-green": "#1eaa57",
        blue: "#2a92c1",
        "pale-green": "#b0c6a0",
        "chat-background": "#0b141a",
        "message-outgoing": "#005c4b",
        "message-incoming": "#202c33",
        text: "#e4e6eb",
        "text-muted": "#c8c9cc",
        error: "#ff4d4f",
        destructive: "#b30000",
        background: "#1E1E1E",
        gray: {
          "50": "#6d6e6e",
          "100": "#3A3C3C",
          "200": "#242626",
          "300": "#1E1E1E",
        },
      },
      fontSize: {
        xs: "0.75rem", // 12px
        sm: "0.875rem", // 14px
        base: "1rem", // 16px
        lg: "1.125rem", // 18px
        xl: "1.25rem", // 20px
        "2xl": "1.5rem", // 24px
        "3xl": "1.875rem", // 30px
        "4xl": "2.25rem", // 36px
        "5xl": "3rem", // 48px
        "6xl": "3.75rem", // 60px
        "7xl": "4.5rem", // 72px
      },
      fontWeight: {
        hairline: "100",
        thin: "200",
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
        black: "900",
      },
      borderRadius: {
        sm: "0.25rem", // 4px
        md: "0.5rem", // 8px
        lg: "1rem", // 16px
        full: "9999px",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
