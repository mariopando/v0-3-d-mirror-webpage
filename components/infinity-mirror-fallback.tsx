export default function InfinityMirrorFallback() {
  return (
    <div className="w-[400px] h-[400px] bg-black rounded-lg overflow-hidden shadow-2xl flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p className="text-gray-400">Cargando visualización 3D...</p>
      </div>
    </div>
  )
}
