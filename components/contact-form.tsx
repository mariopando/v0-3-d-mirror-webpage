"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export default function ContactForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const validateEmail = (emailValue: string): boolean => {
    return emailRegex.test(emailValue)
  }

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      if (!name.trim() || !email.trim() || !message.trim()) {
        toast({
          title: "Error",
          description: "Por favor completa todos los campos",
          variant: "destructive",
        })
        return
      }

      if (!validateEmail(email)) {
        toast({
          title: "Error",
          description: "Por favor ingresa un email válido",
          variant: "destructive",
        })
        return
      }

      setIsLoading(true)

      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre: name,
            email: email,
            mensaje: message,
          }),
        })

        if (!response.ok) {
          throw new Error("Error al enviar el mensaje")
        }

        const data = await response.json()

        toast({
          title: "Éxito",
          description: "Tu mensaje ha sido enviado correctamente",
          variant: "default",
        })

        // Reset form
        setName("")
        setEmail("")
        setMessage("")
      } catch (error) {
        console.error("Error:", error)
        toast({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Hubo un error al enviar el mensaje",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [name, email, message, toast]
  )

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm gap-5">
      <h3 className="text-base lg:text-2xl font-bold gradient-text break-words whitespace-normal">
        ¿Buscas algo mas personalizado?
      </h3>
      <h2 className="text-l font-semibold mb-4 text-foreground">Si tienes algo en mente no dudes en comunicarte con nosotros a traves de nuestro Whatsapp o cualquiera de nuestras RRSS.</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2 text-foreground">
            Nombre
          </label>
          <Input
            id="name"
            type="text"
            placeholder="Tu nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
            className="w-full"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2 text-foreground">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="w-full"
          />
          {email && !validateEmail(email) && (
            <p className="text-xs text-red-500 mt-1">Por favor ingresa un email válido</p>
          )}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-2 text-foreground">
            Mensaje
          </label>
          <Textarea
            id="message"
            placeholder="Tu mensaje..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isLoading}
            className="w-full resize-none"
            rows={5}
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
        >
          {isLoading ? "Enviando..." : "Enviar Mensaje"}
        </Button>
      </form>
    </div>
  )
}
