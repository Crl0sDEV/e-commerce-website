'use client'

import { ShoppingCart } from 'lucide-react'
import useCartStore from '@/store/useCartStore'
import { Product } from '@/types'
import { useState } from 'react'

export default function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem)
  const [isAdded, setIsAdded] = useState(false)

  const handleAdd = () => {
    addItem(product)
    setIsAdded(true)
    // Reset yung text after 2 seconds para cool effect
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <button 
      onClick={handleAdd}
      className={`w-full py-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all transform active:scale-95
        ${isAdded ? 'bg-green-600 text-white' : 'bg-black text-white hover:bg-gray-800'}`}
    >
      {isAdded ? (
        <>Added to Cart!</>
      ) : (
        <>
          <ShoppingCart size={20} />
          Add to Cart - ₱{product.price}
        </>
      )}
    </button>
  )
}