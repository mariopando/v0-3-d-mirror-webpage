import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils"

// Datos de productos de muestra
const products = [
  {
    id: "service-1",
    name: "Muebles inteligentes y modernos",
    description: "La perfecta fusión entre maderas nobles y tecnología: desde un espejo personalizado con efecto infinito hasta piezas que combinan lo moderno con lo esencial. Diseñamos muebles inteligentes que elevan cualquier espacio con estética impecable y funcionalidad de última generación.",
    image: "/dMvb3BKmyKF2b3SZgZQqJF.png",
  },
    {
    id: "service-2",
    name: "Arquitectura de marca y mobiliario promocional",
    description: "Creamos instalaciones que convierten la arquitectura y el diseño en impacto de marca. Nuestro mobiliario publicitario atrae miradas, invita a interactuar y amplifica tu mensaje en cualquier entorno con presencia audaz y resultados medibles.",
    image: "/9ujUSEvAX8UsAUqr6SGP3U.png",
  },
    {
    id: "service-3",
    name: "Experiencias de usuario",
    description: "Diseñamos interacciones memorables entre personas y software, transformando procesos complejos en experiencias simples y agradables. Con enfoque humano, creamos flujos intuitivos que aumentan la satisfacción, la fidelidad y el rendimiento.",
    image: "/5qyCnLHGSBshSwNtbHgPuV.png",
  },
    {
    id: "service-4",
    name: "Aplicaciones y Software, para domótica y más",
    description: "Desarrollamos aplicaciones robustas y elegantes para domótica y otros ecosistemas digitales. Integramos seguridad, rendimiento y diseño para que controles tu mundo con facilidad, desde tu hogar conectado hasta soluciones empresariales escalables.",
    image: "/pPhgYEkhtcHP2hTW2sVUd8.png",
  },
    {
    id: "service-5",
    name: "Activaciones digitales interactivas y publicitarias",
    description: "Convertimos la interacción humano-ordenador en experiencias inmersivas que activan tu marca en canales digitales. Combinamos creatividad y tecnología para generar participación en tiempo real, aumentar el alcance y convertir curiosidad en acción.",
    image: "/V8nCt6nDGnd7tPdw2z8WWf.png",
  },
]

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Nuestros Servicios</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((service) => (
            <Link href={`/servicios/${service.id}`} key={service.id} className="group">
              <div className="bg-gray-900 rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-105">
                <div className="h-64 bg-gray-800 flex items-center justify-center">
                  {/* Placeholder image */}
                  <img
                    src={service.image || "/placeholder.svg"}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                  <p className="text-gray-400 mb-4">{service.description}</p>
                  <div className="flex justify-between items-center">
                    {/* <span className="text-xl font-bold">{formatCurrency(service.price)}</span> */}
                    {/* <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm">Ver detalles</span> */}
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
