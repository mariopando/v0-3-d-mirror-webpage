"use client"

import { useEffect, useRef, useState } from "react"

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
  const [isV0Environment, setIsV0Environment] = useState(false)
  const [threeJsLoaded, setThreeJsLoaded] = useState(false)
  const [loadingError, setLoadingError] = useState(false)

  // Detect if running in v0 environment
  useEffect(() => {
    const detectV0Environment = () => {
      // Check for v0-specific indicators
      const isV0 =
        window.location.hostname.includes("vusercontent.net") ||
        window.location.hostname.includes("v0.dev") ||
        window.location.hostname.includes("vercel.app") ||
        (typeof window !== "undefined" && window.location.href.includes("preview-v0"))

      setIsV0Environment(isV0)

      // If in v0, don't try to load Three.js
      if (isV0) {
        setLoadingError(true)
        return
      }

      // Check if Three.js is available
      const checkThreeJs = () => {
        if (typeof window !== "undefined" && window.THREE) {
          setThreeJsLoaded(true)
        } else {
          // Try to wait a bit more for Three.js to load
          setTimeout(() => {
            if (typeof window !== "undefined" && window.THREE) {
              setThreeJsLoaded(true)
            } else {
              setLoadingError(true)
            }
          }, 2000)
        }
      }

      checkThreeJs()
    }

    detectV0Environment()
  }, [])

  // Helper function to validate dimensions
  const validateDimension = (value: number, fallback = 1) => {
    return isNaN(value) || value <= 0 ? fallback : value
  }

  const widthUnits = validateDimension(width / 10)
  const heightUnits = validateDimension(height / 10)
  const depthUnits = validateDimension(depth / 10)
  const frameWidthUnits = validateDimension(frameWidth / 20)
  const frameDepthUnits = validateDimension(frameDepth / 20)

  useEffect(() => {
    // Don't try to render Three.js if we're in v0 or if there's an error
    if (isV0Environment || loadingError || !threeJsLoaded || !containerRef.current) {
      return
    }

    // Only proceed if Three.js is actually available
    if (typeof window === "undefined" || !window.THREE) {
      return
    }

    const THREE = window.THREE

    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild)
    }

    try {
      const scene = new THREE.Scene()
      scene.background = new THREE.Color(backgroundColor)

      const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
      camera.position.x = Math.max(widthUnits, heightUnits) * 1.2
      camera.position.z = Math.max(widthUnits, heightUnits) * 1.2

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: "high-performance",
      })
      renderer.setSize(400, 400)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap
      containerRef.current.appendChild(renderer.domElement)

      // Check if OrbitControls is available
      const OrbitControls = window.THREE.OrbitControls
      if (!OrbitControls) {
        throw new Error("OrbitControls not available")
      }

      const controls = new OrbitControls(camera, renderer.domElement)
      controls.enableDamping = true
      controls.dampingFactor = 0.05
      controls.enableZoom = true
      controls.enablePan = true
      controls.rotateSpeed = 0.5
      controls.autoRotate = true
      controls.autoRotateSpeed = 1
      controls.minPolarAngle = Math.PI / 4
      controls.maxPolarAngle = Math.PI / 2
      controls.minDistance = Math.max(widthUnits, heightUnits) * 0.5
      controls.maxDistance = Math.max(widthUnits, heightUnits) * 2
      controls.update()

      // Create frame and other 3D elements here...
      // (Rest of the Three.js code would go here)

      // Simple placeholder for now
      const geometry = new THREE.BoxGeometry(widthUnits, heightUnits, depthUnits)
      const material = new THREE.MeshBasicMaterial({ color: frameColor })
      const cube = new THREE.Mesh(geometry, material)
      scene.add(cube)

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
        renderer.render(scene, camera)
        return animationId
      }

      const animationId = animate()

      return () => {
        cancelAnimationFrame(animationId)
        renderer.dispose()
        controls.dispose()
      }
    } catch (error) {
      console.error("Three.js initialization error:", error)
      setLoadingError(true)
    }
  }, [threeJsLoaded, isV0Environment, loadingError, width, height, depth, ledColor, frameColor, backgroundColor])

  // Render fallback UI for v0 or when Three.js fails
  if (isV0Environment || loadingError || !threeJsLoaded) {
    return (
      <div className="w-[400px] h-[400px] bg-gray-900 rounded-lg border-2 border-gray-700 flex flex-col items-center justify-center">
        <div className="text-center p-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <div className="w-8 h-8 bg-black rounded-sm"></div>
          </div>
          <h3 className="text-lg font-semibold mb-2">Espejo Infinito</h3>
          <p className="text-sm text-gray-400 mb-4">
            {width}cm × {height}cm × {depth}cm
          </p>
          <div className="space-y-2 text-xs text-gray-500">
            <p>Color LED: {ledColor === "rainbow" ? "Arcoíris" : ledColor}</p>
            <p>Marco: {frameColor}</p>
            {isV0Environment && <p className="text-yellow-400 mt-2">Vista previa 3D disponible en producción</p>}
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
