"use client"

import { useEffect, useRef, useState } from "react"

// Define types for global THREE
declare global {
  interface Window {
    THREE: any
  }
}

interface InfinityMirrorProps {
  width: number
  height: number
  depth: number
  ledColor: string
}

export default function InfinityMirror({ width, height, depth, ledColor }: InfinityMirrorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isThreeLoaded, setIsThreeLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Convert dimensions from cm to 3D units (1 unit = 10cm)
  const widthUnits = width / 10
  const heightUnits = height / 10
  const depthUnits = depth / 10

  // Check if Three.js is loaded
  useEffect(() => {
    const checkThreeLoaded = () => {
      if (typeof window !== "undefined" && window.THREE) {
        setIsThreeLoaded(true)
        setIsLoading(false)
      } else {
        // If not loaded yet, check again in 100ms
        setTimeout(checkThreeLoaded, 100)
      }
    }

    checkThreeLoaded()

    return () => {
      // Cleanup
    }
  }, [])

  useEffect(() => {
    if (!isThreeLoaded || !containerRef.current) return

    // Clear previous content
    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild)
    }

    try {
      // Scene setup
      const scene = new window.THREE.Scene()
      scene.background = new window.THREE.Color(0x000000)

      // Camera setup
      const camera = new window.THREE.PerspectiveCamera(60, 1, 0.1, 1000)
      camera.position.z = Math.max(widthUnits, heightUnits) * 1.2

      // Renderer setup
      const renderer = new window.THREE.WebGLRenderer({
        antialias: true,
        powerPreference: "high-performance",
      })
      renderer.setSize(400, 400)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      containerRef.current.appendChild(renderer.domElement)

      // Controls setup - check if OrbitControls is available
      let controls
      if (window.THREE.OrbitControls) {
        controls = new window.THREE.OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true
        controls.dampingFactor = 0.05
        controls.enableZoom = false
        controls.enablePan = false
        controls.rotateSpeed = 0.5
        controls.autoRotate = true
        controls.autoRotateSpeed = 1
      } else {
        console.warn("OrbitControls not loaded, using basic camera")
      }

      // Create frame
      const frameThickness = 0.5
      const frameGeometry = new window.THREE.BoxGeometry(
        widthUnits + frameThickness * 2,
        heightUnits + frameThickness * 2,
        depthUnits,
      )
      const frameMaterial = new window.THREE.MeshStandardMaterial({
        transmission: 0.9,
        opacity: 0.3,
        reflectivity: 0.7,
        ior: 1.5,
        envMapIntensity: 0.9,
        roughness: 0.1,
        metalness: 1,
        clearcoat: 1,
        transparent: true,
      })
      const frame = new window.THREE.Mesh(frameGeometry, frameMaterial)
      scene.add(frame)

      // Function to get color based on position and ledColor setting
      const getLedColor = (position: number) => {
        if (ledColor === "rainbow") {
          // Create rainbow gradient
          const hue = (position + 0.5) / 2
          return new window.THREE.Color().setHSL(hue, 1, 0.5)
        } else if (ledColor === "white") {
          return new window.THREE.Color(0xffffff)
        } else if (ledColor === "blue") {
          return new window.THREE.Color(0x0088ff)
        } else if (ledColor === "green") {
          return new window.THREE.Color(0x00ff88)
        } else if (ledColor === "purple") {
          return new window.THREE.Color(0x8800ff)
        } else {
          return new window.THREE.Color(0xff0088) // Pink default
        }
      }

      const ledSize = 0.05
      const leds: any[] = []
      const numLeds = 20

      // Create LED strips around the perimeter
      const createPerimeterLeds = () => {
        // Top edge
        for (let i = 0; i < numLeds; i++) {
          const x = -widthUnits / 2 + (widthUnits * i) / (numLeds - 1)
          const y = heightUnits / 2
          const position = i / (numLeds - 1)
          createLed(x, y, position)
        }

        // Right edge
        for (let i = 0; i < numLeds; i++) {
          const x = widthUnits / 2
          const y = heightUnits / 2 - (heightUnits * i) / (numLeds - 1)
          const position = (i + numLeds) / (numLeds * 4 - 4)
          createLed(x, y, position)
        }

        // Bottom edge
        for (let i = 0; i < numLeds; i++) {
          const x = widthUnits / 2 - (widthUnits * i) / (numLeds - 1)
          const y = -heightUnits / 2
          const position = (i + numLeds * 2) / (numLeds * 4 - 4)
          createLed(x, y, position)
        }

        // Left edge
        for (let i = 0; i < numLeds; i++) {
          const x = -widthUnits / 2
          const y = -heightUnits / 2 + (heightUnits * i) / (numLeds - 1)
          const position = (i + numLeds * 3) / (numLeds * 4 - 4)
          createLed(x, y, position)
        }
      }

      // Function to create an LED with emissive material instead of a point light
      const createLed = (x: number, y: number, position: number) => {
        const ledGeometry = new window.THREE.BoxGeometry(ledSize, ledSize, 0.05)
        const color = getLedColor(position)

        // Use emissive material to create self-illuminating effect without actual lights
        const ledMaterial = new window.THREE.MeshStandardMaterial({
          color: 0x000000, // Base color is black
          emissive: color, // The color that glows
          emissiveIntensity: 2, // How bright it glows
          transparent: true,
          opacity: 1.0,
        })

        const led = new window.THREE.Mesh(ledGeometry, ledMaterial)
        led.position.set(x, y, depthUnits / 2 + 0.02)
        scene.add(led)
        leds.push(led)

        // Create the infinite effect for this LED
        createInfiniteEffect(x, y, position)
      }

      // Create the infinite mirror effect with emissive materials
      const createInfiniteEffect = (x: number, y: number, position: number) => {
        // OPTIMIZATION: Reduce the number of points for better performance
        const maxDepth = 15
        const numPoints = 8 // Reduced from 10

        for (let i = 0; i < numPoints; i++) {
          const depth = ((i + 1) / numPoints) * maxDepth
          const z = depthUnits / 2 - depth * 0.2

          // Scale coordinates slightly to create perspective
          const scale = 0.97 - i * 0.01
          const scaledX = x * scale
          const scaledY = y * scale

          const pointGeometry = new window.THREE.BoxGeometry(ledSize * 0.8, ledSize * 0.8, 0.02)
          const color = getLedColor(position)

          // Use emissive material for the receding points too
          const pointMaterial = new window.THREE.MeshStandardMaterial({
            color: 0x000000,
            emissive: color,
            emissiveIntensity: 1.5 * (1 - (i / numPoints) * 0.7),
            transparent: true,
            opacity: 1 - (i / numPoints) * 0.7,
          })

          const point = new window.THREE.Mesh(pointGeometry, pointMaterial)
          point.position.set(scaledX, scaledY, z)
          scene.add(point)
          leds.push(point)
        }
      }

      // Create the LEDs
      createPerimeterLeds()

      // OPTIMIZATION: Use just one ambient light for the entire scene
      const ambientLight = new window.THREE.AmbientLight(0x404040)
      scene.add(ambientLight)

      // OPTIMIZATION: Use just one directional light for the frame
      const directionalLight = new window.THREE.DirectionalLight(0xffffff, 0.5)
      directionalLight.position.set(1, 1, 1)
      scene.add(directionalLight)

      // Animation loop
      const animate = () => {
        const animationId = requestAnimationFrame(animate)

        // Update controls if available
        if (controls) {
          controls.update()
        } else {
          // Simple rotation if no controls
          frame.rotation.y += 0.005
        }

        // Animate LEDs with a wave pattern
        const time = performance.now() * 0.001
        leds.forEach((led, index) => {
          const material = led.material
          if (material.emissiveIntensity !== undefined) {
            // Modulate the emissive intensity to create the pulsing effect
            const baseIntensity = index < numLeds * 4 ? 2 : 1.5 * (1 - (Math.floor(index / (numLeds * 4)) / 8) * 0.7)
            const pulseAmount = index < numLeds * 4 ? 0.5 : 0.3
            material.emissiveIntensity = baseIntensity * (1 + pulseAmount * Math.sin(time * 2 + index * 0.1))
          }
        })

        // Render scene
        renderer.render(scene, camera)

        // Store animation ID for cleanup
        return animationId
      }

      const animationId = animate()

      // Cleanup
      return () => {
        cancelAnimationFrame(animationId)
        renderer.dispose()
        if (controls) {
          controls.dispose()
        }
      }
    } catch (error) {
      console.error("Error initializing Three.js:", error)
      setIsLoading(false)
    }
  }, [width, height, depth, ledColor, widthUnits, heightUnits, depthUnits, isThreeLoaded])

  // Render loading state or fallback if Three.js isn't available
  if (isLoading) {
    return (
      <div className="relative">
        <div ref={containerRef} className="w-[400px] h-[400px] bg-gray-900 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mb-4"></div>
            <p className="text-white">Cargando visualización 3D...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!isThreeLoaded) {
    return (
      <div className="relative">
        <div className="w-[400px] h-[400px] bg-gray-900 rounded-lg flex items-center justify-center">
          <div className="text-center p-4">
            <p className="text-white mb-2">No se pudo cargar la visualización 3D</p>
            <p className="text-gray-400 text-sm">Por favor, intente con un navegador más reciente</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <div ref={containerRef} className="w-[400px] h-[400px]"></div>
    </div>
  )
}
