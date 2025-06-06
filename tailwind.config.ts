import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["var(--font-montserrat)", "Berthold Block", "sans-serif"],
        hortensia: ["Hortensia", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
