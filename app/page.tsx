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
import { RadioGroup } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export default function Home() {
  const [width, setWidth] = useState(100)
  const [height, setHeight] = useState(100)
  const [depth, setDepth] = useState(10)
  const [ledColor, setLedColor] = useState("rainbow")
  const [isClient, setIsClient] = useState(false)
  const { addToCart } = useCart()

  // New state variables
  const [frameColor, setFrameColor] = useState("#FFFFFF")
  const [frameWidth, setFrameWidth] = useState(2)
  const [frameDepth, setFrameDepth] = useState(20)
  const [surfaceMirrorTransparency, setSurfaceMirrorTransparency] = useState(1)

  // Camera settings state
  const [fov, setFov] = useState(60)
  const [aspect, setAspect] = useState(1)
  const [near, setNear] = useState(0.1)
  const [far, setFar] = useState(1000)

  // Background color state
  const [backgroundColor, setBackgroundColor] = useState(1)
  const [bgGrayLevel, setBgGrayLevel] = useState(1)

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
      id: `custom-${width}-${height}-${frameDepth}-${ledColor}`,
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

  // Helper to map 1-5 to grayscale hex
  const getGrayHex = (level: number) => {
    const gray = Math.round(((level - 1) / 4) * 255)
    return (gray << 16) | (gray << 8) | gray
  }

  const bgGray = getGrayHex(bgGrayLevel)

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <section className="flex flex-col lg:flex-row gap-8 items-center mb-16">
          <div className="w-full lg:w-1/2 flex justify-center">
            {isClient && (
              <div className="mirror-container p-4">
                <InfinityMirror
                  width={width}
                  height={height}
                  depth={depth}
                  ledColor={ledColor}
                  frameColor={frameColor}
                  frameWidth={frameWidth}
                  frameDepth={frameDepth}
                  surfaceMirrorTransparency={surfaceMirrorTransparency}
                  fov={fov}
                  aspect={aspect}
                  near={near}
                  far={far}
                  backgroundColor={bgGray}
                />
              </div>
            )}
          </div>
          <div className="w-full lg:w-1/2">
            <h1 className="text-4xl font-bold mb-4 gradient-text">Espejo Infinito Personalizado</h1>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Experimenta la fascinante profundidad de nuestros espejos infinitos premium. Cada espejo está fabricado
              artesanalmente con precisión y cuenta con iluminación LED de alta calidad que crea un impresionante efecto
              de túnel infinito. Personaliza las dimensiones y el color de los LED para crear la pieza perfecta para tu
              espacio.
            </p>

            <div className="bg-card border border-border rounded-lg p-6 mb-6 shadow-sm">
              <ProductControls
                width={width}
                setWidth={setWidth}
                height={height}
                setHeight={setHeight}
                depth={depth}
                setDepth={setDepth}
                ledColor={ledColor}
                setLedColor={setLedColor}
                frameColor={frameColor}
                setFrameColor={setFrameColor}
                frameWidth={frameWidth}
                setFrameWidth={setFrameWidth}
                frameDepth={frameDepth}
                setFrameDepth={setFrameDepth}
                surfaceMirrorTransparency={surfaceMirrorTransparency}
                setSurfaceMirrorTransparency={setSurfaceMirrorTransparency}
                fov={fov}
                setFov={setFov}
                aspect={aspect}
                setAspect={setAspect}
                near={near}
                setNear={setNear}
                far={far}
                setFar={setFar}
              />

              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <div className="text-2xl font-bold text-primary">{formatCurrency(calculatePrice())}</div>
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Agregar al Carrito
                </Button>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-foreground">Especificaciones del Producto</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
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

        <section className="flex flex-col lg:flex-row gap-4 items-center mb-16">
          <div className="w-full lg:w-1/2 flex flex-col items-center">
            <Label className="block text-sm font-medium mb-4 text-foreground">Color de fondo del visor 3D</Label>
            <RadioGroup
              className="flex gap-4"
              value={String(bgGrayLevel)}
              onValueChange={(val) => setBgGrayLevel(Number(val))}
            >
              {[1, 2, 3, 4, 5].map((level) => (
                <div key={level} className="flex flex-col items-center">
                  <input
                    type="radio"
                    id={`bg-${level}`}
                    name="background"
                    value={String(level)}
                    checked={bgGrayLevel === level}
                    onChange={() => setBgGrayLevel(level)}
                    className="sr-only"
                  />
                  <label htmlFor={`bg-${level}`} className="cursor-pointer flex flex-col items-center">
                    <span
                      className="w-8 h-8 rounded border-2 border-border block mb-1 hover:scale-110 transition-transform"
                      style={{
                        background: `#${getGrayHex(level).toString(16).padStart(6, "0")}`,
                        borderColor: bgGrayLevel === level ? "hsl(var(--primary))" : "hsl(var(--border))",
                      }}
                    />
                    <span className="text-xs text-muted-foreground">{level}</span>
                  </label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-foreground">
            ¿Por qué elegir nuestros Espejos Infinitos?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card border border-border p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-3 text-foreground">Calidad Premium</h3>
              <p className="text-muted-foreground leading-relaxed">
                Fabricados artesanalmente con materiales premium e ingeniería de precisión para un efecto infinito
                impecable.
              </p>
            </div>
            <div className="bg-card border border-border p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-3 text-foreground">Personalizable</h3>
              <p className="text-muted-foreground leading-relaxed">
                Elige las dimensiones, colores LED y estilo del marco para crear tu espejo perfecto.
              </p>
            </div>
            <div className="bg-card border border-border p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-3 text-foreground">Fácil Instalación</h3>
              <p className="text-muted-foreground leading-relaxed">
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
