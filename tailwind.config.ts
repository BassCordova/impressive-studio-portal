import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        negro: "#0A0A0A",
        "gris-oscuro": "#1A1A1A",
        "gris-medio": "#2E2E2E",
        "gris-claro": "#6B6B6B",
        "gris-suave": "#C4C4C4",
        blanco: "#F5F5F5",
        rojo: "#D42B2B",
        "rojo-hover": "#FF3333",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
    },
  },
  plugins: [],
};

export default config;
