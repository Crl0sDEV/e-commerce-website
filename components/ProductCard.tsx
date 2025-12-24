'use client'

import { Product } from '@/types'
import useCartStore from '@/store/useCartStore'
import { ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)
  
  // Check kung ubos na
  const stockCount = product.stock || 0
  const isOutOfStock = stockCount <= 0

  return (
    <div className="group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col relative">
      
      {/* SOLD OUT BADGE */}
      {isOutOfStock && (
        <div className="absolute top-2 right-2 z-10 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
          SOLD OUT
        </div>
      )}

      <Link href={`/product/${product.id}`} className={`block relative h-64 bg-gray-100 overflow-hidden ${isOutOfStock ? 'opacity-60' : ''}`}>
        <Image 
          src={product.image_url} 
          alt={product.name} 
          fill 
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      <div className="p-5 flex flex-col flex-1">
        {/* ... (Title and Description code same as before) ... */}
        
        <div className="mb-2">
           <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">
            {product.category || 'Item'}
           </p>
           <Link href={`/product/${product.id}`} className="hover:underline">
            <h3 className="font-bold text-lg text-gray-900 truncate">{product.name}</h3>
           </Link>
        </div>
        
         <p className="text-gray-600 text-sm line-clamp-2 mb-4 h-10">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="text-xl font-bold text-gray-900">₱{product.price}</span>
            {/* Show Stock Count (Optional) */}
            {!isOutOfStock && stockCount <= 10 && (
               <p className="text-xs text-red-500 font-medium">Only {product.stock} left!</p>
            )}
          </div>
          
          <button 
            onClick={() => addItem(product)}
            disabled={isOutOfStock} // DISABLE BUTTON
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium
              ${isOutOfStock 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-black text-white hover:bg-gray-800 active:scale-95'}`}
          >
            <ShoppingCart size={16} />
            {isOutOfStock ? 'No Stock' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  )
}