'use client'

import { ShoppingCart } from 'lucide-react'
import useCartStore from '@/store/useCartStore'
import { Product } from '@/types'
import { useState } from 'react'

export default function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem)
  const [isAdded, setIsAdded] = useState(false)
  
  const stockCount = product.stock || 0
  const isOutOfStock = stockCount <= 0

  const handleAdd = () => {
    if (isOutOfStock) return
    addItem(product)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <button 
      onClick={handleAdd}
      disabled={isOutOfStock}
      className={`w-full py-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all transform 
        ${isOutOfStock 
          ? 'bg-gray-200 text-gray-500 cursor-not-allowed' // Style pag sold out
          : isAdded 
            ? 'bg-green-600 text-white' 
            : 'bg-black text-white hover:bg-gray-800 active:scale-95'
        }`}
    >
      {isOutOfStock ? (
        'Sold Out'
      ) : isAdded ? (
        'Added to Cart!'
      ) : (
        <>
          <ShoppingCart size={20} />
          Add to Cart - ₱{product.price}
        </>
      )}
    </button>
  )
}