'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { toast } from 'sonner'
import Link from 'next/link'
import { ArrowLeft, Tag } from 'lucide-react'

export default function AdminCouponsPage() {
  const [loading, setLoading] = useState(false)

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    
    // Kunin ang data at gawing uppercase ang code (e.g. "welcome10" -> "WELCOME10")
    const code = (formData.get('code') as string).toUpperCase().trim()
    const percentage = Number(formData.get('percentage'))

    try {
      const { error } = await supabase
        .from('coupons')
        .insert([{ code, discount_percentage: percentage }])

      if (error) throw error

      toast.success(`Coupon ${code} created!`)
      // Reset form manually or reload (Simple approach: reload)
      window.location.reload()

    } catch (error) {
      console.error(error)
      toast.error('Failed to create coupon. Baka meron na niyan?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <Link href="/admin/dashboard" className="flex items-center text-gray-500 mb-6 hover:text-black">
        <ArrowLeft size={20} className="mr-2"/> Back to Dashboard
      </Link>

      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <Tag className="text-black"/> Create Promo Code
      </h1>

      <form onSubmit={handleCreate} className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
          <input 
            name="code" 
            required 
            type="text" 
            placeholder="e.g. WELCOME10" 
            className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-black uppercase font-mono" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Discount Percentage (%)</label>
          <input 
            name="percentage" 
            required 
            type="number" 
            min="1" 
            max="100"
            placeholder="e.g. 10" 
            className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-black" 
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition"
        >
          {loading ? 'Creating...' : 'Create Coupon'}
        </button>
      </form>
    </main>
  )
}