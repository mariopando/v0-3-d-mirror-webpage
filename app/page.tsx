"use client"

import { useState, useEffect } from "react"
import ProductControls from "@/components/product-controls"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { formatCurrency } from "@/lib/utils"
import InfinityMirror from "@/components/infinity-mirror"

export default function Home() {
  const [width, setWidth] = useState(60)
  const [height, setHeight] = useState(60)
  const [depth, setDepth] = useState(10)
  const [ledColor, setLedColor] = useState("rainbow")
  const [isClient, setIsClient] = useState(false)
  const { addToCart } = useCart()

  // Fix hydration issues
  useEffect(() => {
    setIsClient(true)
  }, [])

  const calculatePrice = () => {
    // Base price in Chilean Pesos (approx. 199 USD = ~180,000 CLP)
    const basePrice = 180000
    // Add price based on size (0.015 USD = ~13.5 CLP per square cm)
    return basePrice + width * height * 13.5
  }

  const handleAddToCart = () => {
    const product = {
      id: `custom-${width}-${height}-${depth}-${ledColor}`,
      name: `Espejo Infinito ${width}cm × ${height}cm`,
      price: calculatePrice(),
      width,
      height,
      depth,
      ledColor,
      quantity: 1,
      image: "/product-image.jpg", // Default image
    }

    addToCart(product)
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <section className="flex flex-col lg:flex-row gap-4 items-center mb-16">
          <div className="w-full lg:w-1/2 flex justify-center">
            {isClient && (
              <div className="relative">
                <InfinityMirror width={width} height={height} depth={depth} ledColor={ledColor} />
              </div>
            )}
          </div>

          <div className="w-full lg:w-1/2">
            <h1 className="text-4xl font-bold mb-4">Espejo Infinito Personalizado</h1>
            <p className="text-gray-300 mb-6">
              Experimenta la fascinante profundidad de nuestros espejos infinitos premium. Cada espejo está fabricado
              artesanalmente con precisión y cuenta con iluminación LED de alta calidad que crea un impresionante efecto
              de túnel infinito. Personaliza las dimensiones y el color de los LED para crear la pieza perfecta para tu
              espacio.
            </p>

            <div className="bg-gray-900 rounded-lg p-6 mb-6">
              <ProductControls
                width={width}
                setWidth={setWidth}
                height={height}
                setHeight={setHeight}
                depth={depth}
                setDepth={setDepth}
                ledColor={ledColor}
                setLedColor={setLedColor}
              />

              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <div className="text-2xl font-bold">{formatCurrency(calculatePrice())}</div>
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Agregar al Carrito
                </Button>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">Especificaciones del Producto</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-300">
                <li>
                  Dimensiones: {width}cm × {height}cm × {depth}cm
                </li>
                <li>Marco: Aluminio negro premium</li>
                <li>
                  Tipo de LED:{" "}
                  {ledColor === "rainbow"
                    ? "Gradiente RGB Arcoíris"
                    : ledColor === "white"
                      ? "Blanco"
                      : ledColor === "blue"
                        ? "Azul"
                        : ledColor === "green"
                          ? "Verde"
                          : ledColor === "purple"
                            ? "Púrpura"
                            : "Rosa"}
                </li>
                <li>Alimentación: Enchufe estándar (adaptador incluido)</li>
                <li>Control remoto incluido</li>
                <li>2 años de garantía</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center">¿Por qué elegir nuestros Espejos Infinitos?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Calidad Premium</h3>
              <p className="text-gray-300">
                Fabricados artesanalmente con materiales premium e ingeniería de precisión para un efecto infinito
                impecable.
              </p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Personalizable</h3>
              <p className="text-gray-300">
                Elige las dimensiones, colores LED y estilo del marco para crear tu espejo perfecto.
              </p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Fácil Instalación</h3>
              <p className="text-gray-300">
                Sistema de montaje en pared simple y conexión plug-and-play. No se necesita cableado especial.
              </p>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  )
}
