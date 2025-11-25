"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { RadioGroup } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useTheme } from "next-themes"

interface InfinityMirrorProps {
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

// @refresh reset
export default function InfinityMirror({ 
  width, 
  height, 
  depth, 
  ledColor,
  frameColor,
  fov,
  aspect,
  near,
  far,
}: InfinityMirrorProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  console.log({ 
  width, 
  height, 
  depth, 
  ledColor,
  frameColor,
  fov,
  aspect,
  near,
  far,
})

    // Background color state
  // const [backgroundColor, setBackgroundColor] = useState(1)
  const { theme, setTheme } = useTheme()
  console.log('theme', theme)

  // Helper function to validate dimensions
  const validateDimension = (value: number, fallback: number = 1) => {
    return isNaN(value) || value <= 0 ? fallback : value
  }

  const widthUnits = validateDimension(width / 10)
  const heightUnits = validateDimension(height / 10)
  const depthUnits = validateDimension(depth / 10)
  const backgroundColor = theme === 'dark' ? '#020817' : '#FFFFFF';

  useEffect(() => {
    if (!containerRef.current) return

    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild)
    }

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(backgroundColor)

    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    camera.position.x = Math.max(widthUnits, heightUnits)
    camera.position.z = Math.max(widthUnits, heightUnits)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    })
    renderer.setSize(300, 300)
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

    // Hidebox
    const createHidebox = () => {
      const frameInnerSideMaterial = new THREE.MeshBasicMaterial({
        color: '#000000',
        side: THREE.FrontSide
      })

      const frameOutsideMaterial = new THREE.MeshBasicMaterial({
        color: backgroundColor,
        side: THREE.BackSide
      });

      const frameSides: THREE.Mesh[] = []

      // Top frame piece
      const topGeometry = new THREE.BoxGeometry(widthUnits, 0.005, 3)
      let topFrame = new THREE.Mesh(topGeometry, frameInnerSideMaterial)
      topFrame.position.y = heightUnits / 2
      topFrame.position.x = 0
      topFrame.position.z =  0

      frameSides.push(topFrame)
      topFrame = new THREE.Mesh(topGeometry, frameOutsideMaterial)
      topFrame.position.y = heightUnits / 1.99
      topFrame.position.z = heightUnits * 0.0001
      frameSides.push(topFrame)

      // Bottom frame piece
      const bottomGeometry = new THREE.BoxGeometry(widthUnits, 0.005, 3)
      let bottomFrame = new THREE.Mesh(bottomGeometry, frameInnerSideMaterial)
      bottomFrame.position.y = -heightUnits / 1.99
      bottomFrame.position.z = 0

      frameSides.push(bottomFrame)
      bottomFrame = new THREE.Mesh(bottomGeometry, frameOutsideMaterial)
      bottomFrame.position.y = -heightUnits / 1.985
      bottomFrame.position.z = 0
      frameSides.push(bottomFrame)

      // Left frame piece
      const leftGeometry = new THREE.BoxGeometry(0.005, heightUnits, 3)
      let leftFrame = new THREE.Mesh(leftGeometry, frameInnerSideMaterial)
      leftFrame.position.x = -widthUnits / 2
      leftFrame.position.z = 0

      frameSides.push(leftFrame)
      leftFrame = new THREE.Mesh(leftGeometry, frameOutsideMaterial)
      leftFrame.position.y = 0
      leftFrame.position.x = -widthUnits / 1.985
      leftFrame.position.z = 0 / 2
      frameSides.push(leftFrame)

      // Right frame piece
      const rightGeometry = new THREE.BoxGeometry(0.005, heightUnits, 3)
      let rightFrame = new THREE.Mesh(rightGeometry, frameInnerSideMaterial)
      rightFrame.position.x = widthUnits / 2
      rightFrame.position.z = 0

      frameSides.push(rightFrame)
      rightFrame = new THREE.Mesh(leftGeometry, frameOutsideMaterial)
      rightFrame.position.x = widthUnits / 1.985
      rightFrame.position.z = 0
      frameSides.push(rightFrame)

      // background frame piece
      const aboveGeometry = new THREE.BoxGeometry(widthUnits, heightUnits, 0.005)
      let aboveFrame = new THREE.Mesh(aboveGeometry, frameInnerSideMaterial)
      aboveFrame.position.y = 0
      aboveFrame.position.z = -1.5

      frameSides.push(aboveFrame)
      aboveFrame = new THREE.Mesh(aboveGeometry, frameOutsideMaterial)
      aboveFrame.position.y = 0
      aboveFrame.position.z = -1.55
      frameSides.push(aboveFrame)


      // Add all frame pieces to the scene
      frameSides.forEach(side => scene.add(side))

      return frameSides
    }

    const getFrameColor = (position: number) => {
      const loader = new THREE.TextureLoader(); // Correct instantiation

      if (frameColor === "bluehammered") {
        const texture = loader.load('/206.jpg');
    
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 10); // Repeats the texture 2 times horizontally and 2 times vertically

        // Set texture filtering
        texture.minFilter = THREE.LinearMipMapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        
        // Set anisotropy for better quality at angles
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
            
        return new THREE.MeshBasicMaterial({
              map: texture
        });
      } else if (frameColor === "greenhammered") {
        const texture = loader.load('/uneven-background-texture_1072286-34.jpg');
    
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 10); // Repeats the texture 2 times horizontally and 2 times vertically

        // Set texture filtering
        texture.minFilter = THREE.LinearMipMapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        
        // Set anisotropy for better quality at angles
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
            
        return new THREE.MeshBasicMaterial({
              map: texture
        });
      } else {
        const colorMap: { [key: string]: number } = {
          black: 0x000000,
          white: 0xffffff,
          blue: 0x0088ff,
          green: 0x00ff88,
          yellow: 0xFFE100,
        }
        return new THREE.Color(colorMap[frameColor] || colorMap.pink)
      }
    }

    const createFrameScene = () => {
      let frameMaterial = null;
      if(frameColor === "greenhammered" || frameColor === "bluehammered"){
        frameMaterial =  getFrameColor(1)
      }
      else{
        frameMaterial = new THREE.MeshBasicMaterial({
          color: getFrameColor(1),
          opacity: 1,
          transparent: false,
        });
      }

      const frameSides: THREE.Mesh[] = []

      // Top frame piece
      const topGeometry = new THREE.BoxGeometry(widthUnits, 0.05, depthUnits)
      const topFrame = new THREE.Mesh(topGeometry, frameMaterial)
      topFrame.position.y = heightUnits / 2
      topFrame.position.z = 1.6

      frameSides.push(topFrame)

      // Bottom frame piece
      const bottomGeometry = new THREE.BoxGeometry(widthUnits, 0.05, depthUnits)
      const bottomFrame = new THREE.Mesh(bottomGeometry, frameMaterial)
      bottomFrame.position.y = -heightUnits / 2
      bottomFrame.position.z = 1.6
      frameSides.push(bottomFrame)

      // Left frame piece
      const leftGeometry = new THREE.BoxGeometry(0.05, heightUnits, depthUnits)
      const leftFrame = new THREE.Mesh(leftGeometry, frameMaterial)
      leftFrame.position.x = -widthUnits / 2
      leftFrame.position.z = 1.6

      frameSides.push(leftFrame)

      // Right frame piece
      const rightGeometry = new THREE.BoxGeometry(0.05, heightUnits, depthUnits)
      const rightFrame = new THREE.Mesh(rightGeometry, frameMaterial)
      rightFrame.position.x = widthUnits / 2
      rightFrame.position.z = 1.6
      frameSides.push(rightFrame)

      // Add all frame pieces to the scene
      frameSides.forEach(side => scene.add(side))

      return frameSides
    }

    const createSurfaceMirrorScene = () => {
      const mirrorGeometry = new THREE.PlaneGeometry(
        widthUnits,
        heightUnits
      )
      const mirrorMaterial = new THREE.MeshStandardMaterial({
        color: 0x00FE48,
        opacity: 0.3,
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
      mirror.position.z = 1.6
      scene.add(mirror)
    }

    const numLeds = 10

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
          ledSize,
          ledSize,
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
       led.position.set(x, y, depth / 2 + 0.01)

        // scene.add(led)
        // leds.push(led)
        createInfiniteEffect(x, y, position)
      }

    const createInfiniteEffect = (x: number, y: number, position: number) => {
      // OPTIMIZATION: Reduce the number of points for better performance
      const maxDepth = 15
      const numPoints = 8 // Reduced from 10

      for (let i = 0; i < numPoints; i++) {
        const depth = ((i + 1) / numPoints) * maxDepth
        const z = 2 - depth * 0.2

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
      let numbLeds = numLeds;
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
        const position = (i + numLeds) / numbLeds
        createLed(x, y, position)
      }

      // Bottom edge
      for (let i = 0; i < numLeds; i++) {
        const x = widthUnits / 2 - (widthUnits * i) / (numLeds - 1)
        const y = -heightUnits / 2
        const position = (i + numLeds * 2) / numbLeds
        createLed(x, y, position)
      }

      // Left edge
      for (let i = 0; i < numLeds; i++) {
        const x = -widthUnits / 2
        const y = -heightUnits / 2 + (heightUnits * i) / (numLeds - 1)
        const position = (i + numLeds * 3) / numbLeds
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
  }, [width, height, depth, ledColor, widthUnits, heightUnits, depthUnits, frameColor, fov, aspect, near, far, backgroundColor])

  return (
    <section className="flex flex-col lg:flex-row gap-4 items-center mb-16">
        <div className="canvas-container">
          <div ref={containerRef}></div>
        </div>
      </section>
  )
}
