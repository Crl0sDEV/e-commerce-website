'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import Image from 'next/image'
import { Edit, Trash2, Plus, ArrowLeft, Package, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Product } from '@/types'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error(error)
        toast.error('Error loading products')
      } else {
        setProducts(data || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

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

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-gray-400" size={48} />
      </div>
    )
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <Link href="/admin/dashboard" className="flex items-center text-gray-500 mb-6 hover:text-black w-fit">
        <ArrowLeft size={20} className="mr-2"/> Back to Dashboard
      </Link>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Package className="text-black" /> Inventory
        </h1>
        <Link 
          href="/admin/products/add" 
          className="bg-black text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-800 transition"
        >
          <Plus size={20} /> Add New Product
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500">
            <tr>
              <th className="p-4">Image</th>
              <th className="p-4">Name</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {products.map((product) => {
              
              const stock = product.stock || 0 

              return (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="w-12 h-12 relative bg-gray-100 rounded overflow-hidden">
                      <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                    </div>
                  </td>
                  <td className="p-4 font-bold text-gray-900">{product.name}</td>
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
    </main>
  )
}