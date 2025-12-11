"use client"

import React from "react"
import { useEffect, useRef } from "react"
import * as BABYLON from "@babylonjs/core"
import "@babylonjs/loaders"

interface BabylonMirrorProps {
  width: number
  height: number
  depth: number
  ledColor: string
  frameColor?: string
}

const BabylonMirror = React.memo(function BabylonMirror({
  width,
  height,
  depth,
  ledColor,
  frameColor = "negro",
}: BabylonMirrorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<BABYLON.Scene | null>(null)
  const engineRef = useRef<BABYLON.Engine | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Create engine with mobile optimizations
    const engine = new BABYLON.Engine(canvas, true, {
      preserveDrawingBuffer: false,
      antialias: false,
      stencil: false,
    })
    engineRef.current = engine

    // Create scene
    const scene = new BABYLON.Scene(engine)
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 1)
    scene.collisionsEnabled = false
    scene.physicsEnabled = false
    sceneRef.current = scene

    // Camera setup
    const camera = new BABYLON.ArcRotateCamera(
      "camera",
      Math.PI / 2,
      Math.PI / 3,
      30,
      BABYLON.Vector3.Zero(),
      scene
    )
    camera.attachControl(canvas, true)
    camera.inertia = 0.7
    camera.angularSensibilityX = 500
    camera.angularSensibilityY = 500
    camera.wheelPrecision = 20
    camera.lowerRadiusLimit = 15
    camera.upperRadiusLimit = 50

    // Lights - minimal for mobile
    const light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene)
    light1.intensity = 0.7
    light1.specular = BABYLON.Color3.Black()

    const light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(20, 20, 20), scene)
    light2.intensity = 0.3
    light2.range = 100

    // Get frame color
    const getFrameColor = (): BABYLON.Color3 => {
      const colorMap: { [key: string]: BABYLON.Color3 } = {
        "madera-natural": new BABYLON.Color3(0.545, 0.435, 0.28),
        "martillado-azul": new BABYLON.Color3(0.17, 0.24, 0.31),
        "martillado-verde": new BABYLON.Color3(0.153, 0.682, 0.376),
        "martillado-cobre": new BABYLON.Color3(0.722, 0.255, 0.055),
        "madera-barnices": new BABYLON.Color3(0.804, 0.522, 0.247),
        "nogal": new BABYLON.Color3(0.396, 0.263, 0.129),
        "caoba": new BABYLON.Color3(0.545, 0.271, 0.075),
        "blanco": new BABYLON.Color3(0.96, 0.96, 0.96),
        "negro": new BABYLON.Color3(0.1, 0.1, 0.1),
        "rojo": new BABYLON.Color3(0.86, 0.08, 0.24),
        "azul": new BABYLON.Color3(0, 0.28, 0.67),
        "verde": new BABYLON.Color3(0.133, 0.545, 0.133),
        "amarillo": new BABYLON.Color3(1, 0.843, 0),
        "aluminio": new BABYLON.Color3(0.753, 0.753, 0.753),
      }
      return colorMap[frameColor] || new BABYLON.Color3(0.1, 0.1, 0.1)
    }

    // Create frame
    const mirrorWidth = (width * 2) / 10
    const mirrorHeight = (height * 2) / 10

    // Outer frame box
    const frameBox = BABYLON.MeshBuilder.CreateBox(
      "frameBox",
      {
        width: mirrorWidth + 0.3,
        height: mirrorHeight + 0.3,
        depth: 0.3,
      },
      scene
    )
    const frameMaterial = new BABYLON.StandardMaterial("frameMat", scene)
    frameMaterial.emissiveColor = getFrameColor()
    frameMaterial.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1)
    frameBox.material = frameMaterial

    // Mirror reflective surface
    const mirrorPlane = BABYLON.MeshBuilder.CreateBox(
      "mirrorPlane",
      {
        width: mirrorWidth,
        height: mirrorHeight,
        depth: 0.05,
      },
      scene
    )
    const mirrorMat = new BABYLON.StandardMaterial("mirrorMat", scene)
    mirrorMat.emissiveColor = new BABYLON.Color3(0.05, 0.05, 0.05)
    mirrorMat.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3)
    mirrorMat.specularPower = 32
    mirrorPlane.material = mirrorMat
    mirrorPlane.position.z = 0.15

    // Get LED color
    const getLedColor = (position: number): BABYLON.Color3 => {
      if (ledColor === "rainbow") {
        const hue = (position * 360) % 360
        return BABYLON.Color3.FromHSV(hue, 100, 100)
      } else if (ledColor === "white") {
        return new BABYLON.Color3(1, 1, 1)
      } else if (ledColor === "blue") {
        return new BABYLON.Color3(0, 0.533, 1)
      } else if (ledColor === "green") {
        return new BABYLON.Color3(0, 1, 0.533)
      } else if (ledColor === "purple") {
        return new BABYLON.Color3(0.533, 0, 1)
      } else {
        return new BABYLON.Color3(1, 0, 0.533) // Pink
      }
    }

    // Create LED lights around the frame
    const numLeds = 24 // Reduced for mobile performance
    const ledRadius = Math.max(mirrorWidth, mirrorHeight) / 2 + 0.2

    for (let i = 0; i < numLeds; i++) {
      const angle = (i / numLeds) * Math.PI * 2
      const x = Math.cos(angle) * ledRadius
      const y = Math.sin(angle) * ledRadius
      const z = 0.2

      const ledLight = new BABYLON.PointLight(`led${i}`, new BABYLON.Vector3(x, y, z), scene)
      const color = getLedColor(i / numLeds)
      ledLight.diffuse = color
      ledLight.specular = color
      ledLight.intensity = 0.15
      ledLight.range = 10

      // Store reference for animation
      ;(ledLight as any).ledIndex = i
    }

    // Create infinite reflection effect with boxes
    const maxDepth = 8
    for (let i = 1; i <= maxDepth; i++) {
      const scale = Math.pow(0.9, i)
      const w = mirrorWidth * scale
      const h = mirrorHeight * scale
      const z = 0.2 + i * 0.1

      const depthBox = BABYLON.MeshBuilder.CreateBox(
        `depthBox${i}`,
        {
          width: w,
          height: h,
          depth: 0.02,
        },
        scene
      )
      const depthMat = new BABYLON.StandardMaterial(`depthMat${i}`, scene)
      const opacity = Math.max(0.05, 1 - (i / maxDepth) * 0.95)
      depthMat.alpha = opacity
      depthMat.emissiveColor = new BABYLON.Color3(0.03, 0.03, 0.03)
      depthBox.material = depthMat
      depthBox.position.z = z
    }

    // Animation loop
    let time = 0
    const lights = scene.lights.filter((l) => l instanceof BABYLON.PointLight) as BABYLON.PointLight[]

    engine.runRenderLoop(() => {
      time += 0.016

      // Animate LED lights
      lights.forEach((light) => {
        const ledIndex = (light as any).ledIndex
        if (ledIndex !== undefined) {
          const pulse = 0.6 + 0.4 * Math.sin(time * 2 + ledIndex * 0.5)
          light.intensity = 0.15 * pulse
        }
      })

      scene.render()
    })

    // Handle resize
    const handleResize = () => {
      engine.resize()
    }
    window.addEventListener("resize", handleResize, { passive: true })

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      scene.dispose()
      engine.dispose()
    }
  }, [width, height, depth, ledColor, frameColor])

  return (
    <canvas
      ref={canvasRef}
      className="rounded-lg border-2 border-gray-800 w-full max-w-sm mx-auto"
      style={{
        display: "block",
        aspectRatio: "1 / 1",
      }}
    />
  )
})

export default BabylonMirror
