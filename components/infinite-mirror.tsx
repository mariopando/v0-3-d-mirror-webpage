"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

export default function InfiniteMirror() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient || !containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000000) // Pure black background

    // Camera setup
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 5
    camera.position.y = 0

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    containerRef.current.appendChild(renderer.domElement)

    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.minDistance = 2
    controls.maxDistance = 10

    // Create a dark environment cube
    const environmentSize = 50
    const environmentGeometry = new THREE.BoxGeometry(environmentSize, environmentSize, environmentSize)
    const environmentMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.BackSide,
    })
    const environment = new THREE.Mesh(environmentGeometry, environmentMaterial)
    scene.add(environment)

    // Mirror dimensions (40cm x 40cm)
    const width = 4 // 40cm
    const height = 4 // 40cm
    const depth = 0.3 // 3cm depth
    const frameThickness = 0.2 // 2cm frame thickness
    const frameColor = 0xffffff // White frame

    // Create frame
    const frameGeometry = new THREE.BoxGeometry(width + frameThickness * 2, height + frameThickness * 2, depth)
    const frameMaterial = new THREE.MeshStandardMaterial({
      color: frameColor,
      roughness: 0.7,
      metalness: 0.3,
    })
    const frame = new THREE.Mesh(frameGeometry, frameMaterial)
    scene.add(frame)

    // Create mirror surface (black background)
    const mirrorGeometry = new THREE.PlaneGeometry(width, height)
    const mirrorMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
    })
    const mirror = new THREE.Mesh(mirrorGeometry, mirrorMaterial)
    mirror.position.z = depth / 2 + 0.001 // Slightly in front of the frame
    scene.add(mirror)

    // Create LED strips
    const ledColor = 0x00bfff // Light blue color
    const ledIntensity = 2 // Brighter LEDs

    // Number of LED strips and LEDs per strip
    const numStrips = 8
    const ledsPerStrip = 20
    const stripSpacing = width / (numStrips - 1)

    // Create LED strips and points
    const ledStrips: THREE.PointLight[][] = []

    for (let strip = 0; strip < numStrips; strip++) {
      const x = -width / 2 + strip * stripSpacing
      const stripLeds: THREE.PointLight[] = []

      for (let led = 0; led < ledsPerStrip; led++) {
        // Calculate LED position with increasing depth
        const z = -0.2 - led * 0.4 // Start just behind the mirror and recede

        // Create point light for LED
        const ledLight = new THREE.PointLight(ledColor, ledIntensity, 0.5)
        ledLight.position.set(x, 0, z)
        scene.add(ledLight)
        stripLeds.push(ledLight)

        // Create visible LED point
        const ledGeometry = new THREE.SphereGeometry(0.03, 8, 8)
        const ledMaterial = new THREE.MeshBasicMaterial({
          color: ledColor,
          transparent: true,
          opacity: 1.0 - led * 0.04, // Fade with depth
        })
        const ledMesh = new THREE.Mesh(ledGeometry, ledMaterial)
        ledMesh.position.set(x, 0, z)
        scene.add(ledMesh)
      }

      ledStrips.push(stripLeds)
    }

    // Create horizontal LED strips
    const horizontalStrips: THREE.PointLight[][] = []

    for (let strip = 0; strip < numStrips; strip++) {
      const y = -height / 2 + strip * stripSpacing
      const stripLeds: THREE.PointLight[] = []

      for (let led = 0; led < ledsPerStrip; led++) {
        // Calculate LED position with increasing depth
        const z = -0.2 - led * 0.4 // Start just behind the mirror and recede

        // Create point light for LED
        const ledLight = new THREE.PointLight(ledColor, ledIntensity, 0.5)
        ledLight.position.set(0, y, z)
        scene.add(ledLight)
        stripLeds.push(ledLight)

        // Create visible LED point
        const ledGeometry = new THREE.SphereGeometry(0.03, 8, 8)
        const ledMaterial = new THREE.MeshBasicMaterial({
          color: ledColor,
          transparent: true,
          opacity: 1.0 - led * 0.04, // Fade with depth
        })
        const ledMesh = new THREE.Mesh(ledGeometry, ledMaterial)
        ledMesh.position.set(0, y, z)
        scene.add(ledMesh)
      }

      horizontalStrips.push(stripLeds)
    }

    // Create clipping planes to hide particles outside the mirror area
    const clipPlanes = [
      new THREE.Plane(new THREE.Vector3(1, 0, 0), width / 2), // Right
      new THREE.Plane(new THREE.Vector3(-1, 0, 0), width / 2), // Left
      new THREE.Plane(new THREE.Vector3(0, 1, 0), height / 2), // Top
      new THREE.Plane(new THREE.Vector3(0, -1, 0), height / 2), // Bottom
    ]

    // Create the infinite mirror effect with receding points
    const mirrorDepth = 15
    const gridSize = 20
    const pointSize = 0.02
    const points: THREE.Points[] = []

    // Create a grid of points that recede into the mirror
    for (let z = -0.5; z > -mirrorDepth; z -= 0.5) {
      // Create vertices for this layer
      const vertices = []

      for (let x = -width / 2 + 0.1; x < width / 2 - 0.1; x += 0.2) {
        for (let y = -height / 2 + 0.1; y < height / 2 - 0.1; y += 0.2) {
          // Add some variation to create a more organic pattern
          // Use a deterministic approach to avoid hydration issues
          const jitterX = Math.sin(x * 100 + y * 50) * 0.05
          const jitterY = Math.cos(y * 100 + x * 50) * 0.05

          vertices.push(x + jitterX, y + jitterY, z)
        }
      }

      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3))

      // Apply clipping planes to this geometry
      const material = new THREE.PointsMaterial({
        color: ledColor,
        size: pointSize,
        transparent: true,
        opacity: 0.7 * (1 + z / mirrorDepth), // Fade with depth
        clippingPlanes: clipPlanes,
      })

      const pointCloud = new THREE.Points(geometry, material)
      scene.add(pointCloud)
      points.push(pointCloud)
    }

    // Enable clipping in the renderer
    renderer.localClippingEnabled = true

    // Add ambient light for the frame
    const ambientLight = new THREE.AmbientLight(0x404040)
    scene.add(ambientLight)

    // Add directional light for the frame
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
    directionalLight.position.set(1, 1, 1)
    scene.add(directionalLight)

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)

      // Update controls
      controls.update()

      // Animate LED strips with a wave pattern
      const time = performance.now() * 0.001

      ledStrips.forEach((strip, stripIndex) => {
        strip.forEach((led, ledIndex) => {
          const brightness = 0.5 + 0.5 * Math.sin(time * 2 + stripIndex * 0.3 + ledIndex * 0.1)
          led.intensity = ledIntensity * brightness
        })
      })

      horizontalStrips.forEach((strip, stripIndex) => {
        strip.forEach((led, ledIndex) => {
          const brightness = 0.5 + 0.5 * Math.sin(time * 2 + stripIndex * 0.3 + ledIndex * 0.1)
          led.intensity = ledIntensity * brightness
        })
      })

      // Animate point clouds
      points.forEach((pointCloud, index) => {
        const z = -0.5 - index * 0.5
        const material = pointCloud.material as THREE.PointsMaterial

        // Pulse the opacity
        const opacityBase = 0.7 * (1 + z / mirrorDepth)
        const opacityPulse = 0.3 * Math.sin(time + index * 0.2)
        material.opacity = opacityBase + opacityPulse

        // Subtle color shift
        const hue = (time * 0.05 + index * 0.01) % 1
        const color = new THREE.Color().setHSL(hue, 0.5, 0.5)
        material.color.lerp(color, 0.05)
      })

      // Render scene
      renderer.render(scene, camera)
    }

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener("resize", handleResize)
    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
      controls.dispose()
    }
  }, [isClient]) // Only run when isClient changes

  return (
    <div className="container">
      <div ref={containerRef} className="scene-container"></div>
    </div>
  )
}
