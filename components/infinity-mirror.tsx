"use client"

import { useEffect, useRef, useState } from "react"

interface InfinityMirrorProps {
  width: number
  height: number
  depth: number
  ledColor: string
}

export default function InfinityMirror({ width, height, depth, ledColor }: InfinityMirrorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Simplificamos el componente para evitar problemas con Three.js
  // Creamos una versión simplificada usando Canvas 2D
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Establecer dimensiones del canvas
    canvas.width = 400
    canvas.height = 400

    // Función para obtener color basado en la posición y configuración de LED
    const getLedColor = (position: number): string => {
      if (ledColor === "rainbow") {
        // Crear gradiente arcoíris
        const hue = (position * 360) % 360
        return `hsl(${hue}, 100%, 50%)`
      } else if (ledColor === "white") {
        return "#ffffff"
      } else if (ledColor === "blue") {
        return "#0088ff"
      } else if (ledColor === "green") {
        return "#00ff88"
      } else if (ledColor === "purple") {
        return "#8800ff"
      } else {
        return "#ff0088" // Rosa por defecto
      }
    }

    // Función para dibujar el espejo
    const drawMirror = () => {
      if (!ctx) return

      // Limpiar canvas
      ctx.fillStyle = "#000000"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Dibujar marco
      ctx.strokeStyle = "#333333"
      ctx.lineWidth = 10
      ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100)

      // Calcular proporciones
      const mirrorWidth = canvas.width - 100
      const mirrorHeight = canvas.height - 100
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      // Dibujar efecto de profundidad
      const maxDepth = 8
      for (let d = maxDepth; d > 0; d--) {
        const scale = 1 - d * 0.1
        const rectWidth = mirrorWidth * scale
        const rectHeight = mirrorHeight * scale
        const x = centerX - rectWidth / 2
        const y = centerY - rectHeight / 2

        // Dibujar rectángulo de fondo para cada nivel
        ctx.fillStyle = `rgba(0, 0, 0, ${0.7 + d * 0.03})`
        ctx.fillRect(x, y, rectWidth, rectHeight)
      }

      // Dibujar LEDs
      const numLeds = 20
      const ledSize = 4

      // Función para dibujar un LED y su reflejo
      const drawLed = (x: number, y: number, position: number) => {
        const color = getLedColor(position)

        // LED principal
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(x, y, ledSize, 0, Math.PI * 2)
        ctx.fill()

        // Brillo alrededor del LED
        const gradient = ctx.createRadialGradient(x, y, ledSize, x, y, ledSize * 3)
        gradient.addColorStop(0, color)
        gradient.addColorStop(1, "rgba(0,0,0,0)")
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(x, y, ledSize * 3, 0, Math.PI * 2)
        ctx.fill()

        // Reflejos de profundidad
        for (let d = 1; d <= 5; d++) {
          const scale = 1 - d * 0.15
          const reflectX = centerX - (centerX - x) * scale
          const reflectY = centerY - (centerY - y) * scale
          const opacity = 1 - d * 0.18

          ctx.fillStyle = color
          ctx.globalAlpha = opacity
          ctx.beginPath()
          ctx.arc(reflectX, reflectY, ledSize * (1 - d * 0.1), 0, Math.PI * 2)
          ctx.fill()
          ctx.globalAlpha = 1
        }
      }

      // Dibujar LEDs en los bordes
      // Borde superior
      for (let i = 0; i < numLeds; i++) {
        const x = 50 + (mirrorWidth * i) / (numLeds - 1)
        const y = 50
        drawLed(x, y, i / numLeds)
      }

      // Borde derecho
      for (let i = 0; i < numLeds; i++) {
        const x = canvas.width - 50
        const y = 50 + (mirrorHeight * i) / (numLeds - 1)
        drawLed(x, y, (i + numLeds) / (numLeds * 4))
      }

      // Borde inferior
      for (let i = 0; i < numLeds; i++) {
        const x = canvas.width - 50 - (mirrorWidth * i) / (numLeds - 1)
        const y = canvas.height - 50
        drawLed(x, y, (i + numLeds * 2) / (numLeds * 4))
      }

      // Borde izquierdo
      for (let i = 0; i < numLeds; i++) {
        const x = 50
        const y = canvas.height - 50 - (mirrorHeight * i) / (numLeds - 1)
        drawLed(x, y, (i + numLeds * 3) / (numLeds * 4))
      }
    }

    // Función de animación
    let animationId: number
    const animate = () => {
      drawMirror()
      animationId = requestAnimationFrame(animate)
    }

    // Iniciar animación
    animate()
    setIsLoading(false)

    // Limpieza
    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [width, height, depth, ledColor])

  return (
    <div className="relative">
      <div className="w-[400px] h-[400px] bg-black rounded-lg overflow-hidden shadow-2xl">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <canvas ref={canvasRef} className="w-full h-full" style={{ display: isLoading ? "none" : "block" }} />
        )}
      </div>
      <div className="absolute inset-0 pointer-events-none rounded-lg shadow-[0_0_50px_rgba(255,0,255,0.3)]"></div>
    </div>
  )
}
