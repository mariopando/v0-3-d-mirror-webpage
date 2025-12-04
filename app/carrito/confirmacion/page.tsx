"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { getPaymentStatus } from "@/lib/payment-service"
import Link from "next/link"
import { CheckCircle, AlertCircle, Loader } from "lucide-react"

export default function ConfirmacionPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const transactionId = searchParams.get("transactionId")
  const provider = (searchParams.get("provider") as 'transbank' | 'mercado_pago') || 'transbank'

  const [status, setStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (!transactionId) {
        setError("No transaction ID provided")
        setLoading(false)
        return
      }

      try {
        const response = await getPaymentStatus(transactionId, provider)
        setStatus(response.status)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error al verificar el pago"
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    checkPaymentStatus()
  }, [transactionId, provider])

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <Loader className="h-12 w-12 animate-spin mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">Verificando pago...</h1>
          <p className="text-gray-400">Por favor espera mientras procesamos tu pago.</p>
        </div>
        <Footer />
      </main>
    )
  }

  const isSuccess = status === 'captured' || status === 'authorized'

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="container mx-auto px-4 py-16 text-center">
        {isSuccess ? (
          <div className="max-w-md mx-auto">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4">¡Pago Exitoso!</h1>
            <p className="text-gray-400 mb-2">Tu pedido ha sido confirmado.</p>
            <p className="text-gray-400 mb-6">Orden ID: {orderId}</p>
            <p className="text-gray-400 mb-8">Recibirás un email de confirmación pronto.</p>
            <Link href="/">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Volver al inicio
              </Button>
            </Link>
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4">Pago Rechazado</h1>
            <p className="text-gray-400 mb-2">No pudimos procesar tu pago.</p>
            {error && <p className="text-red-400 mb-6">{error}</p>}
            <p className="text-gray-400 mb-8">Por favor, intenta nuevamente.</p>
            <Link href="/carrito">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Volver al carrito
              </Button>
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}