"use client"

import { useEffect, useRef } from "react"

interface FallbackMirrorProps {
  width: number
  height: number
  depth: number
  ledColor: string
}

export default function FallbackMirror({ width, height, depth, ledColor }: FallbackMirrorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set background
    ctx.fillStyle = "#000"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Calculate dimensions
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const mirrorWidth = width * 2
    const mirrorHeight = height * 2

    // Draw mirror frame
    ctx.strokeStyle = "#333"
    ctx.lineWidth = 10
    ctx.strokeRect(centerX - mirrorWidth / 2, centerY - mirrorHeight / 2, mirrorWidth, mirrorHeight)

    // Draw LED colors
    const getLedColor = () => {
      switch (ledColor) {
        case "rainbow":
          return "linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)"
        case "white":
          return "#fff"
        case "blue":
          return "#08f"
        case "green":
          return "#0f8"
        case "purple":
          return "#80f"
        default:
          return "#f08" // Pink default
      }
    }

    // Draw LEDs
    const drawLEDs = () => {
      const color = getLedColor()

      if (ledColor === "rainbow") {
        // Create rainbow gradient for the top edge
        const topGradient = ctx.createLinearGradient(
          centerX - mirrorWidth / 2,
          centerY - mirrorHeight / 2,
          centerX + mirrorWidth / 2,
          centerY - mirrorHeight / 2,
        )
        topGradient.addColorStop(0, "red")
        topGradient.addColorStop(0.17, "orange")
        topGradient.addColorStop(0.33, "yellow")
        topGradient.addColorStop(0.5, "green")
        topGradient.addColorStop(0.67, "blue")
        topGradient.addColorStop(0.83, "indigo")
        topGradient.addColorStop(1, "violet")

        ctx.fillStyle = topGradient
        ctx.fillRect(centerX - mirrorWidth / 2, centerY - mirrorHeight / 2 - 5, mirrorWidth, 5)

        // Right edge
        const rightGradient = ctx.createLinearGradient(
          centerX + mirrorWidth / 2,
          centerY - mirrorHeight / 2,
          centerX + mirrorWidth / 2,
          centerY + mirrorHeight / 2,
        )
        rightGradient.addColorStop(0, "violet")
        rightGradient.addColorStop(0.17, "indigo")
        rightGradient.addColorStop(0.33, "blue")
        rightGradient.addColorStop(0.5, "green")
        rightGradient.addColorStop(0.67, "yellow")
        rightGradient.addColorStop(0.83, "orange")
        rightGradient.addColorStop(1, "red")

        ctx.fillStyle = rightGradient
        ctx.fillRect(centerX + mirrorWidth / 2, centerY - mirrorHeight / 2, 5, mirrorHeight)

        // Bottom edge
        const bottomGradient = ctx.createLinearGradient(
          centerX - mirrorWidth / 2,
          centerY + mirrorHeight / 2,
          centerX + mirrorWidth / 2,
          centerY + mirrorHeight / 2,
        )
        bottomGradient.addColorStop(0, "red")
        bottomGradient.addColorStop(0.17, "orange")
        bottomGradient.addColorStop(0.33, "yellow")
        bottomGradient.addColorStop(0.5, "green")
        bottomGradient.addColorStop(0.67, "blue")
        bottomGradient.addColorStop(0.83, "indigo")
        bottomGradient.addColorStop(1, "violet")

        ctx.fillStyle = bottomGradient
        ctx.fillRect(centerX - mirrorWidth / 2, centerY + mirrorHeight / 2, mirrorWidth, 5)

        // Left edge
        const leftGradient = ctx.createLinearGradient(
          centerX - mirrorWidth / 2,
          centerY - mirrorHeight / 2,
          centerX - mirrorWidth / 2,
          centerY + mirrorHeight / 2,
        )
        leftGradient.addColorStop(0, "violet")
        leftGradient.addColorStop(0.17, "indigo")
        leftGradient.addColorStop(0.33, "blue")
        leftGradient.addColorStop(0.5, "green")
        leftGradient.addColorStop(0.67, "yellow")
        leftGradient.addColorStop(0.83, "orange")
        leftGradient.addColorStop(1, "red")

        ctx.fillStyle = leftGradient
        ctx.fillRect(centerX - mirrorWidth / 2 - 5, centerY - mirrorHeight / 2, 5, mirrorHeight)
      } else {
        // Solid color for all edges
        ctx.fillStyle = color

        // Top edge
        ctx.fillRect(centerX - mirrorWidth / 2, centerY - mirrorHeight / 2 - 5, mirrorWidth, 5)

        // Right edge
        ctx.fillRect(centerX + mirrorWidth / 2, centerY - mirrorHeight / 2, 5, mirrorHeight)

        // Bottom edge
        ctx.fillRect(centerX - mirrorWidth / 2, centerY + mirrorHeight / 2, mirrorWidth, 5)

        // Left edge
        ctx.fillRect(centerX - mirrorWidth / 2 - 5, centerY - mirrorHeight / 2, 5, mirrorHeight)
      }
    }

    // Draw mirror effect (simplified)
    const drawMirrorEffect = () => {
      // Draw receding squares to create depth illusion
      const maxDepth = 10
      for (let i = 0; i < maxDepth; i++) {
        const scale = 0.9 - i * 0.08
        const opacity = 1 - i * 0.1

        const w = mirrorWidth * scale
        const h = mirrorHeight * scale

        ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`
        ctx.fillRect(centerX - w / 2, centerY - h / 2, w, h)

        // Add LED dots at each level
        if (i > 0) {
          const dotSize = 3 - i * 0.2
          ctx.fillStyle = ledColor === "rainbow" ? `hsl(${(i * 36) % 360}, 100%, 50%, ${opacity})` : getLedColor()

          // Draw dots at corners
          ctx.beginPath()
          ctx.arc(centerX - w / 2, centerY - h / 2, dotSize, 0, Math.PI * 2)
          ctx.fill()

          ctx.beginPath()
          ctx.arc(centerX + w / 2, centerY - h / 2, dotSize, 0, Math.PI * 2)
          ctx.fill()

          ctx.beginPath()
          ctx.arc(centerX + w / 2, centerY + h / 2, dotSize, 0, Math.PI * 2)
          ctx.fill()

          ctx.beginPath()
          ctx.arc(centerX - w / 2, centerY + h / 2, dotSize, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

    drawMirrorEffect()
    drawLEDs()

    // Animation
    let animationId: number
    let frame = 0

    const animate = () => {
      frame++
      if (frame % 5 === 0) {
        // Update every 5 frames for performance
        drawMirrorEffect()
        drawLEDs()
      }
      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [width, height, depth, ledColor])

  return <canvas ref={canvasRef} width={400} height={400} className="rounded-lg border-2 border-gray-800" />
}
