import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { CartProvider } from "@/context/cart-context"

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
        <script src="https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js" defer></script>
        <script
          defer
          dangerouslySetInnerHTML={{
            __html: `
      document.addEventListener('DOMContentLoaded', function() {
        // Make sure THREE is available globally
        if (typeof THREE !== 'undefined') {
          window.THREE = THREE;
          
          // Load OrbitControls after THREE is available
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/js/controls/OrbitControls.js';
          script.onload = function() {
            console.log('Three.js and OrbitControls loaded successfully');
          };
          document.head.appendChild(script);
        } else {
          console.error('THREE is not defined');
        }
      });
    `,
          }}
        ></script>
      </head>
      <body className="min-h-screen bg-black text-white">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  )
}
