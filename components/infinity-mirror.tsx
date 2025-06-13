"use client"
import dynamic from "next/dynamic"

interface InfinityMirrorProps {
  width: number
  height: number
  depth: number
  ledColor: string
}

// Dynamic import of Three.js component to ensure it only loads on client-side
const ThreeMirror = dynamic(() => import("./three-mirror"), {
  ssr: false,
  loading: () => (
    <div className="w-[400px] h-[400px] bg-gray-900 rounded-lg flex items-center justify-center">
      <div className="animate-pulse text-gray-400">Cargando visualización 3D...</div>
    </div>
  ),
})

export default function InfinityMirror({ width, height, depth, ledColor }: InfinityMirrorProps) {
  return <ThreeMirror width={width} height={height} depth={depth} ledColor={ledColor} />
}
