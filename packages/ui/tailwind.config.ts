import preset from "@datbuilds/tailwind-config/preset";
import type { Config } from "tailwindcss";

const config = {
  presets: [preset],
  content: ["./src/**/*.{ts,tsx}"],
} satisfies Config;

export default config;
