"use client"

import React from "react"
import { useEffect, useRef } from "react"

interface CanvasMirrorProps {
  width: number
  height: number
  depth: number
  ledColor: string
  frameColor?: string
}

const CanvasMirror = React.memo(function CanvasMirror({ 
  width, 
  height, 
  depth, 
  ledColor,
  frameColor = "negro"
}: CanvasMirrorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: false })
    if (!ctx) return

    // Set canvas dimensions with DPI scaling for crisp rendering
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const displayWidth = rect.width
    const displayHeight = rect.height

    // Calculate dimensions
    const centerX = displayWidth / 2
    const centerY = displayHeight / 2
    const mirrorWidth = Math.min(displayWidth * 0.75, width * 2)
    const mirrorHeight = Math.min(displayHeight * 0.75, height * 2)
    const maxDepth = Math.max(5, Math.min(15, depth))

    // Get frame color
    const getFrameColor = (colorName: string): string => {
      const colorMap: { [key: string]: string } = {
        "madera-natural": "#8B6F47",
        "martillado-azul": "#2C3E50",
        "martillado-verde": "#27AE60",
        "martillado-cobre": "#B7410E",
        "madera-barnices": "#CD853F",
        "nogal": "#654321",
        "caoba": "#8B4513",
        "blanco": "#F5F5F5",
        "negro": "#1A1A1A",
        "rojo": "#DC143C",
        "azul": "#0047AB",
        "verde": "#228B22",
        "amarillo": "#FFD700",
        "aluminio": "#C0C0C0",
      }
      return colorMap[colorName] || "#1A1A1A"
    }

    // Function to get LED color based on ledColor setting
    const getLedColor = (position: number): string => {
      if (ledColor === "rainbow") {
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
        return "#ff0088" // Pink default
      }
    }

    // Draw the mirror frame
    const drawFrame = () => {
      const frameColorValue = getFrameColor(frameColor)
      
      // Outer frame with depth
      ctx.fillStyle = frameColorValue
      ctx.fillRect(
        centerX - mirrorWidth / 2 - 12, 
        centerY - mirrorHeight / 2 - 12, 
        mirrorWidth + 24, 
        mirrorHeight + 24
      )

      // Inner reflective surface (dark mirror)
      ctx.fillStyle = "#0A0A0A"
      ctx.fillRect(
        centerX - mirrorWidth / 2, 
        centerY - mirrorHeight / 2, 
        mirrorWidth, 
        mirrorHeight
      )

      // Subtle frame shine effect
      ctx.strokeStyle = `rgba(255, 255, 255, 0.1)`
      ctx.lineWidth = 1
      ctx.strokeRect(
        centerX - mirrorWidth / 2 - 12, 
        centerY - mirrorHeight / 2 - 12, 
        mirrorWidth + 24, 
        mirrorHeight + 24
      )
    }

    // Draw LED lights
    const drawLeds = (time: number) => {
      const numLeds = 48 // Increased for better appearance
      const ledSize = 3.5

      // Draw LEDs around the perimeter
      for (let i = 0; i < numLeds; i++) {
        const position = i / numLeds
        const angle = position * Math.PI * 2

        // Calculate position on the perimeter
        let x, y

        const perimeter = (mirrorWidth + mirrorHeight) * 2
        const ledSpacing = perimeter / numLeds
        let currentPos = 0

        if (currentPos < mirrorWidth) {
          x = centerX - mirrorWidth / 2 + position * 4 * mirrorWidth
          y = centerY - mirrorHeight / 2
        } else if (currentPos < mirrorWidth + mirrorHeight) {
          x = centerX + mirrorWidth / 2
          y = centerY - mirrorHeight / 2 + ((position - 0.25) * 4 * mirrorHeight)
        } else if (currentPos < mirrorWidth * 2 + mirrorHeight) {
          x = centerX + mirrorWidth / 2 - ((position - 0.5) * 4 * mirrorWidth)
          y = centerY + mirrorHeight / 2
        } else {
          x = centerX - mirrorWidth / 2
          y = centerY + mirrorHeight / 2 - ((position - 0.75) * 4 * mirrorHeight)
        }

        // Get color and add pulsing effect
        const color = getLedColor(position)
        const pulse = 0.6 + 0.4 * Math.sin(time * 2 + position * 10)

        // Draw the LED core
        ctx.beginPath()
        ctx.arc(x, y, ledSize, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.globalAlpha = pulse
        ctx.fill()

        // Add glow effect
        const gradient = ctx.createRadialGradient(x, y, ledSize, x, y, ledSize * 5)
        gradient.addColorStop(0, color)
        gradient.addColorStop(1, "rgba(0,0,0,0)")
        ctx.fillStyle = gradient
        ctx.globalAlpha = pulse * 0.4
        ctx.beginPath()
        ctx.arc(x, y, ledSize * 5, 0, Math.PI * 2)
        ctx.fill()

        ctx.globalAlpha = 1.0
      }
    }

    // Draw the infinite mirror effect with proper depth
    const drawInfiniteEffect = (time: number) => {
      // Draw receding rectangles to create depth illusion
      for (let i = 1; i <= maxDepth; i++) {
        const scale = Math.pow(0.88, i)  // Slightly improved scaling
        const w = mirrorWidth * scale
        const h = mirrorHeight * scale

        // Calculate opacity based on depth with fade effect
        const opacity = Math.max(0.08, 1 - (i / maxDepth) * 0.92)

        // Draw the receding rectangle with darker color
        ctx.fillStyle = "#080808"
        ctx.globalAlpha = opacity * 0.7
        ctx.fillRect(centerX - w / 2, centerY - h / 2, w, h)
        
        // Add subtle border to create definition
        ctx.strokeStyle = "#1A1A1A"
        ctx.lineWidth = 1
        ctx.globalAlpha = opacity * 0.3
        ctx.strokeRect(centerX - w / 2, centerY - h / 2, w, h)
        
        ctx.globalAlpha = 1.0

        // Add LED dots at each level (fewer for better performance)
        const numDotsPerSide = Math.max(2, Math.floor(6 * scale))
        const dotSize = Math.max(1, 2 * scale)

        for (let j = 0; j < numDotsPerSide; j++) {
          const position = j / numDotsPerSide
          const pulse = 0.6 + 0.4 * Math.sin(time * 2 + position * 10 + i)

          // Calculate positions along each edge
          const xPos = centerX - w / 2 + position * w
          const yPos = centerY - h / 2 + position * h

          const ledColor = getLedColor(position)

          // Top edge
          ctx.beginPath()
          ctx.arc(xPos, centerY - h / 2, dotSize, 0, Math.PI * 2)
          ctx.fillStyle = ledColor
          ctx.globalAlpha = opacity * pulse * 0.7
          ctx.fill()

          // Right edge
          ctx.beginPath()
          ctx.arc(centerX + w / 2, yPos, dotSize, 0, Math.PI * 2)
          ctx.fillStyle = getLedColor((position + 0.25) % 1)
          ctx.globalAlpha = opacity * pulse * 0.7
          ctx.fill()

          // Bottom edge
          ctx.beginPath()
          ctx.arc(xPos, centerY + h / 2, dotSize, 0, Math.PI * 2)
          ctx.fillStyle = getLedColor((position + 0.5) % 1)
          ctx.globalAlpha = opacity * pulse * 0.7
          ctx.fill()

          // Left edge
          ctx.beginPath()
          ctx.arc(centerX - w / 2, yPos, dotSize, 0, Math.PI * 2)
          ctx.fillStyle = getLedColor((position + 0.75) % 1)
          ctx.globalAlpha = opacity * pulse * 0.7
          ctx.fill()

          ctx.globalAlpha = 1.0
        }
      }
    }

    // Animation loop
    const animate = () => {
      const time = performance.now() * 0.001

      // Clear canvas with background color
      ctx.fillStyle = "#000000"
      ctx.fillRect(0, 0, displayWidth, displayHeight)

      // Draw the mirror components
      drawFrame()
      drawInfiniteEffect(time)
      drawLeds(time)

      // Continue animation
      animationRef.current = requestAnimationFrame(animate)
    }

    // Start animation
    animate()

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [width, height, depth, ledColor, frameColor])

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={400}
      className="rounded-lg border-2 border-gray-800 w-full max-w-sm mx-auto"
      style={{ 
        background: "#000",
        display: "block",
        aspectRatio: "1 / 1"
      }}
    />
  )
})

export default CanvasMirror
