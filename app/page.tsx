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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { InfoIcon } from "lucide-react"

export default function Home() {
  const [width, setWidth] = useState(40)
  const [height, setHeight] = useState(50)
  const [depth, setDepth] = useState(4)
  const [ledColor, setLedColor] = useState("rainbow")
  const [isClient, setIsClient] = useState(false)
  const { addToCart } = useCart()

  // New state variables
  const [frameColor, setFrameColor] = useState("#FFFFFF")
  const [frameDepth, setFrameDepth] = useState(20)

  // Camera settings state
  const [fov, setFov] = useState(60)
  const [aspect, setAspect] = useState(1)
  const [near, setNear] = useState(0.1)
  const [far, setFar] = useState(1000)



  // Fix hydration issues
  useEffect(() => {
    // setIsClient(true)
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

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <section className="flex flex-col lg:flex-row gap-8 items-center mb-16">
          <div className="w-full h-full lg:w-1/2">
                <InfinityMirror
                  width={width}
                  height={height}
                  depth={depth}
                  ledColor={ledColor}
                  frameColor={frameColor}
                  fov={fov}
                  aspect={aspect}
                  near={near}
                  far={far}
                />
          </div>
          <div className="w-full lg:w-1/2">
            <h1 className="text-4xl font-bold mb-4 gradient-text">Crea tu propio</h1>
            <div className="tabs">
              <Tabs defaultValue="mirror" className="w-full mb-6">
                <TabsList className="grid w-full grid-cols-2 bg-transparent p-0 gap-4">
                  <TabsTrigger 
                    value="mirror" 
                    className="data-[state=active]:bg-transparent data-[state=active]:border-2 data-[state=active]:border-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:shadow-lg py-3 rounded-lg border border-border"
                  >
                    <h1 className="text-2xl font-bold gradient-text">Espejo infinito</h1>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="table" 
                    disabled 
                    className="relative bg-transparent border border-border rounded-lg py-3 opacity-70"
                  >
                    <h1 className="text-2xl font-bold text-muted-foreground">Mesa de centro infinita</h1>
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">
                      ¡Pronto!
                    </span>
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="mirror" className="mt-6">
                  <p className="text-2xl text-muted-foreground mb-6 leading-relaxed gap-4 text-center">
                    Descubre la experiencia sensorial de nuestros espejos infinitos de edición maestra.
                    Cada pieza es una sinfonía de precisión milimétrica y artesanía experta, elige y personalizalo como quieras!
                  </p>
                </TabsContent>
                <TabsContent value="table">
                  {/* Content for the table tab (will be disabled for now) */}
                </TabsContent>
              </Tabs>
            </div>

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
                <li>Marco: Madera pintada</li>
                <li>Espejo: 2mm espesor</li>
                <li>Led: Con conexion WiFi y/o Bluetooth a traves de app para Android/iOS</li>
                <li>
                  Color del marco de LED:{" "}
                  {frameColor === "black"
                    ? "Negro"
                    : frameColor === "white"
                      ? "Blanco"
                      : frameColor === "blue"
                        ? "Azul"
                        : frameColor === "green"
                          ? "Verde"
                          : frameColor === "purple"
                            ? "Púrpura"
                              : frameColor === "pink"
                                ? "Rosa"
                                  : frameColor === "bluehammered"
                                    ? "Azul martillado"
                                    : frameColor === "greenhammered"
                                      ? "Verde martillado"
                                : ""}
                </li>
                <li>Alimentación: Enchufe estándar (adaptador incluido)</li>
                <li>Control remoto incluido</li>
                <li>1 año de garantía</li>
              </ul>
            </div>
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
