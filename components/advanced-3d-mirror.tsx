"use client"

import { useEffect, useRef, useState } from "react"
// Using global Three.js from CDN
import { Button } from "@/components/ui/button"
import { Camera, CuboidIcon as Cube } from "lucide-react"

// Add global declaration for THREE
declare global {
  interface Window {
    THREE: any
  }
}

export default function Advanced3DMirror() {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isStreaming, setIsStreaming] = useState(false)

  useEffect(() => {
    let scene: any
    let camera: any
    let renderer: any
    let videoTexture: any
    let mesh: any
    let animationId: number

    const initThree = () => {
      if (!containerRef.current || !videoRef.current) return

      // Create scene
      scene = new window.THREE.Scene()

      // Create camera
      camera = new window.THREE.PerspectiveCamera(
        75,
        containerRef.current.clientWidth / containerRef.current.clientHeight,
        0.1,
        1000,
      )
      camera.position.z = 1.5

      // Create renderer
      renderer = new window.THREE.WebGLRenderer({ alpha: true })
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
      containerRef.current.appendChild(renderer.domElement)

      // Create video texture
      videoTexture = new window.THREE.VideoTexture(videoRef.current)
      videoTexture.minFilter = window.THREE.LinearFilter
      videoTexture.magFilter = window.THREE.LinearFilter

      // Create geometry
      const geometry = new window.THREE.SphereGeometry(1, 32, 32)

      // Create material with video texture
      const material = new window.THREE.MeshBasicMaterial({
        map: videoTexture,
        side: window.THREE.BackSide, // Render inside of sphere
      })

      // Create mesh
      mesh = new window.THREE.Mesh(geometry, material)
      scene.add(mesh)

      // Animation loop
      const animate = () => {
        animationId = requestAnimationFrame(animate)

        // Update texture if video is playing
        if (videoRef.current && !videoRef.current.paused) {
          videoTexture.needsUpdate = true
        }

        // Rotate the sphere slightly
        mesh.rotation.y += 0.001

        renderer.render(scene, camera)
      }

      animate()

      // Handle resize
      const handleResize = () => {
        if (!containerRef.current) return

        camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
        camera.updateProjectionMatrix()
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
      }

      window.addEventListener("resize", handleResize)

      return () => {
        window.removeEventListener("resize", handleResize)
        cancelAnimationFrame(animationId)
        if (containerRef.current && renderer.domElement) {
          containerRef.current.removeChild(renderer.domElement)
        }
      }
    }

    if (isStreaming) {
      initThree()
    }

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [isStreaming])

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
        setIsStreaming(true)
      }
    } catch (err) {
      console.error("Error accessing webcam:", err)
    }
  }

  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
      setIsStreaming(false)
    }
  }

  const toggleWebcam = () => {
    if (isStreaming) {
      stopWebcam()
    } else {
      startWebcam()
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div ref={containerRef} className="relative w-[640px] h-[480px] rounded-lg border-2 border-white overflow-hidden">
        <video ref={videoRef} className="hidden" width="640" height="480" />

        {!isStreaming && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <Cube className="w-16 h-16 text-white opacity-50" />
          </div>
        )}
      </div>

      <div className="mt-4">
        <Button
          onClick={toggleWebcam}
          className="flex items-center gap-2"
          variant={isStreaming ? "destructive" : "default"}
        >
          <Camera className="w-4 h-4" />
          {isStreaming ? "Stop 3D Mirror" : "Start 3D Mirror"}
        </Button>
      </div>
    </div>
  )
}
