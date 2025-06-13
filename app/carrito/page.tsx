"use client"

import type React from "react"

import { useState } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useCart } from "@/context/cart-context"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, Minus, CreditCard } from "lucide-react"
import Link from "next/link"
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react"
import { Input } from "@/components/ui/input"

// Inicializar MercadoPago con la clave pública de prueba
// En producción, esto debería venir de variables de entorno
initMercadoPago("TEST-a1234567-1234-1234-1234-123456789012")

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [preferenceId, setPreferenceId] = useState<string | null>(null)

  // Datos de envío
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    region: "",
    postalCode: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setShippingInfo((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckout = async () => {
    setIsCheckingOut(true)

    try {
      // En un caso real, esto sería una llamada a tu API para crear una preferencia de pago
      // Simulamos la creación de una preferencia
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // ID de preferencia de prueba
      setPreferenceId("123456789")
    } catch (error) {
      console.error("Error al crear la preferencia de pago", error)
    }
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-6">Tu Carrito está Vacío</h1>
          <p className="text-gray-400 mb-8">No tienes productos en tu carrito de compras.</p>
          <Link href="/productos">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              Ver Productos
            </Button>
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Carrito de Compras</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-gray-900 rounded-lg p-6 mb-6">
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row gap-4 pb-6 border-b border-gray-800">
                    <div className="w-24 h-24 bg-gray-800 rounded-lg flex-shrink-0">
                      <img
                        src={item.image || "/placeholder.svg?height=100&width=100"}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    <div className="flex-grow">
                      <h3 className="font-semibold mb-1">{item.name}</h3>
                      {item.width && item.height && item.depth && (
                        <p className="text-sm text-gray-400 mb-1">
                          {item.width}cm × {item.height}cm × {item.depth}cm
                        </p>
                      )}
                      {item.ledColor && (
                        <p className="text-sm text-gray-400 mb-2">
                          Color LED:{" "}
                          {item.ledColor === "rainbow"
                            ? "Arcoíris"
                            : item.ledColor === "white"
                              ? "Blanco"
                              : item.ledColor === "blue"
                                ? "Azul"
                                : item.ledColor === "green"
                                  ? "Verde"
                                  : item.ledColor === "purple"
                                    ? "Púrpura"
                                    : "Rosa"}
                        </p>
                      )}
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="mx-3">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{formatCurrency(item.price * item.quantity)}</div>
                          <div className="text-sm text-gray-400">{formatCurrency(item.price)} c/u</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-lg p-6 sticky top-20">
              <h2 className="text-xl font-semibold mb-4">Resumen del Pedido</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Envío</span>
                  <span>Calculado en el siguiente paso</span>
                </div>
                <div className="border-t border-gray-800 pt-3 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>
              </div>

              {!isCheckingOut ? (
                <Button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <CreditCard className="mr-2 h-5 w-5" />
                  Proceder al Pago
                </Button>
              ) : preferenceId ? (
                <div className="space-y-4">
                  <div className="bg-green-900/30 border border-green-500 text-green-300 p-4 rounded-lg">
                    <p>¡Estás a un paso de completar tu compra!</p>
                  </div>

                  {/* Botón de pago de MercadoPago */}
                  <div className="w-full">
                    <Wallet initialization={{ preferenceId }} />
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <h3 className="font-semibold">Información de Envío</h3>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm mb-1">
                        Nombre Completo
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={shippingInfo.name}
                        onChange={handleInputChange}
                        className="bg-gray-800 border-gray-700"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="email" className="block text-sm mb-1">
                          Email
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={shippingInfo.email}
                          onChange={handleInputChange}
                          className="bg-gray-800 border-gray-700"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm mb-1">
                          Teléfono
                        </label>
                        <Input
                          id="phone"
                          name="phone"
                          value={shippingInfo.phone}
                          onChange={handleInputChange}
                          className="bg-gray-800 border-gray-700"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="address" className="block text-sm mb-1">
                        Dirección
                      </label>
                      <Input
                        id="address"
                        name="address"
                        value={shippingInfo.address}
                        onChange={handleInputChange}
                        className="bg-gray-800 border-gray-700"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="city" className="block text-sm mb-1">
                          Ciudad
                        </label>
                        <Input
                          id="city"
                          name="city"
                          value={shippingInfo.city}
                          onChange={handleInputChange}
                          className="bg-gray-800 border-gray-700"
                        />
                      </div>
                      <div>
                        <label htmlFor="region" className="block text-sm mb-1">
                          Región
                        </label>
                        <Input
                          id="region"
                          name="region"
                          value={shippingInfo.region}
                          onChange={handleInputChange}
                          className="bg-gray-800 border-gray-700"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="postalCode" className="block text-sm mb-1">
                        Código Postal
                      </label>
                      <Input
                        id="postalCode"
                        name="postalCode"
                        value={shippingInfo.postalCode}
                        onChange={handleInputChange}
                        className="bg-gray-800 border-gray-700"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={() => setPreferenceId("123456789")}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    Continuar con el Pago
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
