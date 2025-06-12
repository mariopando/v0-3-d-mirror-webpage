import Link from "next/link"
import { ShoppingCart, Menu, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  return (
    <header className="bg-black border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text"
          >
            InfinityMirrors
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-white hover:text-purple-400 transition-colors">
            Home
          </Link>
          <Link href="#products" className="text-white hover:text-purple-400 transition-colors">
            Products
          </Link>
          <Link href="#gallery" className="text-white hover:text-purple-400 transition-colors">
            Gallery
          </Link>
          <Link href="#about" className="text-white hover:text-purple-400 transition-colors">
            About
          </Link>
          <Link href="#contact" className="text-white hover:text-purple-400 transition-colors">
            Contact
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <ShoppingCart className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
