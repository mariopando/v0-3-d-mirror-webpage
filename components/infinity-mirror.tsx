"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { Reflector } from "three/examples/jsm/objects/Reflector"

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
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
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
    const frameThickness = 0.5
    const frameGeometry = new THREE.BoxGeometry(
      widthUnits + frameThickness * 2,
      heightUnits + frameThickness * 2,
      depthUnits,
    )
    const frameMaterial = new THREE.MeshStandardMaterial({
      color: 0x111111,
      metalness: 0.8,
      roughness: 0.2,
    })
    const frame = new THREE.Mesh(frameGeometry, frameMaterial)
    scene.add(frame)

    // Create mirror surface using Reflector
    const mirrorGeometry = new THREE.PlaneGeometry(widthUnits, heightUnits)
    const mirror = new Reflector(mirrorGeometry, {
      clipBias: 0.003,
      textureWidth: 1024 * window.devicePixelRatio,
      textureHeight: 1024 * window.devicePixelRatio,
      color: 0x777777,
      recursion: 1,
    })
    mirror.position.z = depthUnits / 2 - 0.01
    scene.add(mirror)

    // Create back mirror for infinity effect
    const backMirror = new Reflector(mirrorGeometry, {
      clipBias: 0.003,
      textureWidth: 1024 * window.devicePixelRatio,
      textureHeight: 1024 * window.devicePixelRatio,
      color: 0x777777,
      recursion: 1,
    })
    backMirror.position.z = -depthUnits / 2 + 0.01
    backMirror.rotation.y = Math.PI
    scene.add(backMirror)

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

    // Create LED lights around the perimeter
    const ledSize = 0.05
    const leds: THREE.Mesh[] = []
    const ledLights: THREE.PointLight[] = []
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

    // Function to create an LED with emissive material and point light
    const createLed = (x: number, y: number, position: number) => {
      const ledGeometry = new THREE.SphereGeometry(ledSize, 16, 16)
      const color = getLedColor(position)

      // Use emissive material to create self-illuminating effect
      const ledMaterial = new THREE.MeshStandardMaterial({
        color: 0x000000, // Base color is black
        emissive: color, // The color that glows
        emissiveIntensity: 2, // How bright it glows
      })

      const led = new THREE.Mesh(ledGeometry, ledMaterial)
      led.position.set(x, y, depthUnits / 2 - 0.05)
      scene.add(led)
      leds.push(led)

      // Add point light for each LED to create the illumination effect
      const light = new THREE.PointLight(color, 0.5, depthUnits * 2)
      light.position.set(x, y, depthUnits / 2 - 0.1)
      scene.add(light)
      ledLights.push(light)
    }

    // Create the LEDs
    createPerimeterLeds()

    // Add ambient light for the entire scene
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5)
    scene.add(ambientLight)

    // Animation loop
    const animate = () => {
      const animationId = requestAnimationFrame(animate)

      // Update controls
      controls.update()

      // Animate LEDs with a wave pattern
      const time = performance.now() * 0.001
      leds.forEach((led, index) => {
        const material = led.material as THREE.MeshStandardMaterial
        if (material.emissiveIntensity !== undefined) {
          // Modulate the emissive intensity to create the pulsing effect
          const baseIntensity = 2
          const pulseAmount = 0.5
          material.emissiveIntensity = baseIntensity * (1 + pulseAmount * Math.sin(time * 2 + index * 0.1))

          // Also modulate the light intensity
          if (ledLights[index]) {
            ledLights[index].intensity = 0.5 * (1 + pulseAmount * Math.sin(time * 2 + index * 0.1))
          }
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
      controls.dispose()

      // Dispose geometries and materials
      leds.forEach((led) => {
        led.geometry.dispose()
        if (led.material instanceof THREE.Material) {
          led.material.dispose()
        } else if (Array.isArray(led.material)) {
          led.material.forEach((material) => material.dispose())
        }
      })

      frameGeometry.dispose()
      frameMaterial.dispose()
      mirrorGeometry.dispose()
    }
  }, [width, height, depth, ledColor, widthUnits, heightUnits, depthUnits])

  return (
    <div className="relative">
      <div ref={containerRef} className="w-[400px] h-[400px]"></div>
    </div>
  )
}
