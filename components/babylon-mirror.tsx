"use client"

// This component has been replaced with anime-mirror.tsx for better mobile performance
// Babylon.js removed in favor of lightweight anime.js animations

import React from "react"

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
  return <div className="w-full max-w-sm mx-auto p-4 text-center text-muted-foreground">Component deprecated</div>
})

export default BabylonMirror
