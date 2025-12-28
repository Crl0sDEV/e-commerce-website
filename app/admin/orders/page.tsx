'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Package, ArrowLeft, Printer, Search, Filter, CreditCard, Banknote, Clock, ChevronLeft, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

// CONSTANTS
const ITEMS_PER_PAGE = 10

interface OrderWithItems {
  id: string
  created_at: string
  customer_name: string
  customer_contact: string
  customer_address: string
  total_amount: number
  status: string
  payment_method: string | null
  payment_ref: string | null
  order_items: {
    id: string
    quantity: number
    products: { name: string } | null
  }[]
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [loading, setLoading] = useState(true)
  
  // PAGINATION & FILTER STATES
  const [page, setPage] = useState(1)
  const [totalOrders, setTotalOrders] = useState(0)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      
      // Calculate Pagination Range (e.g., Page 1: 0-9, Page 2: 10-19)
      const from = (page - 1) * ITEMS_PER_PAGE
      const to = from + ITEMS_PER_PAGE - 1

      // 1. Build Query
      let query = supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            quantity,
            products (name)
          )
        `, { count: 'exact' }) // Request total count for pagination logic
        .order('created_at', { ascending: false })
        .range(from, to) // <--- SERVER SIDE PAGINATION

      // 2. Apply Status Filter
      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus)
      }

      // 3. Apply Search Filter (Server-side)
      // Note: Searching by Name OR Contact Number
      if (search) {
        query = query.or(`customer_name.ilike.%${search}%,customer_contact.ilike.%${search}%`)
      }

      const { data, error, count } = await query

      if (error) throw error

      setOrders(data as unknown as OrderWithItems[])
      if (count !== null) setTotalOrders(count)
      
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Error loading orders')
    } finally {
      setLoading(false)
    }
  }, [page, filterStatus, search]) // Depend on Page, Filter, Search

  // Debounce Search & Reset Page
  useEffect(() => {
    const timeoutId = setTimeout(() => {
        fetchOrders()
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [fetchOrders])

  // Reset to Page 1 when Search/Filter changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value)
      setPage(1) // Reset to first page
  }
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setFilterStatus(e.target.value)
      setPage(1) // Reset to first page
  }

  // Update Status
  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)

      if (error) throw error
      fetchOrders()
      toast.success(`Order updated to ${newStatus}`)
    } catch (error) {
      toast.error('Failed to update status.')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'paid': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Pagination Logic
  const totalPages = Math.ceil(totalOrders / ITEMS_PER_PAGE)

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      
      {/* HEADER ROW */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <Link href="/admin/dashboard" className="flex items-center text-gray-500 mb-2 hover:text-black w-fit text-sm">
                <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold flex items-center gap-2">
                <Package className="text-black" /> Order Management
            </h1>
          </div>

          {/* CONTROLS */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
             {/* Search */}
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search name or phone..." 
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-black w-full text-sm"
                  value={search}
                  onChange={handleSearchChange}
                />
             </div>

             {/* Filter */}
             <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <select 
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-black appearance-none bg-white w-full cursor-pointer text-sm"
                  value={filterStatus}
                  onChange={handleFilterChange}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
             </div>
          </div>
      </div>

      <div className="overflow-x-auto pb-4">
        <table className="w-full bg-white border border-gray-200 rounded-lg shadow-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-left font-bold text-xs uppercase text-gray-500">Order ID / Date</th>
              <th className="p-4 text-left font-bold text-xs uppercase text-gray-500">Customer</th>
              <th className="p-4 text-left font-bold text-xs uppercase text-gray-500">Payment</th>
              <th className="p-4 text-left font-bold text-xs uppercase text-gray-500">Items</th>
              <th className="p-4 text-left font-bold text-xs uppercase text-gray-500">Total</th>
              <th className="p-4 text-center font-bold text-xs uppercase text-gray-500">Status</th>
              <th className="p-4 text-center font-bold text-xs uppercase text-gray-500">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
                <tr><td colSpan={7} className="p-10 text-center text-gray-500">Loading orders...</td></tr>
            ) : orders.length === 0 ? (
                <tr><td colSpan={7} className="p-10 text-center text-gray-500">No orders found.</td></tr>
            ) : orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition">
                
                {/* ID & Date */}
                <td className="p-4 align-top w-40">
                  <span className="font-mono text-xs font-bold text-gray-900 block bg-gray-100 px-2 py-0.5 rounded w-fit mb-1">
                    {order.id.slice(0, 8)}...
                  </span>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock size={10}/>
                    {new Date(order.created_at).toLocaleDateString()}
                  </div>
                </td>

                {/* Customer Details */}
                <td className="p-4 align-top w-48">
                  <p className="font-bold text-gray-900 text-sm">{order.customer_name}</p>
                  <p className="text-xs text-gray-600 mb-1">{order.customer_contact}</p>
                </td>

                {/* Payment Info */}
                <td className="p-4 align-top">
                    <div className="flex items-center gap-1 mb-1">
                        {order.payment_method === 'GCASH' 
                            ? <CreditCard size={14} className="text-blue-600"/> 
                            : <Banknote size={14} className="text-green-600"/>
                        }
                        <span className="text-xs font-bold text-gray-700">
                            {order.payment_method || 'COD'}
                        </span>
                    </div>
                    {order.payment_method === 'GCASH' && (
                        <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100 text-[10px] font-mono inline-block">
                            Ref: {order.payment_ref || 'N/A'}
                        </div>
                    )}
                </td>

                {/* Items List */}
                <td className="p-4 align-top">
                  <div className="space-y-1">
                    {order.order_items?.map((item) => (
                      <div key={item.id} className="text-xs flex justify-between gap-2 text-gray-600">
                        <span>• {item.quantity}x {item.products?.name || "Unknown"}</span>
                      </div>
                    ))}
                  </div>
                </td>

                {/* Total */}
                <td className="p-4 align-top">
                  <span className="font-bold text-gray-900 text-sm">₱{order.total_amount.toLocaleString()}</span>
                </td>

                {/* Status Badge */}
                <td className="p-4 align-top text-center">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="p-4 align-top text-center">
                  <div className="flex flex-col items-center gap-2">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-black cursor-pointer bg-white w-24"
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>

                      <Link
                        href={`/admin/orders/${order.id}/print`}
                        target="_blank"
                        className="text-xs text-gray-400 hover:text-black flex items-center gap-1 hover:underline"
                      >
                        <Printer size={12} /> Print
                      </Link>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- PAGINATION CONTROLS --- */}
      {totalOrders > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
             Showing <span className="font-bold text-black">{((page - 1) * ITEMS_PER_PAGE) + 1}</span> to <span className="font-bold text-black">{Math.min(page * ITEMS_PER_PAGE, totalOrders)}</span> of <span className="font-bold text-black">{totalOrders}</span> results
          </p>
          
          <div className="flex items-center gap-2">
             <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
             >
                <ChevronLeft size={16} />
             </button>
             
             <span className="text-sm font-medium px-2">
                Page {page} of {totalPages}
             </span>

             <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || loading}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
             >
                <ChevronRight size={16} />
             </button>
          </div>
        </div>
      )}

    </main>
  );
}