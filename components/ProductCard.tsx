'use client'

import { Product } from '@/types'
import useCartStore from '@/store/useCartStore'
import { ShoppingCart } from 'lucide-react'
import Image from 'next/image'

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Kunin ang addItem function sa ating Zustand store
  const addItem = useCartStore((state) => state.addItem)

  return (
    <div className="group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      
      {/* Product Image */}
      <div className="relative h-64 bg-gray-100 overflow-hidden">
        {/* <--- 2. GAMITIN ANG NEXT/IMAGE ---> */}
        <Image 
          src={product.image_url} 
          alt={product.name} 
          fill // Ito ang nagpuno sa container (relative h-64)
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" // Tumutulong sa browser na piliin ang tamang size
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Product Info */}
      <div className="p-5">
        <div className="mb-2">
          <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">
            {product.category || 'Item'}
          </p>
          <h3 className="font-bold text-lg text-gray-900 truncate">
            {product.name}
          </h3>
        </div>
        
        <p className="text-gray-600 text-sm line-clamp-2 mb-4 h-10">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-gray-900">
            ₱{product.price}
          </span>
          
          <button 
            onClick={() => addItem(product)}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 active:scale-95 transition-all text-sm font-medium"
          >
            <ShoppingCart size={16} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}