'use client'

import { useEffect, useState } from 'react'

export interface HardwareCapability {
  canUseWebGL2: boolean
  hasEnoughMemory: boolean
  hasGoodGPU: boolean
  deviceMemory?: number
  maxTextures: number
  maxAnisotropy: number
  supportsHighPrecision: boolean
  performanceScore: number // 0-100, where 100 is best
  recommendedRenderer: 'threejs' | 'canvas'
}

export const useHardwareCapability = (): HardwareCapability => {
  const [capability, setCapability] = useState<HardwareCapability>({
    canUseWebGL2: false,
    hasEnoughMemory: false,
    hasGoodGPU: false,
    maxTextures: 8,
    maxAnisotropy: 1,
    supportsHighPrecision: false,
    performanceScore: 0,
    recommendedRenderer: 'canvas',
  })

  useEffect(() => {
    const detectCapabilities = () => {
      // Create canvas to test WebGL
      const canvas = document.createElement('canvas')
      const gl2 = canvas.getContext('webgl2') as WebGL2RenderingContext | null
      const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null

      if (!gl && !gl2) {
        setCapability((prev) => ({
          ...prev,
          canUseWebGL2: false,
          recommendedRenderer: 'canvas',
        }))
        return
      }

      let perfScore = 0
      const details: HardwareCapability = {
        canUseWebGL2: !!gl2,
        hasEnoughMemory: false,
        hasGoodGPU: false,
        maxTextures: 8,
        maxAnisotropy: 1,
        supportsHighPrecision: false,
        performanceScore: 0,
        recommendedRenderer: 'canvas',
      }

      // Check device memory (Chrome/Edge only)
      const deviceMemory = (navigator as any).deviceMemory
      details.deviceMemory = deviceMemory
      if (deviceMemory) {
        details.hasEnoughMemory = deviceMemory >= 4
        if (deviceMemory >= 8) perfScore += 30
        else if (deviceMemory >= 6) perfScore += 25
        else if (deviceMemory >= 4) perfScore += 15
        else perfScore += 5
      } else {
        // Fallback estimation based on performance
        perfScore += 10
      }

      // Check GPU capabilities
      const ext = gl?.getExtension('WEBGL_debug_renderer_info') as any
      if (ext && gl) {
        const renderer = gl?.getParameter(ext.UNMASKED_RENDERER_WEBGL) || 'Unknown'
        const rendererStr = String(renderer).toLowerCase()

        // High-end GPUs
        const highEndGPUs = ['adreno 650', 'adreno 660', 'adreno 665', 'adreno 670', 'adreno 680', 'mali-g77', 'mali-g78', 'apple m', 'a15', 'a16', 'a17']
        const midRangeGPUs = ['adreno 640', 'adreno 642', 'adreno 645', 'mali-g76', 'mali-g72', 'a13', 'a14']

        const isHighEnd = highEndGPUs.some((gpu) => rendererStr.includes(gpu))
        const isMidRange = !isHighEnd && midRangeGPUs.some((gpu) => rendererStr.includes(gpu))

        details.hasGoodGPU = isHighEnd || isMidRange

        if (isHighEnd) perfScore += 40
        else if (isMidRange) perfScore += 25
        else perfScore += 10
      }

      // Check texture support
      if (gl) {
        const maxTextures = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS)
        const maxAniso = gl.getExtension('EXT_texture_filter_anisotropic') as any
        const maxAnisotropy = maxAniso ? gl.getParameter(maxAniso.MAX_TEXTURE_MAX_ANISOTROPY_EXT) : 1

        details.maxTextures = maxTextures || 8
        details.maxAnisotropy = maxAnisotropy || 1

        if (maxTextures >= 16) perfScore += 15
        else if (maxTextures >= 8) perfScore += 10
      }

      // Check high precision support
      const highPrecisionTest = gl?.getShaderPrecisionFormat(gl?.FRAGMENT_SHADER, gl?.HIGH_FLOAT)
      details.supportsHighPrecision =
        highPrecisionTest ? highPrecisionTest.precision >= 24 : false

      if (details.supportsHighPrecision) perfScore += 10

      // Determine recommended renderer based on score
      // Score >= 70 = Three.js (has good hardware)
      // Score 40-69 = Borderline (can use Three.js with optimizations)
      // Score < 40 = Canvas (limited hardware)
      details.performanceScore = Math.min(100, perfScore)

      if (perfScore >= 70 && details.hasGoodGPU && details.deviceMemory !== 2) {
        details.recommendedRenderer = 'threejs'
      } else if (perfScore >= 50 && gl2) {
        // Can still use Three.js with optimizations on mid-range devices
        details.recommendedRenderer = 'threejs'
      } else {
        details.recommendedRenderer = 'canvas'
      }

      setCapability(details)
    }

    detectCapabilities()
  }, [])

  return capability
}
