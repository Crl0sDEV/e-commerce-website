'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useParams } from 'next/navigation'
import { Printer, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

type OrderItem = {
  id: string
  quantity: number
  price_at_purchase: number
  products: {
    name: string
    image_url: string
  }
}

type Order = {
  id: string
  created_at: string
  customer_name: string
  customer_address: string
  customer_contact: string
  total_amount: number
  discount_amount: number
  status: string
  order_items: OrderItem[]
}

export default function PrintInvoicePage() {
  const params = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      if (!params.id) return

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (name, image_url)
          )
        `)
        .eq('id', params.id)
        .single()

      if (error) {
        alert('Order not found')
      } else {
        setOrder(data as unknown as Order)
      }
      setLoading(false)
    }

    fetchOrder()
  }, [params.id])

  if (loading) return <div className="p-10 text-center">Loading Invoice...</div>
  if (!order) return <div className="p-10 text-center">Order not found.</div>

  // Calculate Subtotal (Total + Discount) because we only stored the final total
  const subTotal = order.total_amount + (order.discount_amount || 0)

  return (
    <div className="min-h-screen bg-gray-100 p-8 print:p-0 print:bg-white">
      
      {/* --- NAVIGATION (HIDDEN WHEN PRINTING) --- */}
      <div className="max-w-3xl mx-auto mb-6 flex justify-between items-center print:hidden">
        <Link href="/admin/orders" className="flex items-center text-gray-600 hover:text-black">
          <ArrowLeft size={20} className="mr-2"/> Back to Orders
        </Link>
        <button 
          onClick={() => window.print()}
          className="bg-black text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-800 transition"
        >
          <Printer size={20} /> Print Invoice
        </button>
      </div>

      {/* --- INVOICE PAPER --- */}
      <div className="max-w-3xl mx-auto bg-white p-10 shadow-lg rounded-xl print:shadow-none print:w-full print:max-w-none">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-gray-200 pb-8 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">INVOICE</h1>
            <p className="text-gray-500 mt-1">Order ID: <span className="font-mono text-black">{order.id}</span></p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold">BossStore Inc.</h2>
            <p className="text-sm text-gray-500">123 Boss Street, Metro Manila</p>
            <p className="text-sm text-gray-500">support@bossstore.com</p>
          </div>
        </div>

        {/* Customer Details */}
        <div className="grid grid-cols-2 gap-10 mb-10">
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Bill To</h3>
            <p className="font-bold text-gray-900 text-lg">{order.customer_name}</p>
            <p className="text-gray-600">{order.customer_contact}</p>
            <p className="text-gray-600">{order.customer_address}</p>
          </div>
          <div className="text-right">
             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Details</h3>
             <div className="space-y-1">
                <div className="flex justify-between">
                   <span className="text-gray-600">Date:</span>
                   <span className="font-medium">{new Date(order.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                   <span className="text-gray-600">Status:</span>
                   <span className="font-medium uppercase">{order.status}</span>
                </div>
                <div className="flex justify-between">
                   <span className="text-gray-600">Payment:</span>
                   <span className="font-medium">COD</span>
                </div>
             </div>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full mb-8">
          <thead>
            <tr className="border-b-2 border-gray-900 text-left">
              <th className="py-3 font-bold text-gray-900">Item Description</th>
              <th className="py-3 font-bold text-gray-900 text-center">Qty</th>
              <th className="py-3 font-bold text-gray-900 text-right">Price</th>
              <th className="py-3 font-bold text-gray-900 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {order.order_items.map((item) => (
              <tr key={item.id}>
                <td className="py-4">
                  <p className="font-medium text-gray-900">{item.products?.name}</p>
                </td>
                <td className="py-4 text-center text-gray-600">{item.quantity}</td>
                <td className="py-4 text-right text-gray-600">₱{item.price_at_purchase.toLocaleString()}</td>
                <td className="py-4 text-right font-bold text-gray-900">
                  ₱{(item.quantity * item.price_at_purchase).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end border-t border-gray-200 pt-6">
          <div className="w-1/2 space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>₱{subTotal.toLocaleString()}</span>
            </div>
            {order.discount_amount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-₱{order.discount_amount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between text-2xl font-extrabold text-gray-900 pt-4 border-t border-gray-100">
              <span>Total Due</span>
              <span>₱{order.total_amount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-100 text-center text-gray-400 text-sm">
          <p>Thank you for your business!</p>
          <p>If you have any questions about this invoice, please contact support.</p>
        </div>

      </div>
    </div>
  )
}