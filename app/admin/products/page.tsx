'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import Image from 'next/image'
import { Edit, Trash2, Plus, ArrowLeft, Package, Loader2, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { Product } from '@/types'

const ITEMS_PER_PAGE = 10

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // PAGINATION & FILTER STATES
  const [page, setPage] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)

      const from = (page - 1) * ITEMS_PER_PAGE
      const to = from + ITEMS_PER_PAGE - 1

      // 1. Build Query
      let query = supabase
        .from('products')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to)

      // 2. Search
      if (search) {
        query = query.ilike('name', `%${search}%`)
      }

      // 3. Filter
      if (categoryFilter !== 'all') {
        query = query.eq('category', categoryFilter)
      }

      const { data, error, count } = await query

      if (error) {
        console.error(error)
        toast.error('Error loading products')
      } else {
        setProducts(data || [])
        if (count !== null) setTotalProducts(count)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [page, search, categoryFilter])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
        fetchProducts()
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [fetchProducts])

  const handleSearchChange = (val: string) => {
      setSearch(val)
      setPage(1)
  }
  const handleFilterChange = (val: string) => {
      setCategoryFilter(val)
      setPage(1)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      toast.error('Failed to delete')
    } else {
      toast.success('Product deleted')
      fetchProducts()
    }
  }

  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE)

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <Link href="/admin/dashboard" className="flex items-center text-gray-500 mb-2 hover:text-black w-fit text-sm">
                <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold flex items-center gap-2">
                <Package className="text-black" /> Inventory
            </h1>
          </div>

          <Link 
            href="/admin/products/add" 
            className="bg-black text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-800 transition text-sm"
          >
            <Plus size={18} /> Add New Product
          </Link>
      </div>

      {/* CONTROLS */}
      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto mb-6">
            <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search products..." 
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-black w-full text-sm"
                    value={search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                />
            </div>

            <div className="relative flex-1 md:w-48">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <select 
                    className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-black appearance-none bg-white w-full cursor-pointer text-sm"
                    value={categoryFilter}
                    onChange={(e) => handleFilterChange(e.target.value)}
                >
                    <option value="all">All Categories</option>
                    <option value="clothing">Clothing</option>
                    <option value="shoes">Shoes</option>
                    <option value="electronics">Electronics</option>
                    <option value="accessories">Accessories</option>
                </select>
            </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-4">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500">
                <tr>
                <th className="p-4">Image</th>
                <th className="p-4">Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
                {loading ? (
                     <tr>
                        <td colSpan={6} className="p-10 text-center text-gray-500">
                            {/* DITO NATIN GINAMIT YUNG LOADER2 BOSS 👇 */}
                            <div className="flex justify-center items-center gap-2">
                                <Loader2 className="animate-spin text-black" size={20} />
                                <span>Loading inventory...</span>
                            </div>
                        </td>
                     </tr>
                ) : products.length === 0 ? (
                     <tr><td colSpan={6} className="p-10 text-center text-gray-500">No products found.</td></tr>
                ) : products.map((product) => {
                
                const stock = product.stock || 0 

                return (
                    <tr key={product.id} className="hover:bg-gray-50">
                    <td className="p-4">
                        <div className="w-12 h-12 relative bg-gray-100 rounded overflow-hidden border border-gray-200">
                           <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                        </div>
                    </td>
                    <td className="p-4 font-bold text-gray-900">{product.name}</td>
                    <td className="p-4 text-gray-500">
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs">{product.category}</span>
                    </td>
                    <td className="p-4">₱{product.price}</td>
                    
                    <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        stock === 0 ? 'bg-red-100 text-red-700' :
                        stock < 10 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                        }`}>
                        {stock} left
                        </span>
                    </td>

                    <td className="p-4 flex gap-2">
                        <Link 
                        href={`/admin/products/${product.id}/edit`} 
                        className="p-2 bg-gray-100 rounded-lg hover:bg-black hover:text-white transition"
                        title="Edit / Restock"
                        >
                        <Edit size={16} />
                        </Link>
                        <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition"
                        title="Delete"
                        >
                        <Trash2 size={16} />
                        </button>
                    </td>
                    </tr>
                )
                })}
            </tbody>
            </table>
        </div>
      </div>

      {/* PAGINATION */}
      {totalProducts > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-4">
          <p className="text-sm text-gray-500">
             Showing <span className="font-bold text-black">{((page - 1) * ITEMS_PER_PAGE) + 1}</span> to <span className="font-bold text-black">{Math.min(page * ITEMS_PER_PAGE, totalProducts)}</span> of <span className="font-bold text-black">{totalProducts}</span> items
          </p>
          
          <div className="flex items-center gap-2">
             <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
             >
                <ChevronLeft size={16} />
             </button>
             
             <span className="text-sm font-medium px-2">
                Page {page} of {totalPages}
             </span>

             <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || loading}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
             >
                <ChevronRight size={16} />
             </button>
          </div>
        </div>
      )}

    </main>
  )
}