"use client"

import type React from "react"

import { useState } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError("")

    try {
      // Simulación de envío de formulario
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setSubmitSuccess(true)
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      setSubmitError("Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6 text-center">Contáctanos</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div>
            <div className="bg-gray-900 p-8 rounded-lg mb-8">
              <h2 className="text-2xl font-semibold mb-6">Información de Contacto</h2>

              <div className="space-y-6">
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-purple-500 mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Dirección</h3>
                    <p className="text-gray-300">Av. Providencia 1234, Providencia</p>
                    <p className="text-gray-300">Santiago, Chile</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="h-6 w-6 text-purple-500 mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Teléfono</h3>
                    <p className="text-gray-300">+56 2 2123 4567</p>
                    <p className="text-gray-300">+56 9 8765 4321</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-purple-500 mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-gray-300">info@tallerdigital.cl</p>
                    <p className="text-gray-300">ventas@tallerdigital.cl</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="h-6 w-6 text-purple-500 mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Horario de Atención</h3>
                    <p className="text-gray-300">Lunes a Viernes: 9:00 - 18:00</p>
                    <p className="text-gray-300">Sábado: 10:00 - 14:00</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 p-8 rounded-lg">
              <h2 className="text-2xl font-semibold mb-6">Ubicación</h2>
              <div className="bg-gray-800 h-64 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">Mapa de ubicación</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-6">Envíanos un Mensaje</h2>

            {submitSuccess ? (
              <div className="bg-green-900/30 border border-green-500 text-green-300 p-4 rounded-lg mb-6">
                <p className="font-semibold">¡Mensaje enviado con éxito!</p>
                <p>Nos pondremos en contacto contigo lo antes posible.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {submitError && (
                  <div className="bg-red-900/30 border border-red-500 text-red-300 p-4 rounded-lg">
                    <p>{submitError}</p>
                  </div>
                )}

                <div>
                  <label htmlFor="name" className="block mb-2 text-sm font-medium">
                    Nombre Completo
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="bg-gray-800 border-gray-700"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block mb-2 text-sm font-medium">
                      Teléfono
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block mb-2 text-sm font-medium">
                    Asunto
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="bg-gray-800 border-gray-700"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block mb-2 text-sm font-medium">
                    Mensaje
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
