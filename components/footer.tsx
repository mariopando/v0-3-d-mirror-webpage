import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border text-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 gradient-text">Taller Ideas</h3>
            <p className="mb-4 text-muted-foreground leading-relaxed">
              Creando impresionantes espejos infinitos con materiales premium y tecnología LED de vanguardia.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-purple-400 transition-colors">
                <Facebook size={20} />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-purple-400 transition-colors">
                <Twitter size={20} />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-purple-400 transition-colors">
                <Instagram size={20} />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-purple-400 transition-colors">
                <Youtube size={20} />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">Tienda</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/servicios" className="text-muted-foreground hover:text-purple-400 transition-colors">
                  Todos los Servicios
                </Link>
              </li>
              <li>
                <Link
                  href="/servicios/personalizados"
                  className="text-muted-foreground hover:text-purple-400 transition-colors"
                >
                  Espejos Personalizados
                </Link>
              </li>
              <li>
                <Link
                  href="/servicios/controladores"
                  className="text-muted-foreground hover:text-purple-400 transition-colors"
                >
                  Controladores LED
                </Link>
              </li>
              <li>
                <Link
                  href="/servicios/accesorios"
                  className="text-muted-foreground hover:text-purple-400 transition-colors"
                >
                  Accesorios
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">Soporte</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-purple-400 transition-colors">
                  Preguntas Frecuentes
                </Link>
              </li>
              <li>
                <Link href="/envios" className="text-muted-foreground hover:text-purple-400 transition-colors">
                  Envíos
                </Link>
              </li>
              <li>
                <Link href="/devoluciones" className="text-muted-foreground hover:text-purple-400 transition-colors">
                  Devoluciones
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-muted-foreground hover:text-purple-400 transition-colors">
                  Contáctanos
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">Contacto</h4>
            <address className="not-italic text-muted-foreground">
              <p>Av. Providencia 1234</p>
              <p>Santiago, Chile</p>
              <p className="mt-2">info@tallerdigital.cl</p>
              <p>+56 2 2123 4567</p>
            </address>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between">
          <p className="text-muted-foreground">&copy; 2023 Taller Ideas. Todos los derechos reservados.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/privacidad" className="text-muted-foreground hover:text-purple-400 transition-colors">
              Política de Privacidad
            </Link>
            <Link href="/terminos" className="text-muted-foreground hover:text-purple-400 transition-colors">
              Términos de Servicio
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
