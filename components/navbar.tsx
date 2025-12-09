"use client"

import React from "react"
import Link from "next/link"
import { ShoppingCart, Menu, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useCart } from "@/context/cart-context"
import { ThemeToggle } from "@/components/theme-toggle"

const Navbar = React.memo(function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { items } = useCart()

  const totalItems = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <header className="bg-transparent border-b border-border sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/">
            <div className="brand-name">
              <div className="cosmic" style={{ "--color": "#23b1d8", "--size": "40px", "--font-size": "28px" } as React.CSSProperties} data-text="A">
                <span>A</span>
              </div>
              <div className="cosmic" style={{ "--color": "#dc5fe2", "--size": "40px", "--font-size": "28px" } as React.CSSProperties} data-text="r">
                <span>r</span>
              </div>
              <div className="cosmic" style={{ "--color": "#b733f9", "--size": "40px", "--font-size": "28px" } as React.CSSProperties} data-text="t">
                <span>t</span>
              </div>
              <div className="cosmic" style={{ "--color": "#a0de59", "--size": "40px", "--font-size": "28px" } as React.CSSProperties} data-text="e">
                <span>e</span>
              </div>
              <div className="cosmic" style={{ "--color": "#83d1ad", "--size": "40px", "--font-size": "28px" } as React.CSSProperties} data-text="s">
                <span>s</span>
              </div>
              <div className="cosmic" style={{ "--color": "#f7b500", "--size": "40px", "--font-size": "28px" } as React.CSSProperties} data-text="a">
                <span>a</span>
              </div>
              <div className="cosmic" style={{ "--color": "#ff6b9d", "--size": "40px", "--font-size": "28px" } as React.CSSProperties} data-text="n">
                <span>n</span>
              </div>
              <div className="cosmic" style={{ "--color": "#c44a8b", "--size": "40px", "--font-size": "28px" } as React.CSSProperties} data-text="o">
                <span>o</span>
              </div>
              <div className="cosmic space" style={{ "--color": "#23b1d8", "--size": "40px", "--font-size": "28px", "padding": "0 5px" } as React.CSSProperties} data-text=" ">
                <span> </span>
              </div>
              <div className="cosmic" style={{ "--color": "#dc5fe2", "--size": "40px", "--font-size": "28px" } as React.CSSProperties} data-text="D">
                <span>D</span>
              </div>
              <div className="cosmic" style={{ "--color": "#b733f9", "--size": "40px", "--font-size": "28px" } as React.CSSProperties} data-text="i">
                <span>i</span>
              </div>
              <div className="cosmic" style={{ "--color": "#a0de59", "--size": "40px", "--font-size": "28px" } as React.CSSProperties} data-text="g">
                <span>g</span>
              </div>
              <div className="cosmic" style={{ "--color": "#83d1ad", "--size": "40px", "--font-size": "28px" } as React.CSSProperties} data-text="i">
                <span>i</span>
              </div>
              <div className="cosmic" style={{ "--color": "#f7b500", "--size": "40px", "--font-size": "28px" } as React.CSSProperties} data-text="t">
                <span>t</span>
              </div>
              <div className="cosmic" style={{ "--color": "#ff6b9d", "--size": "40px", "--font-size": "28px" } as React.CSSProperties} data-text="a">
                <span>a</span>
              </div>
              <div className="cosmic" style={{ "--color": "#c44a8b", "--size": "40px", "--font-size": "28px" } as React.CSSProperties} data-text="l">
                <span>l</span>
              </div>
            </div>
          </Link>
        </div>

        <nav
          className={`flex flex-col md:flex-row absolute md:static top-16 md:top-auto 
            left-0 md:left-auto right-0 md:right-auto
            bg-background/95 md:bg-transparent
            transition-all duration-300 ease-in-out
            ${isMenuOpen ? "max-h-96" : "max-h-0 md:max-h-none"} 
            overflow-hidden md:overflow-visible
            border-b md:border-0 border-border
            backdrop-blur-sm md:backdrop-blur-none
            md:items-center md:space-x-6 md:p-0 p-4 space-y-4 md:space-y-0`}
        >
          <Link href="/" className="text-foreground hover:text-purple-400 transition-colors">
            Inicio
          </Link>
          <Link href="/servicios" className="text-foreground hover:text-purple-400 transition-colors">
            Servicios
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
})

export default Navbar
