"use client"

import Link from "next/link"
import { ShoppingCart, Menu, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useCart } from "@/context/cart-context"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { items } = useCart()

  const totalItems = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-background/95">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text"
          >
            TallerModerno
          </Link>
        </div>

        <nav
          className={`${
            isMenuOpen
              ? "flex flex-col absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border p-4 space-y-4 md:space-y-0"
              : "hidden"
          } md:flex md:items-center md:space-x-6 md:static md:bg-transparent md:p-0 md:border-0`}
        >
          <Link href="/" className="text-foreground hover:text-purple-400 transition-colors">
            Inicio
          </Link>
          <Link href="/productos" className="text-foreground hover:text-purple-400 transition-colors">
            Productos
          </Link>
          <Link href="/aplicaciones" className="text-foreground hover:text-purple-400 transition-colors">
            Aplicaciones
          </Link>
          <Link href="/nosotros" className="text-foreground hover:text-purple-400 transition-colors">
            Nosotros
          </Link>
          <Link href="/contacto" className="text-foreground hover:text-purple-400 transition-colors">
            Contacto
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
          <Link href="/usuario">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/carrito">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile theme toggle */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border p-4 bg-background/95 backdrop-blur-sm">
          <div className="flex items-center justify-center">
            <ThemeToggle />
          </div>
        </div>
      )}
    </header>
  )
}
