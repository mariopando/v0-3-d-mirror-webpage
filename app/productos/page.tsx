import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils"

// Datos de productos de muestra
const products = [
  {
    id: "espejo-cuadrado-60",
    name: "Espejo Infinito Cuadrado",
    description: "Espejo infinito cuadrado de 60x60cm con LEDs arcoíris",
    price: 220000,
    image: "/placeholder.svg?height=300&width=300",
    dimensions: "60cm × 60cm × 10cm",
    color: "Arcoíris",
  },
  {
    id: "espejo-rectangular-80",
    name: "Espejo Infinito Rectangular",
    description: "Espejo infinito rectangular de 80x50cm con LEDs blancos",
    price: 250000,
    image: "/placeholder.svg?height=300&width=300",
    dimensions: "80cm × 50cm × 10cm",
    color: "Blanco",
  },
  {
    id: "espejo-circular-70",
    name: "Espejo Infinito Circular",
    description: "Espejo infinito circular de 70cm de diámetro con LEDs azules",
    price: 280000,
    image: "/placeholder.svg?height=300&width=300",
    dimensions: "70cm × 70cm × 10cm",
    color: "Azul",
  },
  {
    id: "espejo-hexagonal-60",
    name: "Espejo Infinito Hexagonal",
    description: "Espejo infinito hexagonal de 60cm con LEDs verdes",
    price: 290000,
    image: "/placeholder.svg?height=300&width=300",
    dimensions: "60cm × 60cm × 10cm",
    color: "Verde",
  },
  {
    id: "espejo-personalizado",
    name: "Espejo Infinito Personalizado",
    description: "Diseña tu propio espejo infinito con dimensiones y colores personalizados",
    price: 180000,
    image: "/placeholder.svg?height=300&width=300",
    dimensions: "Personalizable",
    color: "Personalizable",
  },
  {
    id: "controlador-led",
    name: "Controlador LED RGB",
    description: "Controlador LED RGB con control remoto para espejos infinitos",
    price: 35000,
    image: "/placeholder.svg?height=300&width=300",
    dimensions: "10cm × 5cm × 2cm",
    color: "Negro",
  },
]

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Nuestros Productos</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Link href={`/productos/${product.id}`} key={product.id} className="group">
              <div className="bg-gray-900 rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-105">
                <div className="h-64 bg-gray-800 flex items-center justify-center">
                  {/* Placeholder image */}
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-400 mb-4">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">{formatCurrency(product.price)}</span>
                    <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm">Ver detalles</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  )
}
