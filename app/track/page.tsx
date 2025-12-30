'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Package, Truck, CheckCircle, Clock, AlertCircle, Search, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react' // Needed for useSearchParams

// --- 1. DEFINE TYPES LOCALLY (Para hindi ka na gumawa ng separate file) ---
interface OrderItem {
  id: string
  quantity: number
  price_at_purchase: number
  products: {
    name: string
    image_url: string
  } | null
}

interface Order {
  id: string
  created_at: string
  status: string
  customer_name: string
  customer_address: string
  customer_contact: string
  payment_method: string
  subtotal: number
  discount_amount: number
  total_amount: number
  order_items: OrderItem[]
}

// --- MAIN COMPONENT CONTENT ---
function TrackOrderContent() {
  const searchParams = useSearchParams()
  const urlOrderId = searchParams.get('id') // Kunin ang ID sa URL

  const [orderId, setOrderId] = useState('')
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // 2. REUSABLE FETCH FUNCTION
  const fetchOrderData = useCallback(async (idToTrack: string) => {
    if (!idToTrack) return

    setLoading(true)
    setError('')
    setOrder(null)

    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (name, image_url)
          )
        `)
        .eq('id', idToTrack.trim())
        .single()

      if (error) throw error
      
      setOrder(data as unknown as Order)
    } catch (err) {
      console.error(err)
      setError('Order not found. Please check the ID and try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  // 3. AUTO-SEARCH EFFECT (Pag may ID sa URL)
  useEffect(() => {
    if (urlOrderId) {
        setOrderId(urlOrderId) // Set input value
        fetchOrderData(urlOrderId) // Auto fetch
    }
  }, [urlOrderId, fetchOrderData])

  // 4. MANUAL SEARCH HANDLER
  const handleManualTrack = (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderId.trim()) {
        setError('Please enter an Order ID')
        return
    }
    fetchOrderData(orderId)
  }

  // Visual Helpers
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="text-yellow-500" size={48} />
      case 'paid': return <CheckCircle className="text-blue-500" size={48} />
      case 'shipped': return <Truck className="text-purple-500" size={48} />
      case 'delivered': return <CheckCircle className="text-green-500" size={48} />
      case 'cancelled': return <AlertCircle className="text-red-500" size={48} />
      default: return <Package className="text-gray-400" size={48} />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'paid': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'shipped': return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'delivered': return 'bg-green-100 text-green-700 border-green-200'
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 min-h-[80vh]">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2 flex items-center justify-center gap-2">
          <Package className="text-black"/> Track Your Order
        </h1>
        <p className="text-gray-500">
          Enter your Order ID found in your confirmation message.
        </p>
      </div>

      {/* --- SEARCH FORM --- */}
      <form onSubmit={handleManualTrack} className="max-w-lg mx-auto mb-12">
        <div className="flex gap-2 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
             <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="e.g. 550e8400-e29b..."
            className="flex-1 border border-gray-300 rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-black font-mono text-sm shadow-sm"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 disabled:opacity-50 transition shadow-sm"
          >
            {loading ? "Searching..." : "Track"}
          </button>
        </div>
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 text-sm justify-center animate-in fade-in slide-in-from-top-2">
             <AlertCircle size={16} /> {error}
          </div>
        )}
      </form>

      {/* --- ORDER RESULT --- */}
      {order && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
          
          {/* Header Status */}
          <div className="p-8 border-b border-gray-100 flex flex-col items-center text-center bg-gray-50/50">
            <div className="mb-4 bg-white p-4 rounded-full shadow-sm border border-gray-100">
              {getStatusIcon(order.status)}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 capitalize mb-1">
              Order {order.status}
            </h2>
            <p className="text-gray-500 text-sm mb-4 font-mono">
              ID: {order.id.slice(0, 8)}...
            </p>
            <span
              className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusColor(
                order.status
              )}`}
            >
              {order.status}
            </span>
          </div>

          {/* Customer & Items Details */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 border-b border-gray-100 pb-8">
                <div>
                    <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">Customer Details</h3>
                    <div className="space-y-1 text-sm">
                        <p className="text-gray-500">Name</p>
                        <p className="font-medium text-gray-900 mb-2">{order.customer_name}</p>
                        
                        <p className="text-gray-500">Contact</p>
                        <p className="font-medium text-gray-900 mb-2">{order.customer_contact}</p>
                        
                        <p className="text-gray-500">Address</p>
                        <p className="font-medium text-gray-900">{order.customer_address}</p>
                    </div>
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">Payment Info</h3>
                    <div className="space-y-1 text-sm">
                         <p className="text-gray-500">Method</p>
                         <p className="font-medium text-gray-900 mb-2 uppercase">{order.payment_method}</p>
                         
                         <p className="text-gray-500">Date Placed</p>
                         <p className="font-medium text-gray-900">{new Date(order.created_at).toLocaleDateString()} {new Date(order.created_at).toLocaleTimeString()}</p>
                    </div>
                </div>
            </div>

            <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Items Ordered</h3>
            <div className="space-y-3">
              {order.order_items?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 border border-gray-100 p-3 rounded-lg hover:border-gray-300 transition"
                >
                  {/* Image */}
                  <div className="relative w-12 h-12 bg-gray-100 rounded overflow-hidden shrink-0">
                    {item.products?.image_url ? (
                      <Image
                        src={item.products.image_url}
                        alt={item.products.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                             <ShoppingBag size={20} />
                        </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="font-bold text-sm text-gray-900">
                      {item.products?.name || "Unknown Item"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.quantity} x ₱{item.price_at_purchase.toLocaleString()}
                    </p>
                  </div>
                  <p className="font-bold text-sm text-gray-900">
                    ₱{(item.quantity * item.price_at_purchase).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-6 pt-4 space-y-2 text-sm border-t border-gray-100">
                <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span>₱{order.subtotal.toLocaleString()}</span>
                </div>
                {order.discount_amount > 0 && (
                     <div className="flex justify-between text-green-600 font-medium">
                        <span>Discount</span>
                        <span>- ₱{order.discount_amount.toLocaleString()}</span>
                    </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t border-gray-100 mt-2">
                    <span className="font-bold text-gray-900 text-lg">Total</span>
                    <span className="font-bold text-gray-900 text-lg">₱{order.total_amount.toLocaleString()}</span>
                </div>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

// --- MAIN PAGE WITH SUSPENSE ---
export default function TrackOrderPage() {
    return (
        <Suspense fallback={<div className="p-20 text-center">Loading...</div>}>
            <TrackOrderContent />
        </Suspense>
    )
}