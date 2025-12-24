'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Package, Truck, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import { Order } from '@/types'

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('')
  
  // 3. GAMITIN ANG "Order" TYPE IMBIS NA "any"
  const [order, setOrder] = useState<Order | null>(null)
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setOrder(null)

    if (!orderId.trim()) {
      setError('Please enter an Order ID')
      setLoading(false)
      return
    }

    try {
      // Fetch Order + Items
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (name, image_url)
          )
        `)
        .eq('id', orderId.trim()) 
        .single()

      if (error) throw error
      
      // Type assertion para maniwala si TS na tumutugma ito sa Order interface
      setOrder(data as unknown as Order)

    } catch (err) {
      console.error(err)
      setError('Order not found. Please check the ID and try again.')
    } finally {
      setLoading(false)
    }
  }

  // Visual Helpers...
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="text-yellow-500" size={48} />
      case 'shipped': return <Truck className="text-blue-500" size={48} />
      case 'delivered': return <CheckCircle className="text-green-500" size={48} />
      case 'cancelled': return <AlertCircle className="text-red-500" size={48} />
      default: return <Package className="text-gray-400" size={48} />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'shipped': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'delivered': return 'bg-green-100 text-green-700 border-green-200'
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-16 min-h-[80vh]">
      
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Track Your Order</h1>
        <p className="text-gray-500">Enter your Order ID found in your confirmation message.</p>
      </div>

      {/* --- SEARCH FORM --- */}
      <form onSubmit={handleTrack} className="max-w-lg mx-auto mb-12">
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="e.g. 550e8400-e29b..." 
            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black font-mono text-sm"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
          />
          <button 
            type="submit" 
            disabled={loading}
            className="bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 disabled:opacity-50 transition"
          >
            {loading ? 'Searching...' : 'Track'}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
      </form>

      {/* --- ORDER RESULT --- */}
      {order && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
          
          {/* Header Status */}
          <div className="p-8 border-b border-gray-100 flex flex-col items-center text-center bg-gray-50/50">
            <div className="mb-4 bg-white p-4 rounded-full shadow-sm">
              {getStatusIcon(order.status)}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 capitalize mb-1">
              Order {order.status}
            </h2>
            <p className="text-gray-500 text-sm mb-4">
              Updated: {new Date(order.created_at).toLocaleDateString()}
            </p>
            <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
          </div>

          {/* Customer & Items Details */}
          <div className="p-8">
            <div className="mb-6">
              <h3 className="font-bold text-gray-900 mb-2">Delivery Details</h3>
              <p className="text-gray-600">{order.customer_name}</p>
              <p className="text-gray-600">{order.customer_address}</p>
              <p className="text-gray-500 text-sm mt-1">{order.customer_contact}</p>
            </div>

            <h3 className="font-bold text-gray-900 mb-4">Order Items</h3>
            <div className="space-y-4">
              {/* Note: Dahil typed na si 'order', alam na ni TS na may 'order_items' ito */}
              {order.order_items?.map((item) => (
                <div key={item.id} className="flex items-center gap-4 border border-gray-100 p-3 rounded-lg">
                  
                  {/* --- FIXED IMAGE COMPONENT --- */}
                  <div className="relative w-12 h-12 bg-gray-100 rounded overflow-hidden shrink-0">
                     {item.products?.image_url && (
                        <Image 
                          src={item.products.image_url} 
                          alt={item.products.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                     )}
                  </div>
                  {/* ----------------------------- */}

                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.products?.name || 'Unknown Item'}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity} x ₱{item.price_at_purchase}</p>
                  </div>
                  <p className="font-bold text-gray-900">
                    ₱{item.quantity * item.price_at_purchase}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 mt-6 pt-4 flex justify-between items-center">
              <span className="text-gray-500">Total Amount</span>
              <span className="text-2xl font-bold text-gray-900">₱{order.total_amount}</span>
            </div>
          </div>

        </div>
      )}

    </main>
  )
}