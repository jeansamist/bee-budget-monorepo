import { Lora } from "next/font/google"

// Serif for the landing headlines, as on the portfolio (exposed as `font-serif`).
export const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  style: ["normal", "italic"],
})
