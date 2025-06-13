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
        {/* Add Three.js from CDN using Next.js Script component for better loading */}
        <Script src="https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js" strategy="beforeInteractive" />
        <Script
          id="orbit-controls"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // Make THREE available globally
              if (typeof THREE !== 'undefined') {
                window.THREE = THREE;
                
                // Load OrbitControls
                const orbitControlsScript = document.createElement('script');
                orbitControlsScript.src = 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/js/controls/OrbitControls.js';
                document.head.appendChild(orbitControlsScript);
                
                console.log('Three.js loaded successfully');
              } else {
                console.error('THREE is not defined');
              }
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-black text-white">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  )
}
