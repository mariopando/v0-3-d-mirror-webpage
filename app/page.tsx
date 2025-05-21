"use client"
import dynamic from "next/dynamic"

// Import the component with no SSR
const InfiniteMirrorNoSSR = dynamic(() => import("@/components/infinite-mirror"), {
  ssr: false,
})

export default function Home() {
  return <InfiniteMirrorNoSSR />
}

// InfiniteMirror component code can be placed here if needed
