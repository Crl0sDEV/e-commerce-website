'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Loader2, Package, ChevronRight, Clock, ShoppingBag } from 'lucide-react'
import useUserStore from '@/store/useUserStore'

// Strict Types
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
  total_amount: number
  payment_method: string
  order_items: OrderItem[]
}

export default function MyOrdersPage() {
  const router = useRouter()
  const { user, loading: userLoading } = useUserStore()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. Check Auth
    if (!userLoading && !user) {
        router.push('/login')
        return
    }

    // 2. Fetch Orders
    const fetchOrders = async () => {
        if (!user) return

        try {
            const { data, error } = await supabase
                .from('orders')
                .select(`
                    id, 
                    created_at, 
                    status, 
                    total_amount, 
                    payment_method,
                    order_items (
                        id,
                        quantity,
                        price_at_purchase,
                        products (
                            name,
                            image_url
                        )
                    )
                `)
                .eq('user_id', user.id) // <--- CRITICAL: Filter by User ID
                .order('created_at', { ascending: false })

            if (error) throw error

            setOrders(data as unknown as Order[])
        } catch (error) {
            console.error('Error fetching orders:', error)
        } finally {
            setLoading(false)
        }
    }

    if (user) {
        fetchOrders()
    }
  }, [user, userLoading, router])

  // Helper for Status Color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'paid': return 'bg-blue-100 text-blue-800'
      case 'shipped': return 'bg-purple-100 text-purple-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (userLoading || loading) {
    return (
        <div className="h-[60vh] flex items-center justify-center">
            <Loader2 className="animate-spin text-gray-400" size={32} />
        </div>
    )
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <Package className="text-black" /> Order History
        </h1>

        {orders.length === 0 ? (
            // --- EMPTY STATE ---
            <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="bg-white p-4 rounded-full inline-block mb-4 shadow-sm">
                    <ShoppingBag size={48} className="text-gray-300" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h2>
                <p className="text-gray-500 mb-6">Looks like you haven&apos;t bought anything yet.</p>
                <Link href="/" className="bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition">
                    Start Shopping
                </Link>
            </div>
        ) : (
            // --- ORDER LIST ---
            <div className="space-y-6">
                {orders.map((order) => (
                    <div key={order.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition duration-200">
                        
                        {/* HEADER: Date, ID, Status */}
                        <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100">
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold tracking-wide mb-1">Order Placed</p>
                                <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                                    <Clock size={14} className="text-gray-400"/>
                                    {new Date(order.created_at).toLocaleDateString()} 
                                    <span className="text-gray-300">|</span>
                                    <span className="font-mono text-gray-500">#{order.id.slice(0, 8)}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                                    {order.status}
                                </span>
                            </div>
                        </div>

                        {/* BODY: Items */}
                        <div className="p-6">
                            <div className="space-y-4">
                                {order.order_items.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                                            {item.products?.image_url ? (
                                                <Image 
                                                    src={item.products.image_url} 
                                                    alt={item.products.name} 
                                                    fill 
                                                    className="object-cover" 
                                                    sizes="64px"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                    <Package size={20} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-gray-900 line-clamp-1">{item.products?.name || 'Unknown Item'}</p>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                            <p className="text-sm font-medium mt-1">₱{item.price_at_purchase.toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* FOOTER: Total & Action */}
                        <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">Total Amount:</span>
                                <span className="text-lg font-bold text-gray-900">₱{order.total_amount.toLocaleString()}</span>
                                <span className="text-xs text-gray-400 font-medium bg-gray-100 px-2 py-1 rounded ml-2 uppercase">
                                    {order.payment_method}
                                </span>
                            </div>
                            
                            {/* Papunta sa existing Track page para makita full details */}
                            <Link 
                                href={`/track?id=${order.id}`} // Assuming your Track page accepts ?id= param or similar
                                className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm font-bold border border-gray-300 px-5 py-2.5 rounded-lg hover:bg-black hover:text-white transition"
                            >
                                View Details <ChevronRight size={16} />
                            </Link>
                        </div>

                    </div>
                ))}
            </div>
        )}
    </main>
  )
}