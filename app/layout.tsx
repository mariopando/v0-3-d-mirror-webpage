import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Infinity Mirrors | Custom LED Infinity Mirror Shop",
  description:
    "Premium custom infinity mirrors with LED lighting. Create your own unique infinity mirror with adjustable dimensions and LED colors.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-black text-white">{children}</body>
    </html>
  )
}
