// tailwind.config.ts

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pretendard: ["var(--font-pretendard)"],
        manrope: ["var(--font-manrope)"],
      },
      letterSpacing: {
        tightest: "-0.025em", // -2.5%
        tighter: "-0.02em",   // -2%
        tight: "-0.015em",    // -1.5%
      },
      lineHeight: {
        "120": "1.2",
        "140": "1.4",
        "150": "1.5",
      },
      fontSize: {
        h1: ["28px", { lineHeight: "1.2", letterSpacing: "-0.025em" }],
        h2: ["24px", { lineHeight: "1.4", letterSpacing: "-0.025em" }],
        h3: ["20px", { lineHeight: "1.4", letterSpacing: "-0.025em" }],
        sub1: ["18px", { lineHeight: "1.4", letterSpacing: "-0.025em" }],
        sub2: ["16px", { lineHeight: "1.4", letterSpacing: "-0.025em" }],
        sub3: ["14px", { lineHeight: "1.4", letterSpacing: "-0.025em" }],
        p1: ["16px", { lineHeight: "1.5", letterSpacing: "-0.02em" }],
        p2: ["14px", { lineHeight: "1.5", letterSpacing: "-0.02em" }],
        p3: ["12px", { lineHeight: "1.5", letterSpacing: "-0.02em" }],
        label1: ["14px", { lineHeight: "1.5", letterSpacing: "-0.02em" }],
        label2: ["12px", { lineHeight: "1.5", letterSpacing: "-0.02em" }],
        caption1: ["11px", { lineHeight: "1.4", letterSpacing: "-0.015em" }],
        caption2: ["10px", { lineHeight: "1.4", letterSpacing: "-0.015em" }],
      },
    },
  },
  plugins: [],
};
export default config;
