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
  frameColor: string
  frameWidth: number
  frameDepth: number
  surfaceMirrorTransparency: number
  fov: number
  aspect: number
  near: number
  far: number
  backgroundColor: number
}

interface ProductControlsProps {
  width: number
  setWidth: (width: number) => void
  height: number
  setHeight: (height: number) => void
  depth: number
  setDepth: (depth: number) => void
  ledColor: string
  setLedColor: (color: string) => void
  frameColor: string
  setFrameColor: (color: string) => void
  surfaceMirrorTransparency: number
  setSurfaceMirrorTransparency: (transparency: number) => void
}

export default function InfinityMirror({ 
  width, 
  height, 
  depth, 
  ledColor,
  frameColor,
  frameWidth,
  frameDepth,
  surfaceMirrorTransparency,
  fov,
  aspect,
  near,
  far,
  backgroundColor,
}: InfinityMirrorProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Helper function to validate dimensions
  const validateDimension = (value: number, fallback: number = 1) => {
    return isNaN(value) || value <= 0 ? fallback : value
  }

  const widthUnits = validateDimension(width / 10)
  const heightUnits = validateDimension(height / 10)
  const depthUnits = validateDimension(depth / 10)
  const frameWidthUnits = validateDimension(frameWidth / 20)
  const frameDepthUnits = validateDimension(frameDepth / 20)

  useEffect(() => {
    if (!containerRef.current) return

    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild)
    }

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(backgroundColor)

    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    camera.position.x = Math.max(widthUnits, heightUnits) * 1.2
    camera.position.z = Math.max(widthUnits, heightUnits) * 1.2

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    })
    renderer.setSize(window.innerHeight / 2, window.innerHeight / 2)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    containerRef.current.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.enableZoom = true
    controls.enablePan = true
    controls.rotateSpeed = 0.5
    controls.autoRotate = true
    controls.autoRotateSpeed = 1
    controls.minPolarAngle = Math.PI / 4; // 45 degrees
    controls.maxPolarAngle = Math.PI / 2; // 90 degrees (horizon)
    controls.minDistance = Math.max(widthUnits, heightUnits) * 0.5
    controls.maxDistance = Math.max(widthUnits, heightUnits) * 2
    controls.update()

    // Create separate scenes
    const createFrameScene = () => {
      const frameMaterial = new THREE.MeshStandardMaterial({
        color: frameColor,
        opacity: 0.9,
        transparent: false,
      });

      const safeWidth = validateDimension(widthUnits + frameWidthUnits * 2)
      const safeHeight = validateDimension(heightUnits + frameWidthUnits * 2)
      const safeDepth = validateDimension(frameDepthUnits)
      const frameSides: THREE.Mesh[] = []

      // Top frame piece
      const topGeometry = new THREE.BoxGeometry(safeWidth, frameWidthUnits, safeDepth)
      const topFrame = new THREE.Mesh(topGeometry, frameMaterial)
      topFrame.position.y = safeHeight / 2 - frameWidthUnits / 2
      frameSides.push(topFrame)

      // Bottom frame piece
      const bottomGeometry = new THREE.BoxGeometry(safeWidth, frameWidthUnits, safeDepth)
      const bottomFrame = new THREE.Mesh(bottomGeometry, frameMaterial)
      bottomFrame.position.y = -safeHeight / 2 + frameWidthUnits / 2
      frameSides.push(bottomFrame)

      // Left frame piece
      const leftGeometry = new THREE.BoxGeometry(frameWidthUnits, safeHeight - frameWidthUnits * 2, safeDepth)
      const leftFrame = new THREE.Mesh(leftGeometry, frameMaterial)
      leftFrame.position.x = -safeWidth / 2 + frameWidthUnits / 2
      frameSides.push(leftFrame)

      // Right frame piece
      const rightGeometry = new THREE.BoxGeometry(frameWidthUnits, safeHeight - frameWidthUnits * 2, safeDepth)
      const rightFrame = new THREE.Mesh(rightGeometry, frameMaterial)
      rightFrame.position.x = safeWidth / 2 - frameWidthUnits / 2
      frameSides.push(rightFrame)

      // Add all frame pieces to the scene
      frameSides.forEach(side => scene.add(side))

      return frameSides
    }

    // @refresh reset

    // Hidebox
    const createHidebox = () => {
      const frameInnerSideMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        side: THREE.FrontSide
      })

      const frameOutsideMaterial = new THREE.MeshBasicMaterial({
        color: backgroundColor,
        side: THREE.BackSide
      })
      
      const safeWidth = validateDimension(widthUnits + frameWidthUnits * 2)
      const safeHeight = validateDimension(heightUnits + frameWidthUnits * 2)
      const safeDepth = validateDimension(frameDepthUnits) * 3.5
      const zPosition = -safeWidth / 4.4 + frameWidthUnits;
      const frameSides: THREE.Mesh[] = []

      // Top frame piece
      const topGeometry = new THREE.BoxGeometry(safeWidth, frameWidthUnits, safeDepth)
      let topFrame = new THREE.Mesh(topGeometry, frameInnerSideMaterial)
      topFrame.position.y = safeHeight / 2 - frameWidthUnits / 2
      topFrame.position.z = zPosition

      frameSides.push(topFrame)
      topFrame = new THREE.Mesh(topGeometry, frameOutsideMaterial)
      topFrame.position.y = safeHeight / 1.95 - frameWidthUnits / 1.95
      topFrame.position.z = zPosition
      frameSides.push(topFrame)

      // Bottom frame piece
      const bottomGeometry = new THREE.BoxGeometry(safeWidth, frameWidthUnits, safeDepth)
      let bottomFrame = new THREE.Mesh(bottomGeometry, frameInnerSideMaterial)
      bottomFrame.position.y = -safeHeight / 2 + frameWidthUnits / 2
      bottomFrame.position.z = zPosition

      frameSides.push(bottomFrame)
      bottomFrame = new THREE.Mesh(bottomGeometry, frameOutsideMaterial)
      bottomFrame.position.y = safeHeight / 1.95 - frameWidthUnits / 1.95
      bottomFrame.position.z = zPosition
      frameSides.push(bottomFrame)

      // Left frame piece
      const leftGeometry = new THREE.BoxGeometry(frameWidthUnits, safeHeight - frameWidthUnits * 2, safeDepth)
      let leftFrame = new THREE.Mesh(leftGeometry, frameInnerSideMaterial)
      leftFrame.position.x = -safeWidth / 2 + frameWidthUnits
      leftFrame.position.z = zPosition

      frameSides.push(leftFrame)
      leftFrame = new THREE.Mesh(leftGeometry, frameOutsideMaterial)
      leftFrame.position.y = -safeHeight / 1.95 + frameWidthUnits
      leftFrame.position.z = zPosition
      frameSides.push(leftFrame)

      // Right frame piece
      const rightGeometry = new THREE.BoxGeometry(frameWidthUnits, safeHeight - frameWidthUnits * 2, safeDepth )
      let rightFrame = new THREE.Mesh(rightGeometry, frameInnerSideMaterial)
      rightFrame.position.x = safeWidth / 2 - frameWidthUnits / 2
      rightFrame.position.z = zPosition

      frameSides.push(rightFrame)
      // rightFrame = new THREE.Mesh(leftGeometry, frameOutsideMaterial)
      // rightFrame.position.x = -safeWidth / 2 + frameWidthUnits / 2
      // rightFrame.position.z = zPosition
      // frameSides.push(rightFrame)


      // background frame piece
      const aboveGeometry = new THREE.BoxGeometry(safeWidth, safeHeight, 0.01)
      let aboveFrame = new THREE.Mesh(aboveGeometry, frameInnerSideMaterial)
      aboveFrame.position.y = frameWidthUnits
      aboveFrame.position.z = zPosition - 1

      frameSides.push(aboveFrame)
      // aboveFrame = new THREE.Mesh(aboveGeometry, frameOutsideMaterial)
      // aboveFrame.position.x = -safeWidth / 2 + frameWidthUnits / 2
      // aboveFrame.position.z = zPosition
      // frameSides.push(aboveFrame)


      // Add all frame pieces to the scene
      frameSides.forEach(side => scene.add(side))

      return frameSides
    }

    const createSurfaceMirrorScene = () => {
      const mirrorGeometry = new THREE.PlaneGeometry(
        validateDimension(widthUnits),
        validateDimension(heightUnits)
      )
      const mirrorMaterial = new THREE.MeshStandardMaterial({
        color: 0x000000,
        opacity: validateDimension(surfaceMirrorTransparency, 1) / 5,
        transparent: true,
        transmission: 0.9,  // Amount of light passing through
        reflectivity: 0.7,    // Reflectivity (0 to 1)
        ior: 1.5,            // Index of Refraction
        envMapIntensity: 0.9, // Environment map intensity
        roughness: 0.1,     // Low roughness for a smooth glass look
        metalness: 1,       // Non-metallic material
        clearcoat: 1,        // Simulates a thin clear coat layer
      })
      const mirror = new THREE.Mesh(mirrorGeometry, mirrorMaterial)
      mirror.position.z = validateDimension(frameDepthUnits / 4) + 0.001
      scene.add(mirror)
    }

    const numLeds = 20

    const createLedsScene = () => {
      const ledSize = 0.05
      const leds: THREE.Mesh[] = []

      const getLedColor = (position: number) => {
        if (ledColor === "rainbow") {
          const hue = (position + 0.5) / 2
          return new THREE.Color().setHSL(hue, 1, 0.5)
        } else {
          const colorMap: { [key: string]: number } = {
            white: 0xffffff,
            blue: 0x0088ff,
            green: 0x00ff88,
            purple: 0x8800ff,
            pink: 0xff0088
          }
          return new THREE.Color(colorMap[ledColor] || colorMap.pink)
        }
      }

      const createLed = (x: number, y: number, position: number) => {
        const ledGeometry = new THREE.BoxGeometry(
          validateDimension(ledSize),
          validateDimension(ledSize),
          0.05
        )
        const color = getLedColor(position)
        const ledMaterial = new THREE.MeshStandardMaterial({
          color: 0x000000,
          emissive: color,
          emissiveIntensity: 2,
          transparent: true,
          opacity: 0.1,
        })
        const led = new THREE.Mesh(ledGeometry, ledMaterial)
        // Position LED considering frame width
       led.position.set(x, y, depthUnits / 2 + 0.02)

        scene.add(led)
        leds.push(led)
        createInfiniteEffect(x, y, position)
      }

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

        const pointGeometry = new THREE.BoxGeometry(ledSize * 0.8, ledSize * 0.8, 0.02)
        const color = getLedColor(position)

        // Use emissive material for the receding points too
        const pointMaterial = new THREE.MeshStandardMaterial({
          color: 0x000000,
          emissive: color,
          emissiveIntensity: 1.5 * (1 - (i / numPoints) * 0.7),
          transparent: true,
          opacity: 1 - (i / numPoints) * 0.7,
        })

        const point = new THREE.Mesh(pointGeometry, pointMaterial)
        point.position.set(scaledX, scaledY, z)
        scene.add(point)
        leds.push(point)
      }
    }

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

      createPerimeterLeds()
      return leds
    }

    // Create all scenes
    createHidebox()
    createFrameScene()
    createSurfaceMirrorScene()
    const leds = createLedsScene()

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
    directionalLight.position.set(1, 1, 1)
    scene.add(directionalLight)

    // Animation loop
    const animate = () => {
      const animationId = requestAnimationFrame(animate)
      controls.update()

      const time = performance.now() * 0.001
      leds.forEach((led, index) => {
        const material = led.material as THREE.MeshStandardMaterial
        if (material.emissiveIntensity !== undefined) {
          const baseIntensity = index < numLeds * 4 ? 2 : 1.5 * (1 - (Math.floor(index / (numLeds * 4)) / 8) * 0.7)
          const pulseAmount = index < numLeds * 4 ? 0.5 : 0.3
          material.emissiveIntensity = baseIntensity * (1 + pulseAmount * Math.sin(time * 2 + index * 0.1))

          // Also modulate the light intensity
          // if (ledLights[index]) {
          //   ledLights[index].intensity = 0.5 * (1 + pulseAmount * Math.sin(time * 2 + index * 0.1))
          // }
        }
      })

      renderer.render(scene, camera)
      return animationId
    }

    const animationId = animate()

    return () => {
      cancelAnimationFrame(animationId)
      renderer.dispose()
      controls.dispose()
    }
  }, [width, height, depth, ledColor, widthUnits, heightUnits, depthUnits, frameColor, surfaceMirrorTransparency, fov, aspect, near, far, backgroundColor])

  return (
    <div className="relative">
      <div ref={containerRef} className="w-[400px] h-[400px]"></div>
    </div>
  )
}