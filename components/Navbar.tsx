'use client'

import Link from 'next/link'
import { Store, ShoppingCart } from 'lucide-react' // Import ShoppingCart for skeleton/loading
import dynamic from 'next/dynamic' // <--- Import Dynamic

// 1. Dynamic Import ng CartButton
// { ssr: false } = "Wag mo i-render sa server, sa browser na lang."
const CartButton = dynamic(() => import('./CartButton'), {
  ssr: false,
  // Optional: Loading state habang inaantay ang browser
  loading: () => (
    <div className="p-2 opacity-50">
      <ShoppingCart size={24} className="text-gray-400" />
    </div>
  )
})

export default function Navbar() {
  // Wala na tayong logic dito! Sobrang linis.
  
  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-black text-white p-1.5 rounded-lg group-hover:bg-gray-800 transition">
              <Store size={24} />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900">
              BossStore
            </span>
          </Link>

          {/* Cart Section */}
          <div>
            {/* Dito natin ilalagay ang Dynamic Component */}
            <CartButton />
          </div>

        </div>
      </div>
    </nav>
  )
}