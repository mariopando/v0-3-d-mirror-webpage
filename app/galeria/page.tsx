import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

// Datos de galería de muestra
const galleryItems = [
  {
    id: 1,
    title: "Espejo Infinito en Sala de Estar",
    image: "/placeholder.svg?height=400&width=600",
    description: "Espejo infinito con LEDs arcoíris instalado en una moderna sala de estar",
  },
  {
    id: 2,
    title: "Espejo Infinito en Dormitorio",
    image: "/placeholder.svg?height=400&width=600",
    description: "Espejo infinito rectangular con LEDs blancos en un dormitorio minimalista",
  },
  {
    id: 3,
    title: "Espejo Infinito en Oficina",
    image: "/placeholder.svg?height=400&width=600",
    description: "Espejo infinito circular con LEDs azules en una oficina corporativa",
  },
  {
    id: 4,
    title: "Espejo Infinito en Restaurante",
    image: "/placeholder.svg?height=400&width=600",
    description: "Espejo infinito personalizado con LEDs verdes en un restaurante de lujo",
  },
  {
    id: 5,
    title: "Espejo Infinito en Hotel",
    image: "/placeholder.svg?height=400&width=600",
    description: "Espejo infinito de gran formato con LEDs púrpura en el lobby de un hotel",
  },
  {
    id: 6,
    title: "Espejo Infinito en Tienda",
    image: "/placeholder.svg?height=400&width=600",
    description: "Espejo infinito con LEDs rosa en una tienda de moda",
  },
  {
    id: 7,
    title: "Instalación Personalizada",
    image: "/placeholder.svg?height=400&width=600",
    description: "Instalación personalizada de múltiples espejos infinitos para un evento",
  },
  {
    id: 8,
    title: "Espejo Infinito en Bar",
    image: "/placeholder.svg?height=400&width=600",
    description: "Espejo infinito con LEDs programables en un bar nocturno",
  },
]

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4 text-center">Galería de Instalaciones</h1>
        <p className="text-gray-400 text-center mb-8 max-w-2xl mx-auto">
          Explora nuestra galería de espejos infinitos instalados en diferentes espacios. Cada instalación es única y
          personalizada para adaptarse perfectamente al ambiente.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item) => (
            <div key={item.id} className="bg-gray-900 rounded-lg overflow-hidden">
              <div className="h-64 bg-gray-800">
                <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  )
}
