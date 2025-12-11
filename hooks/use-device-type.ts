import { useState, useEffect, useCallback } from 'react'

type DeviceType = 'mobile' | 'tablet' | 'desktop'

interface UseDeviceTypeReturn {
  deviceType: DeviceType
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  width: number
}

const determineDeviceType = (screenWidth: number): DeviceType => {
  // Mobile: < 640px
  // Tablet: 640px - 1023px
  // Desktop: >= 1024px
  if (screenWidth < 640) return 'mobile'
  if (screenWidth < 1024) return 'tablet'
  return 'desktop'
}

const getInitialDimensions = () => {
  if (typeof window === 'undefined') {
    return { width: 1024, deviceType: 'desktop' as DeviceType }
  }
  const width = window.innerWidth
  return { width, deviceType: determineDeviceType(width) }
}

export function useDeviceType(): UseDeviceTypeReturn {
  const [{ deviceType, width }, setDimensions] = useState(() => {
    const initial = getInitialDimensions()
    return { deviceType: initial.deviceType, width: initial.width }
  })

  useEffect(() => {
    // Handle resize with debouncing
    let resizeTimeout: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        const newWidth = window.innerWidth
        const newDeviceType = determineDeviceType(newWidth)
        setDimensions({ width: newWidth, deviceType: newDeviceType })
      }, 150)
    }

    window.addEventListener('resize', handleResize, { passive: true })

    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(resizeTimeout)
    }
  }, [])

  return {
    deviceType,
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop',
    width,
  }
}
