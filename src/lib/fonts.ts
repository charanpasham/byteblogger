import { Inter, JetBrains_Mono, Source_Serif_4 } from "next/font/google";

// UI chrome: navigation, buttons, forms, metadata.
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// Long-form reading and writing: post bodies, titles, the editor canvas.
const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  variable: "--font-source-serif",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

export const fontVariables = `${inter.variable} ${sourceSerif.variable} ${jetbrainsMono.variable}`;
