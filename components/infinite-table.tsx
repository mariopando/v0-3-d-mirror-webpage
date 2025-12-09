"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { useTheme } from "next-themes"

interface InfiniteTableProps {
  width: number
  height: number
  depth: number
  ledColor: string
  frameColor: string
  fov: number
  aspect: number
  near: number
  far: number
}

export default function InfiniteTable({
  width,
  height,
  depth,
  ledColor,
  frameColor,
  fov,
  aspect,
  near,
  far,
}: InfiniteTableProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const [showIcon, setShowIcon] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)

  const { theme } = useTheme()

  const handleCanvasInteraction = () => {
    setFadeOut(true)
    setTimeout(() => setShowIcon(false), 600)
  }

  const validateDimension = (value: number, fallback: number = 1) => {
    return isNaN(value) || value <= 0 ? fallback : value
  }

  const widthUnits = validateDimension(width / 10)
  const depthUnits = validateDimension(depth / 10)
  const heightUnits = validateDimension(height / 10)
  const backgroundColor =
    theme === "dark" ? "rgba(2, 8, 23, 0.6)" : "rgba(255, 255, 255, 0.6)"

  useEffect(() => {
    if (!canvasContainerRef.current) return

    const container = canvasContainerRef.current

    // Clear previous renderer
    while (container.firstChild) {
      container.removeChild(container.firstChild)
    }

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(backgroundColor)
    scene.fog = new THREE.Fog(backgroundColor, 100, 1000)

    // Camera positioned to view table from above at an angle
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    camera.position.set(widthUnits * 0.6, heightUnits * 1.5, depthUnits * 0.8)
    camera.lookAt(0, -0.5, 0)

    // Mobile detection
    const isMobileDevice = () =>
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )

    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobileDevice(),
      powerPreference: "high-performance",
      alpha: true,
    })
    renderer.setSize(300, 300)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.5

    const pixelRatio = isMobileDevice()
      ? Math.min(window.devicePixelRatio, 1.5)
      : Math.min(window.devicePixelRatio, 2)

    renderer.setPixelRatio(pixelRatio)
    renderer.shadowMap.enabled = true

    if (isMobileDevice()) {
      renderer.shadowMap.type = THREE.BasicShadowMap
    } else {
      renderer.shadowMap.type = THREE.PCFSoftShadowMap
    }

    container.appendChild(renderer.domElement)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
    directionalLight.position.set(widthUnits, heightUnits * 1.5, depthUnits)
    directionalLight.castShadow = true
    scene.add(directionalLight)

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.rotateSpeed = 0.5
    controls.autoRotate = true
    controls.autoRotateSpeed = 1.5

    controls.minPolarAngle = Math.PI / 5 // 36 degrees
    controls.maxPolarAngle = Math.PI / 2.2 // ~81 degrees
    controls.minAzimuthAngle = -Math.PI / 4
    controls.maxAzimuthAngle = Math.PI / 4

    controls.minDistance = Math.max(widthUnits, depthUnits) * 1.5
    controls.maxDistance = Math.max(widthUnits, depthUnits) * 3

    controls.enablePan = false
    controls.enableZoom = true
    controls.update()

    // ===== LED COLOR MAPPING =====
    const getLedColor = (): THREE.Color => {
      const ledColorMap: { [key: string]: number } = {
        rainbow: 0xff00ff,
        red: 0xff0000,
        green: 0x00ff00,
        blue: 0x0000ff,
        white: 0xffffff,
        purple: 0xb733f9,
        pink: 0xff6b9d,
        cyan: 0x00ffff,
      }
      return new THREE.Color(ledColorMap[ledColor] || 0xffffff)
    }

    const ledColorObj = getLedColor()

    // ===== FRAME COLOR MAPPING =====
    const frameColorMap: { [key: string]: number } = {
      "madera-natural": 0x8b6914,
      "madera-oscura": 0x3e2723,
      "martillado-cobre": 0xb87333,
      aluminio: 0xc0c0c0,
    }
    const tableFrameColor = frameColorMap[frameColor] || 0x8b6914

    // ===== TABLETOP WITH LED GRID =====
    // Create a plane geometry for the LED surface
    const gridResolution = 20 // 20x20 grid of LEDs
    const tableTopGeometry = new THREE.PlaneGeometry(
      widthUnits,
      depthUnits,
      gridResolution,
      gridResolution
    )

    // Create custom material with LED effect
    const tableTopMaterial = new THREE.MeshStandardMaterial({
      color: 0x000000,
      emissive: ledColorObj,
      emissiveIntensity: 0.8,
      metalness: 0.6,
      roughness: 0.2,
    })

    const tableTop = new THREE.Mesh(tableTopGeometry, tableTopMaterial)
    tableTop.position.y = heightUnits / 2 - 0.05
    tableTop.rotation.x = -Math.PI / 2
    tableTop.castShadow = true
    tableTop.receiveShadow = true
    scene.add(tableTop)

    // Add LED points/grid visualization on the surface
    const ledGeometry = new THREE.BufferGeometry()
    const ledPositions: number[] = []

    for (let x = 0; x <= gridResolution; x++) {
      for (let z = 0; z <= gridResolution; z++) {
        const posX = (x / gridResolution - 0.5) * widthUnits
        const posZ = (z / gridResolution - 0.5) * depthUnits
        ledPositions.push(posX, heightUnits / 2, posZ)
      }
    }

    ledGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(ledPositions), 3)
    )

    const ledPointMaterial = new THREE.PointsMaterial({
      color: ledColorObj,
      size: 0.15,
      sizeAttenuation: true,
    })

    const ledPoints = new THREE.Points(ledGeometry, ledPointMaterial)
    scene.add(ledPoints)

    // ===== TABLE LEGS =====
    const legRadius = 0.12
    const legHeight = heightUnits / 2
    const legPositions = [
      [-widthUnits / 2.3, -legHeight / 2, -depthUnits / 2.3],
      [widthUnits / 2.3, -legHeight / 2, -depthUnits / 2.3],
      [-widthUnits / 2.3, -legHeight / 2, depthUnits / 2.3],
      [widthUnits / 2.3, -legHeight / 2, depthUnits / 2.3],
    ]

    const legGeometry = new THREE.CylinderGeometry(
      legRadius,
      legRadius * 1.1,
      legHeight,
      8
    )
    const legMaterial = new THREE.MeshStandardMaterial({
      color: tableFrameColor,
      metalness: 0.1,
      roughness: 0.7,
    })

    legPositions.forEach((pos) => {
      const leg = new THREE.Mesh(legGeometry, legMaterial)
      leg.position.set(pos[0], pos[1], pos[2])
      leg.castShadow = true
      leg.receiveShadow = true
      scene.add(leg)
    })

    // ===== FRAME/BORDER =====
    // Add a subtle frame around the table edge
    const frameGeometry = new THREE.BoxGeometry(
      widthUnits + 0.3,
      0.08,
      depthUnits + 0.3
    )
    const frameMaterial = new THREE.MeshStandardMaterial({
      color: tableFrameColor,
      metalness: 0.15,
      roughness: 0.6,
    })
    const frame = new THREE.Mesh(frameGeometry, frameMaterial)
    frame.position.y = heightUnits / 2 - 0.06
    frame.castShadow = true
    frame.receiveShadow = true
    scene.add(frame)

    // ===== AMBIENT LED LIGHTS =====
    // Add point lights that glow with the LED color
    const ledLightIntensity = 1.5
    const ledLightDistance = 50

    // Lights around edges
    const edgeLights = [
      [widthUnits / 2, heightUnits / 2 + 0.3, 0],
      [-widthUnits / 2, heightUnits / 2 + 0.3, 0],
      [0, heightUnits / 2 + 0.3, depthUnits / 2],
      [0, heightUnits / 2 + 0.3, -depthUnits / 2],
    ]

    edgeLights.forEach((pos) => {
      const light = new THREE.PointLight(
        ledColorObj,
        ledLightIntensity,
        ledLightDistance
      )
      light.position.set(pos[0], pos[1], pos[2])
      scene.add(light)
    })

    // Animation loop
    let animationFrameId: number
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      controls.update()

      // Animate LED intensity for pulsing effect
      const time = Date.now() * 0.001
      const pulse = 0.5 + Math.sin(time * 2) * 0.3
      tableTopMaterial.emissiveIntensity = pulse

      renderer.render(scene, camera)
    }
    animate()

    // Handle resize
    const handleResize = () => {
      const newWidth = container.clientWidth || 300
      const newHeight = container.clientHeight || 300
      renderer.setSize(newWidth, newHeight)
      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
    }

    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationFrameId)
      renderer.dispose()
      tableTopGeometry.dispose()
      tableTopMaterial.dispose()
      legGeometry.dispose()
      legMaterial.dispose()
      frameGeometry.dispose()
      frameMaterial.dispose()
      ledGeometry.dispose()
      ledPointMaterial.dispose()
    }
  }, [width, height, depth, ledColor, frameColor, fov, aspect, near, far, theme])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-96 bg-black rounded-lg overflow-hidden"
      onClick={handleCanvasInteraction}
    >
      {/* Canvas container */}
      <div
        ref={canvasContainerRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* Overlay UI */}
      {showIcon && (
        <div
          className={`absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-600 z-10 ${
            fadeOut ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="text-center">
            <div className="text-4xl mb-2">👆</div>
            <p className="text-sm text-gray-300">Toca para interactuar</p>
          </div>
        </div>
      )}
    </div>
  )
}
