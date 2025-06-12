import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">TallerDigital</h3>
            <p className="mb-4">
              Creando impresionantes espejos infinitos con materiales premium y tecnología LED de vanguardia.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-purple-400 transition-colors">
                <Facebook size={20} />
              </Link>
              <Link href="#" className="hover:text-purple-400 transition-colors">
                <Twitter size={20} />
              </Link>
              <Link href="#" className="hover:text-purple-400 transition-colors">
                <Instagram size={20} />
              </Link>
              <Link href="#" className="hover:text-purple-400 transition-colors">
                <Youtube size={20} />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">Tienda</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/productos" className="hover:text-purple-400 transition-colors">
                  Todos los Productos
                </Link>
              </li>
              <li>
                <Link href="/productos/personalizados" className="hover:text-purple-400 transition-colors">
                  Espejos Personalizados
                </Link>
              </li>
              <li>
                <Link href="/productos/controladores" className="hover:text-purple-400 transition-colors">
                  Controladores LED
                </Link>
              </li>
              <li>
                <Link href="/productos/accesorios" className="hover:text-purple-400 transition-colors">
                  Accesorios
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">Soporte</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="hover:text-purple-400 transition-colors">
                  Preguntas Frecuentes
                </Link>
              </li>
              <li>
                <Link href="/envios" className="hover:text-purple-400 transition-colors">
                  Envíos
                </Link>
              </li>
              <li>
                <Link href="/devoluciones" className="hover:text-purple-400 transition-colors">
                  Devoluciones
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="hover:text-purple-400 transition-colors">
                  Contáctanos
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">Contacto</h4>
            <address className="not-italic">
              <p>Av. Providencia 1234</p>
              <p>Santiago, Chile</p>
              <p className="mt-2">info@tallerdigital.cl</p>
              <p>+56 2 2123 4567</p>
            </address>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between">
          <p>&copy; 2023 TallerDigital. Todos los derechos reservados.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/privacidad" className="hover:text-purple-400 transition-colors">
              Política de Privacidad
            </Link>
            <Link href="/terminos" className="hover:text-purple-400 transition-colors">
              Términos de Servicio
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
