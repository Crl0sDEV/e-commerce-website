'use client'

import { Product } from '@/types'
import useCartStore from '@/store/useCartStore'
import { ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link' // <--- IMPORT LINK

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)

  return (
    <div className="group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
      
      {/* 1. WRAP IMAGE IN LINK */}
      <Link href={`/product/${product.id}`} className="block relative h-64 bg-gray-100 overflow-hidden cursor-pointer">
        <Image 
          src={product.image_url} 
          alt={product.name} 
          fill 
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      <div className="p-5 flex flex-col flex-1">
        <div className="mb-2">
          <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">
            {product.category || 'Item'}
          </p>
          
          {/* 2. WRAP TITLE IN LINK */}
          <Link href={`/product/${product.id}`} className="hover:underline">
            <h3 className="font-bold text-lg text-gray-900 truncate">
              {product.name}
            </h3>
          </Link>
        </div>
        
        <p className="text-gray-600 text-sm line-clamp-2 mb-4 h-10">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-xl font-bold text-gray-900">
            ₱{product.price}
          </span>
          
          <button 
            onClick={() => addItem(product)}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 active:scale-95 transition-all text-sm font-medium"
          >
            <ShoppingCart size={16} />
            Add
          </button>
        </div>
      </div>
    </div>
  )
}