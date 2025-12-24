'use client'

import { useState } from 'react'
import { Product } from '@/types'
import ProductCard from '@/components/ProductCard'
import { Search, SlidersHorizontal, X } from 'lucide-react'

interface ProductGridProps {
  products: Product[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  // 1. Automatic na kunin ang lahat ng unique categories galing sa products
  // Para kung mag-add ka ng "Toys" sa admin, automatic lalabas dito.
  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category || 'Others')))]

  // 2. Filter Logic
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div>
      {/* --- SEARCH & FILTER SECTION --- */}
      <div className="mb-8 space-y-4">
        
        {/* Search Bar */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Category Buttons (Scrollable sa Mobile) */}
        <div className="flex gap-2 overflow-x-auto pb-2 justify-start sm:justify-center no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
                ${selectedCategory === cat 
                  ? 'bg-black text-white shadow-md' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-black'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* --- RESULTS SECTION --- */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">
          {selectedCategory === 'All' ? 'All Products' : selectedCategory}
        </h2>
        <span className="text-sm text-gray-500">
          {filteredProducts.length} items found
        </span>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        // Empty State pag walang nahanap
        <div className="text-center py-20 bg-gray-50 rounded-xl">
          <SlidersHorizontal className="mx-auto text-gray-300 mb-2" size={48} />
          <h3 className="text-lg font-bold text-gray-900">No products found</h3>
          <p className="text-gray-500">Try changing your search or category.</p>
          <button 
            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
            className="mt-4 text-black underline font-medium hover:text-gray-700"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  )
}