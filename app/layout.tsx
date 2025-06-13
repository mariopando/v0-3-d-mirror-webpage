import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { CartProvider } from "@/context/cart-context"
import Script from "next/script"

export const metadata: Metadata = {
  title: "TallerModerno | Espejos Infinitos LED Personalizados",
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
    <html lang="es" className="dark">
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
      <body className="min-h-screen bg-black text-white">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  )
}
