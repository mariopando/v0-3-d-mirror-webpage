"use client"

import { useEffect, useRef, useState } from "react"

interface InfinityMirrorProps {
  width: number
  height: number
  depth: number
  ledColor: string
}

export default function InfinityMirror({ width, height, depth, ledColor }: InfinityMirrorProps) {
  const [isLoading, setIsLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  // Determinar la imagen a mostrar según el color LED seleccionado
  const getImageSrc = () => {
    switch (ledColor) {
      case "rainbow":
        return "/mirror-rainbow.jpg"
      case "white":
        return "/mirror-white.jpg"
      case "blue":
        return "/mirror-blue.jpg"
      case "green":
        return "/mirror-green.jpg"
      case "purple":
        return "/mirror-purple.jpg"
      case "pink":
        return "/mirror-pink.jpg"
      default:
        return "/mirror-rainbow.jpg"
    }
  }

  useEffect(() => {
    // Simular tiempo de carga
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [ledColor])

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="w-[400px] h-[400px] bg-black rounded-lg overflow-hidden shadow-2xl flex items-center justify-center"
      >
        {isLoading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
            <p className="text-gray-400">Cargando visualización...</p>
          </div>
        ) : (
          <div className="relative w-full h-full">
            {/* Usamos una imagen estática como fallback */}
            <div
              className="w-full h-full bg-center bg-cover"
              style={{
                backgroundImage: `url('/placeholder.svg?height=400&width=400')`,
                backgroundSize: "cover",
              }}
            >
              {/* Simulación visual del espejo infinito */}
              <div className="absolute inset-[40px] bg-black border-2 border-gray-800 flex items-center justify-center">
                <div
                  className={`
                  w-4/5 h-4/5 rounded-sm 
                  ${
                    ledColor === "rainbow"
                      ? "bg-gradient-to-r from-red-500 via-green-500 to-blue-500"
                      : ledColor === "white"
                        ? "bg-white"
                        : ledColor === "blue"
                          ? "bg-blue-500"
                          : ledColor === "green"
                            ? "bg-green-500"
                            : ledColor === "purple"
                              ? "bg-purple-500"
                              : "bg-pink-500"
                  } opacity-20
                `}
                >
                  {/* Efecto de profundidad */}
                  <div className="w-4/5 h-4/5 m-auto bg-black opacity-80"></div>
                </div>

                {/* LEDs alrededor del borde */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* LEDs superiores */}
                  <div className="absolute top-0 left-0 right-0 h-1 flex">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div
                        key={`top-${i}`}
                        className={`
                          w-2 h-2 rounded-full mx-auto 
                          ${
                            ledColor === "rainbow"
                              ? [
                                  "bg-red-500",
                                  "bg-orange-500",
                                  "bg-yellow-500",
                                  "bg-green-500",
                                  "bg-blue-500",
                                  "bg-indigo-500",
                                  "bg-purple-500",
                                  "bg-pink-500",
                                  "bg-red-500",
                                  "bg-orange-500",
                                ][i]
                              : ledColor === "white"
                                ? "bg-white"
                                : ledColor === "blue"
                                  ? "bg-blue-500"
                                  : ledColor === "green"
                                    ? "bg-green-500"
                                    : ledColor === "purple"
                                      ? "bg-purple-500"
                                      : "bg-pink-500"
                          }
                          shadow-glow
                        `}
                        style={{
                          boxShadow: `0 0 10px 2px ${
                            ledColor === "rainbow"
                              ? [
                                  "#f87171",
                                  "#fb923c",
                                  "#facc15",
                                  "#4ade80",
                                  "#60a5fa",
                                  "#818cf8",
                                  "#a855f7",
                                  "#ec4899",
                                  "#f87171",
                                  "#fb923c",
                                ][i]
                              : ledColor === "white"
                                ? "#ffffff"
                                : ledColor === "blue"
                                  ? "#60a5fa"
                                  : ledColor === "green"
                                    ? "#4ade80"
                                    : ledColor === "purple"
                                      ? "#a855f7"
                                      : "#ec4899"
                          }`,
                        }}
                      ></div>
                    ))}
                  </div>

                  {/* LEDs inferiores */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 flex">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div
                        key={`bottom-${i}`}
                        className={`
                          w-2 h-2 rounded-full mx-auto 
                          ${
                            ledColor === "rainbow"
                              ? [
                                  "bg-red-500",
                                  "bg-orange-500",
                                  "bg-yellow-500",
                                  "bg-green-500",
                                  "bg-blue-500",
                                  "bg-indigo-500",
                                  "bg-purple-500",
                                  "bg-pink-500",
                                  "bg-red-500",
                                  "bg-orange-500",
                                ][i]
                              : ledColor === "white"
                                ? "bg-white"
                                : ledColor === "blue"
                                  ? "bg-blue-500"
                                  : ledColor === "green"
                                    ? "bg-green-500"
                                    : ledColor === "purple"
                                      ? "bg-purple-500"
                                      : "bg-pink-500"
                          }
                          shadow-glow
                        `}
                        style={{
                          boxShadow: `0 0 10px 2px ${
                            ledColor === "rainbow"
                              ? [
                                  "#f87171",
                                  "#fb923c",
                                  "#facc15",
                                  "#4ade80",
                                  "#60a5fa",
                                  "#818cf8",
                                  "#a855f7",
                                  "#ec4899",
                                  "#f87171",
                                  "#fb923c",
                                ][i]
                              : ledColor === "white"
                                ? "#ffffff"
                                : ledColor === "blue"
                                  ? "#60a5fa"
                                  : ledColor === "green"
                                    ? "#4ade80"
                                    : ledColor === "purple"
                                      ? "#a855f7"
                                      : "#ec4899"
                          }`,
                        }}
                      ></div>
                    ))}
                  </div>

                  {/* LEDs izquierdos */}
                  <div className="absolute top-0 bottom-0 left-0 w-1 flex flex-col">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={`left-${i}`}
                        className={`
                          w-2 h-2 rounded-full my-auto 
                          ${
                            ledColor === "rainbow"
                              ? [
                                  "bg-red-500",
                                  "bg-orange-500",
                                  "bg-yellow-500",
                                  "bg-green-500",
                                  "bg-blue-500",
                                  "bg-indigo-500",
                                  "bg-purple-500",
                                  "bg-pink-500",
                                ][i]
                              : ledColor === "white"
                                ? "bg-white"
                                : ledColor === "blue"
                                  ? "bg-blue-500"
                                  : ledColor === "green"
                                    ? "bg-green-500"
                                    : ledColor === "purple"
                                      ? "bg-purple-500"
                                      : "bg-pink-500"
                          }
                          shadow-glow
                        `}
                        style={{
                          boxShadow: `0 0 10px 2px ${
                            ledColor === "rainbow"
                              ? [
                                  "#f87171",
                                  "#fb923c",
                                  "#facc15",
                                  "#4ade80",
                                  "#60a5fa",
                                  "#818cf8",
                                  "#a855f7",
                                  "#ec4899",
                                ][i]
                              : ledColor === "white"
                                ? "#ffffff"
                                : ledColor === "blue"
                                  ? "#60a5fa"
                                  : ledColor === "green"
                                    ? "#4ade80"
                                    : ledColor === "purple"
                                      ? "#a855f7"
                                      : "#ec4899"
                          }`,
                        }}
                      ></div>
                    ))}
                  </div>

                  {/* LEDs derechos */}
                  <div className="absolute top-0 bottom-0 right-0 w-1 flex flex-col">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={`right-${i}`}
                        className={`
                          w-2 h-2 rounded-full my-auto 
                          ${
                            ledColor === "rainbow"
                              ? [
                                  "bg-red-500",
                                  "bg-orange-500",
                                  "bg-yellow-500",
                                  "bg-green-500",
                                  "bg-blue-500",
                                  "bg-indigo-500",
                                  "bg-purple-500",
                                  "bg-pink-500",
                                ][i]
                              : ledColor === "white"
                                ? "bg-white"
                                : ledColor === "blue"
                                  ? "bg-blue-500"
                                  : ledColor === "green"
                                    ? "bg-green-500"
                                    : ledColor === "purple"
                                      ? "bg-purple-500"
                                      : "bg-pink-500"
                          }
                          shadow-glow
                        `}
                        style={{
                          boxShadow: `0 0 10px 2px ${
                            ledColor === "rainbow"
                              ? [
                                  "#f87171",
                                  "#fb923c",
                                  "#facc15",
                                  "#4ade80",
                                  "#60a5fa",
                                  "#818cf8",
                                  "#a855f7",
                                  "#ec4899",
                                ][i]
                              : ledColor === "white"
                                ? "#ffffff"
                                : ledColor === "blue"
                                  ? "#60a5fa"
                                  : ledColor === "green"
                                    ? "#4ade80"
                                    : ledColor === "purple"
                                      ? "#a855f7"
                                      : "#ec4899"
                          }`,
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="absolute inset-0 pointer-events-none rounded-lg shadow-[0_0_50px_rgba(255,0,255,0.3)]"></div>
    </div>
  )
}
