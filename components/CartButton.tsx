'use client'

import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import useCartStore from '@/store/useCartStore'

export default function CartButton() {
  const cart = useCartStore((state) => state.cart)
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0)

  return (

    <Link 
      href="/cart" 
      className="group p-2 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
    >

      <div className="relative">
        
        <ShoppingCart 
          size={24} 
          className="text-gray-600 group-hover:text-black transition" 
        />
        
        {/* Badge Counter */}
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white">
            {totalItems}
          </span>
        )}
        
      </div>

    </Link>
  )
}