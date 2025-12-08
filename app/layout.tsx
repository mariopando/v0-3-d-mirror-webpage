import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import RainbowBackground from "@/components/rainbow-background"
import { CartProvider } from "@/context/cart-context"
import { Toaster } from "@/components/ui/toaster"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Artesano Digital | Espejos Infinitos LED Personalizados",
  description:
    "Espejos infinitos premium con iluminación LED. Crea tu propio espejo infinito único con dimensiones y colores LED ajustables.",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Add Three.js from CDN */}
        <Script src="https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js" strategy="beforeInteractive" />
        <Script
          src="https://cdn.jsdelivr.net/npm/three@0.160.0/examples/js/controls/OrbitControls.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://cdn.jsdelivr.net/npm/three@0.160.0/examples/js/objects/Reflector.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <CartProvider>
            <RainbowBackground />
            <div className="relative z-10 min-h-screen text-foreground">
              {children}
            </div>
            <Toaster />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
