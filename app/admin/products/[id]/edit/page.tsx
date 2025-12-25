'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter, useParams } from 'next/navigation'
import { toast } from 'sonner'
import Link from 'next/link'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: 'Clothing'
  })

  // 1. Load Existing Data
  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) {
        toast.error('Product not found')
        router.push('/admin/products')
      } else {
        setFormData({
          name: data.name,
          description: data.description,
          price: data.price,
          stock: data.stock, // <--- Load Current Stock
          category: data.category || 'Clothing'
        })
      }
      setFetching(false)
    }

    if (params.id) fetchProduct()
  }, [params.id, router])


  // 2. Handle Update
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: formData.name,
          description: formData.description,
          price: Number(formData.price),
          stock: Number(formData.stock), // <--- UPDATE STOCK HERE
          category: formData.category
        })
        .eq('id', params.id)

      if (error) throw error

      toast.success('Product updated successfully!')
      router.push('/admin/products')

    } catch (error) {
      console.error(error)
      toast.error('Failed to update product')
    } finally {
      setLoading(false)
    }
  }

  // Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  if (fetching) return <div className="p-10 text-center">Loading product...</div>

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <Link href="/admin/products" className="flex items-center text-gray-500 mb-6 hover:text-black w-fit">
        <ArrowLeft size={20} className="mr-2"/> Back to Inventory
      </Link>

      <h1 className="text-3xl font-bold mb-8">Edit Product</h1>

      <form onSubmit={handleUpdate} className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-6">
        
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
          <input name="name" required type="text" value={formData.name} onChange={handleChange} className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-black" />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea name="description" required rows={3} value={formData.description} onChange={handleChange} className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-black resize-none" />
        </div>

        {/* Grid for Numbers */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (₱)</label>
            <input name="price" required type="number" step="0.01" value={formData.price} onChange={handleChange} className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-black" />
          </div>

          {/* --- STOCK FIELD --- */}
          <div className="bg-blue-50 p-2 rounded-lg border border-blue-100">
            <label className="block text-sm font-bold text-blue-800 mb-1">Stock Level (Restock Here)</label>
            <input 
              name="stock" 
              required 
              type="number" 
              min="0"
              value={formData.stock} 
              onChange={handleChange} 
              className="w-full border border-blue-200 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-bold text-lg" 
            />
            <p className="text-xs text-blue-600 mt-1">Change this number to update inventory.</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select name="category" value={formData.category} onChange={handleChange} className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-black">
            <option value="Clothing">Clothing</option>
            <option value="Shoes">Shoes</option>
            <option value="Accessories">Accessories</option>
            <option value="Electronics">Electronics</option>
          </select>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-black text-white font-bold py-4 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin"/> : <Save size={20}/>}
          Update Product
        </button>

      </form>
    </main>
  )
}