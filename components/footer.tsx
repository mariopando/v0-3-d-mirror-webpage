import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">InfinityMirrors</h3>
            <p className="mb-4">
              Creating stunning infinity mirrors with premium materials and cutting-edge LED technology.
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
            <h4 className="font-semibold mb-4 text-white">Shop</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="hover:text-purple-400 transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-purple-400 transition-colors">
                  Custom Mirrors
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-purple-400 transition-colors">
                  LED Controllers
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-purple-400 transition-colors">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="hover:text-purple-400 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-purple-400 transition-colors">
                  Shipping
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-purple-400 transition-colors">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-purple-400 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">Contact</h4>
            <address className="not-italic">
              <p>123 Mirror Street</p>
              <p>New York, NY 10001</p>
              <p className="mt-2">info@infinitymirrors.com</p>
              <p>+1 (555) 123-4567</p>
            </address>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between">
          <p>&copy; 2023 InfinityMirrors. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="#" className="hover:text-purple-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-purple-400 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
