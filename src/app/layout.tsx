import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"
import "katex/dist/katex.min.css"
import { Analytics } from "@vercel/analytics/react"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { ContributorsProvider } from "@/contexts/ContributorsContext"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "EZCrack",
  description: "20% Effort, 80% Results",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${poppins.variable} font-poppins antialiased`}
          suppressHydrationWarning
        >
          <ThemeProvider>
            <ContributorsProvider>{children}</ContributorsProvider>
          </ThemeProvider>
        </body>
      </html>
      <Analytics />
    </>
  )
}
