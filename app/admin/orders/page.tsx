'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Order } from '@/types'
import { Package, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function AdminOrdersPage() {
  // STRICT TYPING: Sinasabi natin na array of 'Order' ito
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  // FIX: Wrap fetchOrders in useCallback para stable siya at pwede ilagay sa dependency array
  // Or better yet, define it inside useEffect if once lang tatawagin.
  // Pero since tatawagin natin siya after update, useCallback is best.
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            quantity,
            price_at_purchase,
            products (
              *
            )
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Type Assertion: Sinasabi natin kay TS na "Trust me, Order[] ito"
      // Kasi minsan hindi perfect ang auto-detect ng Supabase sa complex joins
      setOrders(data as unknown as Order[])
      
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // useEffect now depends on fetchOrders (stable due to useCallback)
  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  // Update Status Function
  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)

      if (error) throw error

      // Refresh list after successful update
      fetchOrders()
      toast.success(`Order updated to ${newStatus}`)
      
    } catch (error) {
      console.error('Update failed:', error)
      toast.warning('Failed to update status.')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'shipped': return 'bg-blue-100 text-blue-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) return <div className="p-10 text-center">Loading orders...</div>

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">

<Link href="/admin/dashboard" className="flex items-center text-gray-500 mb-6 hover:text-black w-fit">
    <ArrowLeft size={20} className="mr-2"/> Back to Dashboard
  </Link>
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <Package className="text-black" /> Order Management
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full bg-white border border-gray-200 rounded-lg shadow-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-left font-medium text-gray-500">Order ID / Date</th>
              <th className="p-4 text-left font-medium text-gray-500">Customer</th>
              <th className="p-4 text-left font-medium text-gray-500">Items</th>
              <th className="p-4 text-left font-medium text-gray-500">Total</th>
              <th className="p-4 text-left font-medium text-gray-500">Status</th>
              <th className="p-4 text-left font-medium text-gray-500">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition">
                
                {/* ID & Date */}
                <td className="p-4 align-top">
                  <p className="font-mono text-xs text-gray-400 mb-1">{order.id.slice(0, 8)}...</p>
                  <p className="text-sm font-medium">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(order.created_at).toLocaleTimeString()}
                  </p>
                </td>

                {/* Customer Details */}
                <td className="p-4 align-top">
                  <p className="font-bold text-gray-900">{order.customer_name}</p>
                  <p className="text-sm text-gray-600">{order.customer_contact}</p>
                  <p className="text-xs text-gray-500 mt-1 max-w-50">{order.customer_address}</p>
                </td>

                {/* Items List (STRICT TYPE SAFE NA ITO) */}
                <td className="p-4 align-top">
                  <div className="space-y-1">
                    {order.order_items?.map((item) => (
                      <div key={item.id} className="text-sm flex justify-between gap-4">
                        <span className="text-gray-700">
                          {item.quantity}x {item.products?.name || 'Unknown Item'}
                        </span>
                      </div>
                    ))}
                  </div>
                </td>

                {/* Total */}
                <td className="p-4 align-top font-bold text-gray-900">
                  ₱{order.total_amount}
                </td>

                {/* Status Badge */}
                <td className="p-4 align-top">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>

                {/* Actions (Dropdown) */}
                <td className="p-4 align-top">
                  <select 
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
                  >
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>

              </tr>
            ))}

            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="p-10 text-center text-gray-500">
                  Wala pang orders boss.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  )
}