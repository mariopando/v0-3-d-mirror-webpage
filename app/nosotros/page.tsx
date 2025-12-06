import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-center">Sobre Nosotros</h1>

          <div className="mb-12 bg-gray-900 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Nuestra Historia</h2>
            <p className="text-gray-300 mb-4">
              Taller Ideas nació en 2018 como un pequeño taller de diseño en Santiago de Chile, fundado por un grupo de
              ingenieros y artistas apasionados por la tecnología y el diseño. Lo que comenzó como un proyecto para
              crear piezas de arte digital para exposiciones locales, rápidamente evolucionó cuando descubrimos la
              fascinación que generaban nuestros espejos infinitos.
            </p>
            <p className="text-gray-300">
              Desde entonces, nos hemos especializado en la creación de espejos infinitos personalizados, combinando
              tecnología LED de vanguardia con diseño artesanal de alta calidad. Hoy, nuestros servicios se encuentran
              en hogares, oficinas, restaurantes y hoteles en todo Chile y Latinoamérica.
            </p>
          </div>

          <div className="mb-12 bg-gray-900 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Nuestra Misión</h2>
            <p className="text-gray-300">
              En Taller Ideas, nuestra misión es transformar espacios ordinarios en experiencias extraordinarias a
              través de nuestros espejos infinitos. Creemos que la tecnología y el arte pueden combinarse para crear
              piezas que no solo decoran, sino que también inspiran y fascinan.
            </p>
          </div>

          <div className="mb-12 bg-gray-900 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Nuestro Proceso</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="text-center">
                <div className="bg-purple-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <span className="font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">Diseño</h3>
                <p className="text-gray-400 text-sm">
                  Cada espejo comienza con un diseño personalizado según las especificaciones del cliente.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <span className="font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">Fabricación</h3>
                <p className="text-gray-400 text-sm">
                  Fabricamos artesanalmente cada componente con materiales de la más alta calidad.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <span className="font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">Instalación</h3>
                <p className="text-gray-400 text-sm">
                  Ofrecemos servicio de instalación profesional para garantizar resultados perfectos.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-12 bg-gray-900 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Nuestro Equipo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-gray-800 mx-auto mb-4"></div>
                <h3 className="font-semibold">Don Gabi</h3>
                <p className="text-gray-400 text-sm">Ideas a cambio de pelos, Director de arte gay</p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-gray-800 mx-auto mb-4"></div>
                <h3 className="font-semibold">Vicenta</h3>
                <p className="text-gray-400 text-sm">Constructor de cajitas gay</p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-gray-800 mx-auto mb-4"></div>
                <h3 className="font-semibold">Renata</h3>
                <p className="text-gray-400 text-sm">Constructor de cajitas gay</p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-gray-800 mx-auto mb-4"></div>
                <h3 className="font-semibold">Mario Pando</h3>
                <p className="text-gray-400 text-sm">CEO/CTO</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
