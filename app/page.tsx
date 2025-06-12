"use client"

import { useState, useEffect } from "react"
import InfinityMirror from "@/components/infinity-mirror"
import ProductControls from "@/components/product-controls"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"

export default function Home() {
  const [width, setWidth] = useState(60)
  const [height, setHeight] = useState(60)
  const [depth, setDepth] = useState(10)
  const [ledColor, setLedColor] = useState("rainbow")
  const [isClient, setIsClient] = useState(false)

  // Fix hydration issues
  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleAddToCart = () => {
    alert(`Added to cart: ${width}cm × ${height}cm Infinity Mirror with ${ledColor} LEDs`)
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <section className="flex flex-col lg:flex-row gap-8 items-center mb-16">
          <div className="w-full lg:w-1/2 flex justify-center">
            {isClient && (
              <div className="relative">
                <InfinityMirror width={width} height={height} depth={depth} ledColor={ledColor} />
              </div>
            )}
          </div>

          <div className="w-full lg:w-1/2">
            <h1 className="text-4xl font-bold mb-4">Custom Infinity Mirror</h1>
            <p className="text-gray-300 mb-6">
              Experience the mesmerizing depth of our premium infinity mirrors. Each mirror is handcrafted with
              precision and features high-quality LED lighting that creates a stunning infinite tunnel effect. Customize
              your dimensions and LED color to create the perfect statement piece for your space.
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
                <div className="text-2xl font-bold">${(width * height * 0.015 + 199).toFixed(2)}</div>
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">Product Specifications</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-300">
                <li>
                  Dimensions: {width}cm × {height}cm × {depth}cm
                </li>
                <li>Frame: Premium black aluminum</li>
                <li>LED Type: {ledColor === "rainbow" ? "RGB Rainbow Gradient" : ledColor} LEDs</li>
                <li>Power: Standard wall outlet (adapter included)</li>
                <li>Remote control included</li>
                <li>2-year warranty</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center">Why Choose Our Infinity Mirrors?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-300">
                Handcrafted with premium materials and precision engineering for a flawless infinity effect.
              </p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Customizable</h3>
              <p className="text-gray-300">
                Choose your dimensions, LED colors, and frame style to create your perfect mirror.
              </p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Easy Installation</h3>
              <p className="text-gray-300">
                Simple wall mounting system and plug-and-play power connection. No special wiring needed.
              </p>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  )
}
