'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { Upload, Loader2, ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function AddProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  // UX State: Para makita kung anong file ang napili
  const [fileName, setFileName] = useState<string | null>(null)
  
  // Handler pag pumili ng file si user
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const price = formData.get('price') as string
    const category = formData.get('category') as string
    const description = formData.get('description') as string
    const imageFile = formData.get('image') as File

    try {
      let imageUrl = ''

      if (imageFile && imageFile.size > 0) {
        const filename = `${Date.now()}-${imageFile.name}`
        
        // FIX SA WARNING: Tinanggal na natin ang "data: uploadData"
        // Kinuha lang natin yung "error"
        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(filename, imageFile)

        if (uploadError) throw uploadError

        const { data: urlData } = supabase.storage
          .from('products')
          .getPublicUrl(filename)
          
        imageUrl = urlData.publicUrl
      }

      const { error: dbError } = await supabase
        .from('products')
        .insert([
          {
            name,
            price: Number(price),
            category,
            description,
            image_url: imageUrl,
          }
        ])

      if (dbError) throw dbError

      alert('Product added successfully!')
      router.push('/') 

    } catch (error) {
      console.error('Error adding product:', error)
      alert('May error boss. Check console.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <Link href="/admin/orders" className="flex items-center text-gray-500 mb-6 hover:text-black">
        <ArrowLeft size={20} className="mr-2"/> Back to Dashboard
      </Link>

      <h1 className="text-3xl font-bold mb-8">Add New Product</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
        
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
          <input name="name" required type="text" className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-black" placeholder="e.g. White T-Shirt" />
        </div>

        {/* Price & Category */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (₱)</label>
            <input name="price" required type="number" className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-black" placeholder="500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select name="category" className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-black">
              <option value="clothing">Clothing</option>
              <option value="accessories">Accessories</option>
              <option value="shoes">Shoes</option>
              <option value="electronics">Electronics</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea name="description" required rows={3} className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-black" placeholder="Product details..." />
        </div>

        {/* Image Upload Area (Updated UX) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
          
          <div className={`relative border-2 border-dashed rounded-lg p-6 text-center transition cursor-pointer 
            ${fileName ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:bg-gray-50'}`}>
            
            {/* Input File (Hidden pero functional) */}
            <input 
              name="image" 
              required 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} // <--- Dito nagbabago ang state
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
            />

            {/* Visual Feedback */}
            <div className="flex flex-col items-center justify-center space-y-2">
              {fileName ? (
                <>
                  <CheckCircle className="text-green-600 h-8 w-8" />
                  <p className="text-sm font-medium text-green-700 truncate max-w-50">
                    {fileName}
                  </p>
                  <p className="text-xs text-green-500">Click to change image</p>
                </>
              ) : (
                <>
                  <Upload className="text-gray-400 h-8 w-8" />
                  <p className="text-sm text-gray-500">Click to upload image</p>
                  <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                </>
              )}
            </div>

          </div>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" /> : 'Save Product'}
        </button>

      </form>
    </div>
  )
}