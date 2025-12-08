"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
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
  const router = useRouter()
  const [width, setWidth] = useState(40)
  const [height, setHeight] = useState(50)
  const [depth, setDepth] = useState(4)
  const [ledColor, setLedColor] = useState("rainbow")
  const [isClient, setIsClient] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isAddedToCart, setIsAddedToCart] = useState(false)
  const { addToCart } = useCart()
  const topRef = useRef<HTMLDivElement>(null)

  // New state variables
  const [frameColor, setFrameColor] = useState("madera-natural")
  const [frameDepth, setFrameDepth] = useState(20)

  // Camera settings state
  const [fov, setFov] = useState(60)
  const [aspect, setAspect] = useState(1)
  const [near, setNear] = useState(0.1)
  const [far, setFar] = useState(1000)

  // Custom setters that scroll to top on mobile
  const handleSetLedColor = (color: string) => {
    setLedColor(color)
    if (isMobile) {
      scrollToTop()
    }
  }

  const handleSetFrameColor = (color: string) => {
    setFrameColor(color)
    if (isMobile) {
      scrollToTop()
    }
  }

  const scrollToTop = () => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Fix hydration issues and detect mobile
  useEffect(() => {
    // setIsClient(true)
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => {
      window.removeEventListener('resize', checkMobile)
    }
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
    setIsAddedToCart(true)
  }

  return (
    <main className="min-h-screen text-foreground">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <section className="flex flex-col lg:flex-row gap-8 items-center">
          <div ref={topRef} className="w-full lg:w-1/2">
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
            <h1 className="text-4xl text-center font-bold mb-4 gradient-text block md:hidden">Crea tu Espejo Infinito</h1>
            <h1 className="text-4xl font-bold mb-4 gradient-text hidden md:block">Crea tu propio</h1>
            <div className="tabs hidden md:block">
              <Tabs defaultValue="mirror" className="w-full mb-6">
                <TabsList className="flex flex-col lg:flex-row w-full bg-transparent p-0 gap-4">
                  <TabsTrigger 
                    value="mirror" 
                    className="w-full block data-[state=active]:bg-transparent data-[state=active]:border-2 data-[state=active]:border-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:shadow-lg py-3 px-4 rounded-lg border border-border hidden md:block"
                  >
                    <h1 className="text-base lg:text-2xl font-bold gradient-text break-words whitespace-normal">Espejo infinito</h1>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="table" 
                    disabled 
                    className="w-full block relative bg-transparent rounded-lg py-3 px-4 opacity-70 hidden md:block"
                  >
                    <h1 className="text-sm lg:text-lg font-bold text-muted-foreground break-words whitespace-normal">Mesa de centro infinita</h1>
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">
                      ¡Pronto!
                    </span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="table" 
                    disabled 
                    className="w-full block relative bg-transparent rounded-lg py-3 px-4 opacity-70 hidden md:block"
                  >
                    <h1 className="text-sm lg:text-lg font-bold text-muted-foreground break-words whitespace-normal">Espejo inteligente</h1>
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">
                      ¡Pronto!
                    </span>
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="mirror" className="mt-6">
                  <p className="text-2xl text-muted-foreground mb-6 leading-relaxed gap-4 text-center hidden md:block">
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
                setLedColor={handleSetLedColor}
                frameColor={frameColor}
                setFrameColor={handleSetFrameColor}
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
                {!isAddedToCart ? (
                  <Button
                    onClick={handleAddToCart}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    style={{
                      animation: 'fadeIn 0.3s ease-in-out',
                    }}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Agregar al Carrito
                  </Button>
                ) : (
                  <Button
                    onClick={() => router.push('/carrito')}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                    style={{
                      animation: 'fadeIn 0.3s ease-in-out',
                    }}
                  >
                    Ir a pagar
                  </Button>
                )}
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
                <li>Alimentación por USB</li>
                <li>Despacho a todo Chile, en 48 horas para productos prefabricados y de 6 a 12 días para productos personalizados</li>
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
                Nuestros Espejos Infinitos son fabricados artesanalmente con materiales de primera calidad y una ingeniería de precisión que les otorga un efecto infinito impecable. Cada espejo es una obra de arte, diseñada para brindar una experiencia visual excepcional en tu hogar.
              </p>
            </div>
            <div className="bg-card border border-border p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-3 text-foreground">Personalizable</h3>
              <p className="text-muted-foreground leading-relaxed">
                Elige las dimensiones, colores LED y el estilo del marco para crear el espejo perfecto que se adapte a tus necesidades y a la decoración de tu espacio. Personaliza tu Espejo Infinito y conviértelo en una pieza única que refleje tu estilo.
              </p>
            </div>
            <div className="bg-card border border-border p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-3 text-foreground">Fácil Instalación</h3>
              <p className="text-muted-foreground leading-relaxed">
                Nuestros Espejos Infinitos cuentan con un sistema de montaje en pared simple y una conexión plug-and-play. No necesitas realizar ningún cableado especial, lo que hace que la instalación sea rápida y sencilla. Disfruta de la belleza de tu nuevo espejo sin complicaciones.
              </p>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  )
}