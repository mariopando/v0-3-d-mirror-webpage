"use client"

import React from "react"
import { useEffect, useRef } from "react"

interface CanvasMirrorProps {
  width: number
  height: number
  depth: number
  ledColor: string
}

const CanvasMirror = React.memo(function CanvasMirror({ width, height, depth, ledColor }: CanvasMirrorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = 400
    canvas.height = 400

    // Calculate dimensions
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const mirrorWidth = Math.min(300, width * 2)
    const mirrorHeight = Math.min(300, height * 2)
    const maxDepth = Math.max(5, Math.min(15, depth))

    // Function to get color based on ledColor setting
    const getLedColor = (position: number) => {
      if (ledColor === "rainbow") {
        // Create rainbow gradient
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
      // Outer frame
      ctx.fillStyle = "#222"
      ctx.fillRect(centerX - mirrorWidth / 2 - 10, centerY - mirrorHeight / 2 - 10, mirrorWidth + 20, mirrorHeight + 20)

      // Inner frame - reflective surface
      ctx.fillStyle = "#111"
      ctx.fillRect(centerX - mirrorWidth / 2, centerY - mirrorHeight / 2, mirrorWidth, mirrorHeight)
    }

    // Draw LED lights
    const drawLeds = (time: number) => {
      const numLeds = 40 // Number of LEDs around the perimeter
      const ledSize = 4

      // Draw LEDs around the perimeter
      for (let i = 0; i < numLeds; i++) {
        const position = i / numLeds
        const angle = position * Math.PI * 2

        // Calculate position on the perimeter
        let x, y

        if (angle < Math.PI / 2) {
          // Top edge to right corner
          x = centerX - mirrorWidth / 2 + position * 4 * mirrorWidth
          y = centerY - mirrorHeight / 2
        } else if (angle < Math.PI) {
          // Right edge to bottom corner
          x = centerX + mirrorWidth / 2
          y = centerY - mirrorHeight / 2 + (position - 0.25) * 4 * mirrorHeight
        } else if (angle < (Math.PI * 3) / 2) {
          // Bottom edge to left corner
          x = centerX + mirrorWidth / 2 - (position - 0.5) * 4 * mirrorWidth
          y = centerY + mirrorHeight / 2
        } else {
          // Left edge to top corner
          x = centerX - mirrorWidth / 2
          y = centerY + mirrorHeight / 2 - (position - 0.75) * 4 * mirrorHeight
        }

        // Get color based on position and add pulsing effect
        const color = getLedColor(position)
        const pulse = 0.7 + 0.3 * Math.sin(time * 2 + position * 10)

        // Draw the LED
        ctx.beginPath()
        ctx.arc(x, y, ledSize, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.globalAlpha = pulse
        ctx.fill()

        // Add glow effect
        const gradient = ctx.createRadialGradient(x, y, ledSize, x, y, ledSize * 4)
        gradient.addColorStop(0, color)
        gradient.addColorStop(1, "rgba(0,0,0,0)")
        ctx.fillStyle = gradient
        ctx.globalAlpha = pulse * 0.3
        ctx.beginPath()
        ctx.arc(x, y, ledSize * 4, 0, Math.PI * 2)
        ctx.fill()

        ctx.globalAlpha = 1.0
      }
    }

    // Draw the infinite mirror effect
    const drawInfiniteEffect = (time: number) => {
      // Draw receding rectangles to create depth illusion
      for (let i = 1; i <= maxDepth; i++) {
        const scale = Math.pow(0.85, i)
        const w = mirrorWidth * scale
        const h = mirrorHeight * scale

        // Calculate opacity based on depth
        const opacity = Math.max(0.1, 1 - (i / maxDepth) * 0.9)

        // Draw the receding rectangle
        ctx.fillStyle = "#111"
        ctx.globalAlpha = opacity
        ctx.fillRect(centerX - w / 2, centerY - h / 2, w, h)
        ctx.globalAlpha = 1.0

        // Add LED dots at each level
        const numDotsPerSide = Math.max(2, Math.floor(8 * scale))
        const dotSize = Math.max(1, 3 * scale)

        for (let j = 0; j < numDotsPerSide; j++) {
          const position = j / numDotsPerSide
          const pulse = 0.7 + 0.3 * Math.sin(time * 2 + position * 10 + i)

          // Calculate positions along each edge
          const xPos = centerX - w / 2 + position * w
          const yPos = centerY - h / 2 + position * h

          // Top edge
          ctx.beginPath()
          ctx.arc(xPos, centerY - h / 2, dotSize, 0, Math.PI * 2)
          ctx.fillStyle = getLedColor(position)
          ctx.globalAlpha = opacity * pulse
          ctx.fill()

          // Right edge
          ctx.beginPath()
          ctx.arc(centerX + w / 2, yPos, dotSize, 0, Math.PI * 2)
          ctx.fillStyle = getLedColor((position + 0.25) % 1)
          ctx.fill()

          // Bottom edge
          ctx.beginPath()
          ctx.arc(xPos, centerY + h / 2, dotSize, 0, Math.PI * 2)
          ctx.fillStyle = getLedColor((position + 0.5) % 1)
          ctx.fill()

          // Left edge
          ctx.beginPath()
          ctx.arc(centerX - w / 2, yPos, dotSize, 0, Math.PI * 2)
          ctx.fillStyle = getLedColor((position + 0.75) % 1)
          ctx.fill()

          ctx.globalAlpha = 1.0
        }
      }
    }

    // Animation loop
    const animate = () => {
      const time = performance.now() * 0.001

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

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
  }, [width, height, depth, ledColor])

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={400}
      className="rounded-lg border-2 border-gray-800"
      style={{ background: "#000" }}
    />
  )
})

export default CanvasMirror
