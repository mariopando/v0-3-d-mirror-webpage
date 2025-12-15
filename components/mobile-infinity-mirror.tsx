"use client"

import React from "react"
import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
// @ts-expect-error - Three.js examples don't have TypeScript declarations
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

interface MobileInfinityMirrorProps {
  width: number
  height: number
  depth: number
  ledColor: string
  frameColor: string
  performanceScore: number // 0-100
}

const MobileInfinityMirror = React.memo(function MobileInfinityMirror({
  width,
  height,
  depth,
  ledColor,
  frameColor,
  performanceScore,
}: MobileInfinityMirrorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Determine optimization level based on performance score
  const getOptimizations = () => {
    if (performanceScore >= 70) {
      return {
        antialias: true,
        pixelRatio: Math.min(window.devicePixelRatio, 2),
        shadowMap: true,
        depthLayers: 12,
        numLeds: 10,
      }
    } else if (performanceScore >= 50) {
      return {
        antialias: false,
        pixelRatio: 1,
        shadowMap: false,
        depthLayers: 8,
        numLeds: 8,
      }
    } else {
      // Fallback for borderline devices
      return {
        antialias: false,
        pixelRatio: 1,
        shadowMap: false,
        depthLayers: 5,
        numLeds: 6,
      }
    }
  }

  useEffect(() => {
    if (!containerRef.current) return

    const optimizations = getOptimizations()

    // Clear container
    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild)
    }

    // Setup scene
    const scene = new THREE.Scene()
    scene.background = null

    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000)
    camera.position.set(5, 5, 5)

    // Mobile-optimized renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: optimizations.antialias,
      powerPreference: "high-performance",
      alpha: true,
    })
    renderer.setSize(300, 300)
    renderer.setPixelRatio(optimizations.pixelRatio)
    if (optimizations.shadowMap) {
      renderer.shadowMap.enabled = true
    }
    containerRef.current.appendChild(renderer.domElement)

    // Lighting - optimized for mobile
    const light = new THREE.DirectionalLight(0xffffff, 0.8)
    light.position.set(5, 5, 5)
    if (optimizations.shadowMap) {
      light.castShadow = true
    }
    scene.add(light)

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
    scene.add(ambientLight)

    // Frame color mapping
    const frameColorMap: { [key: string]: string } = {
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
    const frameColorHex = frameColorMap[frameColor] || "#1A1A1A"

    // Create frame
    const frameGeometry = new THREE.BoxGeometry(3, 3, 0.1)
    const frameMaterial = new THREE.MeshStandardMaterial({
      color: frameColorHex,
      metalness: 0.3,
      roughness: 0.4,
    })
    const frame = new THREE.Mesh(frameGeometry, frameMaterial)
    scene.add(frame)

    // Create mirror surface
    const mirrorGeometry = new THREE.PlaneGeometry(2.8, 2.8)
    const mirrorMaterial = new THREE.MeshStandardMaterial({
      color: 0x0a0a0a,
      metalness: 0.8,
      roughness: 0.1,
    })
    const mirror = new THREE.Mesh(mirrorGeometry, mirrorMaterial)
    mirror.position.z = 0.05
    scene.add(mirror)

    // LED color mapping
    const getLedColor = (position: number): THREE.Color => {
      if (ledColor === "rainbow") {
        const hue = ((position * 360) % 360) / 360
        return new THREE.Color().setHSL(hue, 1, 0.5)
      }

      const colorMap: { [key: string]: string } = {
        white: "#ffffff",
        blue: "#0088ff",
        green: "#00ff88",
        purple: "#8800ff",
        pink: "#ff0088",
      }
      return new THREE.Color(colorMap[ledColor] || "#ffffff")
    }

    // Create LEDs with depth effect
    const numLeds = optimizations.numLeds
    const ledPositions = []

    // Top edge
    for (let i = 0; i < numLeds; i++) {
      const x = -1.4 + (2.8 * i) / (numLeds - 1 || 1)
      const y = 1.4
      ledPositions.push({ x, y, position: i / numLeds })
    }

    // Right edge
    for (let i = 0; i < numLeds; i++) {
      const x = 1.4
      const y = 1.4 - (2.8 * i) / (numLeds - 1 || 1)
      ledPositions.push({ x, y, position: (i + numLeds) / (numLeds * 4) })
    }

    // Bottom edge
    for (let i = 0; i < numLeds; i++) {
      const x = 1.4 - (2.8 * i) / (numLeds - 1 || 1)
      const y = -1.4
      ledPositions.push({ x, y, position: (i + numLeds * 2) / (numLeds * 4) })
    }

    // Left edge
    for (let i = 0; i < numLeds; i++) {
      const x = -1.4
      const y = -1.4 + (2.8 * i) / (numLeds - 1 || 1)
      ledPositions.push({ x, y, position: (i + numLeds * 3) / (numLeds * 4) })
    }

    // Create LED geometry and lights
    const ledSize = 0.12
    const maxDepth = optimizations.depthLayers

    for (const ledPos of ledPositions) {
      const color = getLedColor(ledPos.position)

      // Add point light for glow
      const pointLight = new THREE.PointLight(color, 0.4, 5)
      pointLight.position.set(ledPos.x, ledPos.y, 0.5)
      scene.add(pointLight)

      // Create depth effect meshes
      for (let d = 0; d < 3; d++) {
        const depthScale = 0.85 - d * 0.1
        const scaledX = ledPos.x * depthScale
        const scaledY = ledPos.y * depthScale

        const ledGeometry = new THREE.BoxGeometry(ledSize, ledSize, 0.05)
        const ledMaterial = new THREE.MeshStandardMaterial({
          color: color,
          emissive: color,
          emissiveIntensity: 0.5,
          metalness: 0.8,
          roughness: 0.2,
        })
        const led = new THREE.Mesh(ledGeometry, ledMaterial)
        led.position.set(scaledX, scaledY, 0.1 + d * 0.1)
        scene.add(led)
      }
    }

    // Create infinity layers
    const layerGeometry = new THREE.BoxGeometry(2.8, 2.8, 0.02)
    for (let i = 1; i < maxDepth; i++) {
      const scale = 0.95 - i * 0.05
      const opacity = Math.max(0.1, 1 - (i / maxDepth) * 0.9)

      const layerMaterial = new THREE.MeshStandardMaterial({
        color: 0x0a0a0a,
        metalness: 0.6,
        roughness: 0.3,
        transparent: true,
        opacity: opacity * 0.6,
      })
      const layer = new THREE.Mesh(layerGeometry, layerMaterial)
      layer.scale.set(scale, scale, 1)
      layer.position.z = -(i * 0.3)
      scene.add(layer)
    }

    // Add OrbitControls with mobile constraints
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.rotateSpeed = 0.5
    controls.autoRotate = true
    controls.autoRotateSpeed = 1
    controls.minDistance = 4
    controls.maxDistance = 12
    controls.enablePan = false
    controls.enableZoom = true
    controls.update()

    // Animation loop
    let animationId: number
    const animate = () => {
      animationId = requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // Schedule loading state update after render
    setTimeout(() => {
      setIsLoading(false)
    }, 0)

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId)
      renderer.dispose()
      layerGeometry.dispose()
      frameGeometry.dispose()
      mirrorGeometry.dispose()
    }
  }, [width, height, depth, ledColor, frameColor, performanceScore])

  return (
    <div ref={containerRef} className="flex justify-center">
      {isLoading && <div className="text-muted-foreground">Cargando...</div>}
    </div>
  )
})

export default MobileInfinityMirror
