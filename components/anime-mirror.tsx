"use client"

import React from "react"
import { useEffect, useRef } from "react"

// @ts-ignore - animejs doesn't have type definitions
import anime from "animejs"

interface AnimeMirrorProps {
  width: number
  height: number
  depth: number
  ledColor: string
  frameColor?: string
}

const AnimeMirror = React.memo(function AnimeMirror({
  width,
  height,
  depth,
  ledColor,
  frameColor = "negro",
}: AnimeMirrorProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Clear previous content
    containerRef.current.innerHTML = ""

    // Canvas size
    const canvasSize = 400
    const padding = 40
    const mirrorWidth = canvasSize - padding * 2
    const mirrorHeight = canvasSize - padding * 2

    // Get frame color
    const getFrameColor = (): string => {
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
      return colorMap[frameColor] || "#1A1A1A"
    }

    // Get LED color - matches desktop Three.js version
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
        return "#ff0088" // Pink
      }
    }

    // Create Canvas
    const canvas = document.createElement("canvas")
    canvas.width = canvasSize
    canvas.height = canvasSize
    canvas.className = "rounded-lg border-2 border-gray-800 w-full max-w-sm mx-auto"
    canvas.style.display = "block"
    canvas.style.aspectRatio = "1 / 1"
    canvas.style.backgroundColor = "#000000"

    containerRef.current.appendChild(canvas)
    const ctx = canvas.getContext("2d")!

    const centerX = canvasSize / 2
    const centerY = canvasSize / 2
    const displayMirrorWidth = Math.min(mirrorWidth, mirrorHeight)
    const displayMirrorHeight = Math.min(mirrorWidth, mirrorHeight)
    const frameColorValue = getFrameColor()

    // Animation state
    let animationId: number
    let time = 0

    const drawMirror = () => {
      time += 0.016

      // Clear canvas
      ctx.fillStyle = "#000000"
      ctx.fillRect(0, 0, canvasSize, canvasSize)

      // Draw prominent outer frame (photo frame effect)
      const frameThickness = 15
      const frameX = centerX - displayMirrorWidth / 2 - frameThickness
      const frameY = centerY - displayMirrorHeight / 2 - frameThickness
      const frameW = displayMirrorWidth + frameThickness * 2
      const frameH = displayMirrorHeight + frameThickness * 2

      // Outer frame border
      ctx.fillStyle = frameColorValue
      ctx.fillRect(frameX, frameY, frameW, frameH)

      // Inner dark area (creates the frame thickness)
      ctx.fillStyle = "#000000"
      ctx.fillRect(frameX + frameThickness, frameY + frameThickness, frameW - frameThickness * 2, frameH - frameThickness * 2)

      // Highlight on frame edges for 3D effect
      ctx.strokeStyle = frameColorValue
      ctx.globalAlpha = 0.5
      ctx.lineWidth = 2
      ctx.strokeRect(frameX + frameThickness - 2, frameY + frameThickness - 2, frameW - frameThickness * 2 + 4, frameH - frameThickness * 2 + 4)

      ctx.globalAlpha = 1

      // Draw infinite mirror layers (matching Three.js depth structure)
      const maxDepth = 15
      const numPoints = 8

      for (let i = 0; i < maxDepth; i++) {
        const scale = Math.pow(0.97, i)
        const w = displayMirrorWidth * scale
        const h = displayMirrorHeight * scale
        const x = centerX - w / 2
        const y = centerY - h / 2
        const opacity = Math.max(0.02, 1 - (i / maxDepth) * 0.98)

        // Draw frame
        ctx.strokeStyle = frameColorValue
        ctx.globalAlpha = opacity * 0.4
        ctx.lineWidth = 2 * scale
        ctx.strokeRect(x, y, w, h)

        // Draw mirror surface
        const pulseAmount = 0.1 * Math.sin(time * 1.5 + i * 0.3)
        ctx.fillStyle = "#0A0A0A"
        ctx.globalAlpha = (opacity * 0.8) + pulseAmount * 0.2
        ctx.fillRect(x, y, w, h)
      }

      // Draw LEDs positioned around perimeter (matching Three.js structure)
      const numLeds = 10

      // Store LED positions for depth effect
      const ledPositions = []

      // Top edge
      for (let i = 0; i < numLeds; i++) {
        const x = centerX - displayMirrorWidth / 2 + (displayMirrorWidth * i) / (numLeds - 1 || 1)
        const y = centerY - displayMirrorHeight / 2
        ledPositions.push({ x, y, position: i / numLeds })
      }

      // Right edge
      for (let i = 0; i < numLeds; i++) {
        const x = centerX + displayMirrorWidth / 2
        const y = centerY - displayMirrorHeight / 2 + (displayMirrorHeight * i) / (numLeds - 1 || 1)
        ledPositions.push({ x, y, position: (i + numLeds) / (numLeds * 4) })
      }

      // Bottom edge
      for (let i = 0; i < numLeds; i++) {
        const x = centerX + displayMirrorWidth / 2 - (displayMirrorWidth * i) / (numLeds - 1 || 1)
        const y = centerY + displayMirrorHeight / 2
        ledPositions.push({ x, y, position: (i + numLeds * 2) / (numLeds * 4) })
      }

      // Left edge
      for (let i = 0; i < numLeds; i++) {
        const x = centerX - displayMirrorWidth / 2
        const y = centerY + displayMirrorHeight / 2 - (displayMirrorHeight * i) / (numLeds - 1 || 1)
        ledPositions.push({ x, y, position: (i + numLeds * 3) / (numLeds * 4) })
      }

      // Draw each LED and its depth effect
      for (const ledPos of ledPositions) {
        const color = getLedColor(ledPos.position)

        // Draw depth points (infinity effect) - matching Three.js createInfiniteEffect
        for (let d = 0; d < numPoints; d++) {
          const depthScale = 0.97 - d * 0.01
          const scaledX = centerX + (ledPos.x - centerX) * depthScale
          const scaledY = centerY + (ledPos.y - centerY) * depthScale
          const ledSize = 4 * (1 - (d / numPoints) * 0.7)
          const depthOpacity = (1 - (d / numPoints) * 0.7) * 0.8

          // Pulsing animation
          const pulse = 0.5 + 0.5 * Math.sin(time * 2.5 + ledPos.position * 10)
          ctx.fillStyle = color
          ctx.globalAlpha = depthOpacity * pulse * 0.8
          ctx.beginPath()
          ctx.arc(scaledX, scaledY, ledSize, 0, Math.PI * 2)
          ctx.fill()

          // Glow
          ctx.strokeStyle = color
          ctx.lineWidth = 1
          ctx.globalAlpha = depthOpacity * pulse * 0.4
          ctx.beginPath()
          ctx.arc(scaledX, scaledY, ledSize + 2, 0, Math.PI * 2)
          ctx.stroke()
        }
      }

      ctx.globalAlpha = 1

      // Continue animation loop
      animationId = requestAnimationFrame(drawMirror)
    }

    // Start animation loop
    drawMirror()

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [width, height, depth, ledColor, frameColor])

  return <div ref={containerRef} />
})

export default AnimeMirror
