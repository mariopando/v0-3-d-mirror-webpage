"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

interface InfinityMirrorProps {
  width: number
  height: number
  depth: number
  ledColor: string
}

export default function InfinityMirror({ width, height, depth, ledColor }: InfinityMirrorProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Convert dimensions from cm to 3D units (1 unit = 10cm)
  const widthUnits = width / 10
  const heightUnits = height / 10
  const depthUnits = depth / 10

  useEffect(() => {
    if (!containerRef.current) return

    // Clear previous content
    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild)
    }

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000000)

    // Camera setup
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000)
    camera.position.z = Math.max(widthUnits, heightUnits) * 1.2

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    })
    renderer.setSize(400, 400)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    containerRef.current.appendChild(renderer.domElement)

    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.enableZoom = false
    controls.enablePan = false
    controls.rotateSpeed = 0.5
    controls.autoRotate = true
    controls.autoRotateSpeed = 1

    // Create frame
    const frameThickness = 0.2
    const frameGeometry = new THREE.BoxGeometry(
      widthUnits + frameThickness * 2,
      heightUnits + frameThickness * 2,
      depthUnits,
    )
    const frameMaterial = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.8,
      metalness: 0.2,
    })
    const frame = new THREE.Mesh(frameGeometry, frameMaterial)
    scene.add(frame)

    // Create mirror surface (black background)
    const mirrorGeometry = new THREE.PlaneGeometry(widthUnits, heightUnits)
    const mirrorMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
    })
    const mirror = new THREE.Mesh(mirrorGeometry, mirrorMaterial)
    mirror.position.z = depthUnits / 2 + 0.001
    scene.add(mirror)

    // Create LED strips
    const numLeds = 20
    const ledSize = 0.05
    const leds: THREE.Mesh[] = []

    // Function to get color based on position and ledColor setting
    const getLedColor = (position: number) => {
      if (ledColor === "rainbow") {
        // Create rainbow gradient
        const hue = (position + 0.5) / 2
        return new THREE.Color().setHSL(hue, 1, 0.5)
      } else if (ledColor === "white") {
        return new THREE.Color(0xffffff)
      } else if (ledColor === "blue") {
        return new THREE.Color(0x0088ff)
      } else if (ledColor === "green") {
        return new THREE.Color(0x00ff88)
      } else if (ledColor === "purple") {
        return new THREE.Color(0x8800ff)
      } else {
        return new THREE.Color(0xff0088) // Pink default
      }
    }

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

    // Function to create an LED
    const createLed = (x: number, y: number, position: number) => {
      const ledGeometry = new THREE.BoxGeometry(ledSize, ledSize, 0.05)
      const ledMaterial = new THREE.MeshBasicMaterial({
        color: getLedColor(position),
        transparent: true,
        opacity: 1.0,
      })
      const led = new THREE.Mesh(ledGeometry, ledMaterial)
      led.position.set(x, y, depthUnits / 2 + 0.02)
      scene.add(led)
      leds.push(led)

      // Create the infinite effect for this LED
      createInfiniteEffect(x, y, position)
    }

    // Create the infinite mirror effect
    const createInfiniteEffect = (x: number, y: number, position: number) => {
      const maxDepth = 15
      const numPoints = 10

      for (let i = 0; i < numPoints; i++) {
        const depth = ((i + 1) / numPoints) * maxDepth
        const z = depthUnits / 2 - depth * 0.2

        // Scale coordinates slightly to create perspective
        const scale = 0.97 - i * 0.01
        const scaledX = x * scale
        const scaledY = y * scale

        const pointGeometry = new THREE.BoxGeometry(ledSize * 0.8, ledSize * 0.8, 0.02)
        const pointMaterial = new THREE.MeshBasicMaterial({
          color: getLedColor(position),
          transparent: true,
          opacity: 1 - (i / numPoints) * 0.7,
        })

        const point = new THREE.Mesh(pointGeometry, pointMaterial)
        point.position.set(scaledX, scaledY, z)
        scene.add(point)
        leds.push(point)
      }
    }

    // Create the LEDs
    createPerimeterLeds()

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040)
    scene.add(ambientLight)

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
    directionalLight.position.set(1, 1, 1)
    scene.add(directionalLight)

    // Animation loop
    const animate = () => {
      const animationId = requestAnimationFrame(animate)

      // Update controls
      controls.update()

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
      controls.dispose()
    }
  }, [width, height, depth, ledColor, widthUnits, heightUnits, depthUnits])

  return (
    <div className="relative">
      <div ref={containerRef} className="w-[400px] h-[400px] bg-black rounded-lg overflow-hidden shadow-2xl" />
      <div className="absolute inset-0 pointer-events-none rounded-lg shadow-[0_0_50px_rgba(255,0,255,0.3)]"></div>
    </div>
  )
}
