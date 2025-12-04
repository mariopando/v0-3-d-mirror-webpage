"use client"

import type React from "react"
import { useState } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useCart } from "@/context/cart-context"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, Minus, CreditCard, Loader } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { initializePayment, confirmPayment, PaymentInitializeRequest } from "@/lib/payment-service"

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [paymentProvider, setPaymentProvider] = useState<'transbank' | 'mercado_pago'>('transbank')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [transactionId, setTransactionId] = useState<string | null>(null)

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

  const validateShippingInfo = (): boolean => {
    return (
      shippingInfo.name.trim() !== "" &&
      shippingInfo.email.trim() !== "" &&
      shippingInfo.phone.trim() !== "" &&
      shippingInfo.address.trim() !== "" &&
      shippingInfo.city.trim() !== "" &&
      shippingInfo.region.trim() !== "" &&
      shippingInfo.postalCode.trim() !== ""
    )
  }

  const handlePayment = async () => {
    if (!validateShippingInfo()) {
      setError("Por favor, completa todos los campos de envío")
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const orderId = `ORD-${Date.now()}`
      const paymentData: PaymentInitializeRequest = {
        amount: totalPrice,
        currency: "CLP",
        orderId,
        description: `Pedido de Espejo Infinito - ${items.length} producto(s)`,
        customerEmail: shippingInfo.email,
        customerName: shippingInfo.name,
        returnUrl: `${window.location.origin}/carrito/confirmacion?orderId=${orderId}`
      }

      const response = await initializePayment(paymentProvider, paymentData)
      
      if (response.redirectUrl) {
        setTransactionId(response.transactionId)
        // Redirect to payment provider
        window.location.href = response.redirectUrl
      } else {
        throw new Error("No redirect URL provided")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al procesar el pago"
      setError(errorMessage)
      console.error("Payment error:", err)
    } finally {
      setIsProcessing(false)
    }
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-6">Tu Carrito está Vacío</h1>
          <p className="text-gray-400 mb-8">No tienes productos en tu carrito de compras.</p>
          <Link href="/servicios">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              Ver Servicios
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
                  onClick={() => setIsCheckingOut(true)}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <CreditCard className="mr-2 h-5 w-5" />
                  Proceder al Pago
                </Button>
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

                  <div className="space-y-3">
                    <h3 className="font-semibold">Método de Pago</h3>
                    <RadioGroup value={paymentProvider} onValueChange={(value) => setPaymentProvider(value as 'transbank' | 'mercado_pago')}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="transbank" id="transbank" />
                        <label htmlFor="transbank" className="cursor-pointer">Transbank</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="mercado_pago" id="mercado_pago" />
                        <label htmlFor="mercado_pago" className="cursor-pointer">Mercado Pago</label>
                      </div>
                    </RadioGroup>
                  </div>

                  {error && (
                    <div className="bg-red-900/30 border border-red-500 text-red-300 p-4 rounded-lg">
                      <p>{error}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Button
                      onClick={handlePayment}
                      disabled={isProcessing}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      {isProcessing ? (
                        <>
                          <Loader className="mr-2 h-5 w-5 animate-spin" />
                          Procesando...
                        </>
                      ) : (
                        <>
                          <CreditCard className="mr-2 h-5 w-5" />
                          Pagar ${formatCurrency(totalPrice)}
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => {
                        setIsCheckingOut(false)
                        setError(null)
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      Volver
                    </Button>
                  </div>
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
