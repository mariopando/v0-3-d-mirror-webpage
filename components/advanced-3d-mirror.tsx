"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Camera, CuboidIcon as Cube } from "lucide-react"

export default function Advanced3DMirror() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const animationRef = useRef<number>()

  useEffect(() => {
    if (!isStreaming || !videoRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = 640
    canvas.height = 480

    // Animation function
    const animate = () => {
      if (!videoRef.current || !ctx) return

      // Draw video frame
      if (videoRef.current.readyState >= 2) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)

        // Apply mirror effect
        applyMirrorEffect(ctx, canvas.width, canvas.height)
      }

      // Continue animation
      animationRef.current = requestAnimationFrame(animate)
    }

    // Apply mirror effect to the canvas
    const applyMirrorEffect = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      // Create a copy of the current frame
      const imageData = ctx.getImageData(0, 0, width, height)
      const data = imageData.data

      // Apply a simple mirror effect (you can customize this)
      // This creates a simple kaleidoscope effect
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width / 2; x++) {
          const index = (y * width + x) * 4
          const mirrorIndex = (y * width + (width - x - 1)) * 4

          // Create a mirror effect by copying pixels
          data[mirrorIndex] = data[index] // R
          data[mirrorIndex + 1] = data[index + 1] // G
          data[mirrorIndex + 2] = data[index + 2] // B
        }
      }

      // Add a colored border effect
      const borderSize = 20
      const time = performance.now() * 0.001

      // Top and bottom borders
      for (let x = 0; x < width; x++) {
        for (let y = 0; y < borderSize; y++) {
          const hue = ((x / width) * 360 + time * 50) % 360
          const topIndex = (y * width + x) * 4
          const bottomIndex = ((height - y - 1) * width + x) * 4

          // Set border colors with rainbow effect
          setHSLColor(data, topIndex, hue, 100, 50)
          setHSLColor(data, bottomIndex, (hue + 180) % 360, 100, 50)
        }
      }

      // Left and right borders
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < borderSize; x++) {
          const hue = ((y / height) * 360 + time * 50) % 360
          const leftIndex = (y * width + x) * 4
          const rightIndex = (y * width + (width - x - 1)) * 4

          // Set border colors with rainbow effect
          setHSLColor(data, leftIndex, hue, 100, 50)
          setHSLColor(data, rightIndex, (hue + 180) % 360, 100, 50)
        }
      }

      // Put the modified image data back
      ctx.putImageData(imageData, 0, 0)
    }

    // Helper function to set HSL color in the image data
    const setHSLColor = (data: Uint8ClampedArray, index: number, h: number, s: number, l: number) => {
      // Convert HSL to RGB
      const c = ((1 - Math.abs((2 * l) / 100 - 1)) * s) / 100
      const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
      const m = l / 100 - c / 2

      let r, g, b

      if (h < 60) {
        ;[r, g, b] = [c, x, 0]
      } else if (h < 120) {
        ;[r, g, b] = [x, c, 0]
      } else if (h < 180) {
        ;[r, g, b] = [0, c, x]
      } else if (h < 240) {
        ;[r, g, b] = [0, x, c]
      } else if (h < 300) {
        ;[r, g, b] = [x, 0, c]
      } else {
        ;[r, g, b] = [c, 0, x]
      }

      data[index] = Math.round((r + m) * 255)
      data[index + 1] = Math.round((g + m) * 255)
      data[index + 2] = Math.round((b + m) * 255)
    }

    // Start animation
    animate()

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isStreaming])

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
        setIsStreaming(true)
      }
    } catch (err) {
      console.error("Error accessing webcam:", err)
    }
  }

  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
      setIsStreaming(false)

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }

  const toggleWebcam = () => {
    if (isStreaming) {
      stopWebcam()
    } else {
      startWebcam()
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div ref={containerRef} className="relative w-[640px] h-[480px] rounded-lg border-2 border-white overflow-hidden">
        <video ref={videoRef} className="hidden" width="640" height="480" />
        <canvas
          ref={canvasRef}
          className={`w-full h-full ${isStreaming ? "block" : "hidden"}`}
          width="640"
          height="480"
        />

        {!isStreaming && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <Cube className="w-16 h-16 text-white opacity-50" />
          </div>
        )}
      </div>

      <div className="mt-4">
        <Button
          onClick={toggleWebcam}
          className="flex items-center gap-2"
          variant={isStreaming ? "destructive" : "default"}
        >
          <Camera className="w-4 h-4" />
          {isStreaming ? "Stop 3D Mirror" : "Start 3D Mirror"}
        </Button>
      </div>
    </div>
  )
}
