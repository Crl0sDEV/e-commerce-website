'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useParams } from 'next/navigation'
import { Printer, ArrowLeft, Scissors } from 'lucide-react'
import Link from 'next/link'

type OrderItem = {
  id: string
  quantity: number
  price_at_purchase: number
  products: {
    name: string
    image_url: string
  } | null
}

type Order = {
  id: string
  created_at: string
  customer_name: string
  customer_address: string
  customer_contact: string
  total_amount: number
  subtotal: number // Added this based on previous steps
  discount_amount: number
  status: string
  payment_method: string
  payment_ref?: string | null // Added for GCash
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

  // --- AUTO PRINT TRIGGER ---
  useEffect(() => {
    if (!loading && order) {
      const timer = setTimeout(() => {
        window.print()
      }, 500) // Small delay to ensure styles are loaded
      return () => clearTimeout(timer)
    }
  }, [loading, order])

  if (loading) return <div className="p-10 text-center flex items-center justify-center gap-2">Loading Invoice...</div>
  if (!order) return <div className="p-10 text-center">Order not found.</div>

  // Fallback subtotal calculation if DB field is empty
  const subTotal = order.subtotal || (order.total_amount + (order.discount_amount || 0))

  return (
    <div className="min-h-screen bg-gray-100 p-8 print:p-0 print:bg-white text-black font-sans">
      
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
      <div className="max-w-3xl mx-auto bg-white p-10 shadow-lg rounded-xl print:shadow-none print:w-full print:max-w-none print:p-0">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-gray-300 pb-6 mb-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight uppercase">Invoice</h1>
            <p className="text-sm text-gray-500 mt-1 font-mono">#{order.id.toUpperCase().slice(0, 8)}</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold">BossStore Inc.</h2>
            <p className="text-sm text-gray-600">123 Boss Street, Metro Manila</p>
            <p className="text-sm text-gray-600">support@bossstore.com</p>
          </div>
        </div>

        {/* Customer & Order Details */}
        <div className="flex justify-between gap-10 mb-8">
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Bill To</h3>
            <p className="font-bold text-xl">{order.customer_name}</p>
            <p className="text-gray-700">{order.customer_contact}</p>
            <p className="text-gray-700 max-w-xs leading-tight">{order.customer_address}</p>
          </div>
          <div className="text-right min-w-50">
             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Details</h3>
             <div className="text-sm space-y-1">
                <div className="flex justify-between">
                   <span className="text-gray-600">Date:</span>
                   <span className="font-medium">{new Date(order.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                   <span className="text-gray-600">Method:</span>
                   <span className="font-bold uppercase">{order.payment_method}</span>
                </div>
                {order.payment_ref && (
                    <div className="flex justify-between">
                       <span className="text-gray-600">Ref No:</span>
                       <span className="font-mono">{order.payment_ref}</span>
                    </div>
                )}
             </div>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full mb-8 border-collapse">
          <thead>
            <tr className="border-b-2 border-black text-left">
              <th className="py-2 text-sm font-bold uppercase">Item</th>
              <th className="py-2 text-sm font-bold uppercase text-center">Qty</th>
              <th className="py-2 text-sm font-bold uppercase text-right">Price</th>
              <th className="py-2 text-sm font-bold uppercase text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {order.order_items.map((item) => (
              <tr key={item.id}>
                <td className="py-3 text-sm">
                  <p className="font-medium">{item.products?.name || 'Unknown Item'}</p>
                </td>
                <td className="py-3 text-sm text-center">{item.quantity}</td>
                <td className="py-3 text-sm text-right">₱{item.price_at_purchase.toLocaleString()}</td>
                <td className="py-3 text-sm text-right font-bold">
                  ₱{(item.quantity * item.price_at_purchase).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end mb-12">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>₱{subTotal.toLocaleString()}</span>
            </div>
            {order.discount_amount > 0 && (
              <div className="flex justify-between text-sm text-green-700">
                <span>Discount</span>
                <span>-₱{order.discount_amount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-xl font-extrabold border-t border-black pt-2 mt-2">
              <span>Total</span>
              <span>₱{order.total_amount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* --- WAYBILL CUTOUT (New Feature) --- */}
        <div className="border-t-2 border-dashed border-gray-400 pt-6 mt-8 print:break-inside-avoid">
          <div className="flex items-center gap-2 text-gray-500 mb-4">
              <Scissors size={16} />
              <span className="text-xs uppercase tracking-widest font-bold">Waybill Cutout (Attach to Parcel)</span>
          </div>
          
          <div className="border-2 border-black rounded-lg p-5 flex flex-row justify-between items-center bg-white">
              {/* Receiver Info */}
              <div className="flex-1">
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Deliver To</p>
                  <p className="text-2xl font-black leading-none mt-1">{order.customer_name}</p>
                  <p className="text-sm font-medium mt-2 max-w-sm leading-tight">{order.customer_address}</p>
                  <p className="text-sm mt-1 font-mono font-bold">📞 {order.customer_contact}</p>
              </div>

              {/* COD / Payment Info */}
              <div className="text-right border-l border-gray-300 pl-6 ml-6">
                   <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Amount to Collect</p>
                   
                   {order.payment_method === 'COD' ? (
                       <p className="text-4xl font-black mt-1">₱{order.total_amount.toLocaleString()}</p>
                   ) : (
                       <p className="text-3xl font-black mt-1 text-gray-800">PAID</p>
                   )}
                   
                   <div className="mt-2 inline-block bg-black text-white text-xs font-bold px-3 py-1 uppercase rounded-full">
                      {order.payment_method}
                   </div>
              </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-400 text-xs print:hidden">
          <p>System Generated Invoice • BossStore</p>
        </div>

      </div>
    </div>
  )
}