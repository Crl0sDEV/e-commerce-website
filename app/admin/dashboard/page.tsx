'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { ArrowRight, DollarSign, Package, ShoppingBag, TrendingUp, AlertTriangle, User, Clock } from 'lucide-react'
import Link from 'next/link'
import OverviewChart from '@/components/OverviewChart'

// Define Order Type para safe sa TypeScript
type Order = {
  id: string
  customer_name: string
  total_amount: number
  status: string
  created_at: string
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    lowStockCount: 0
  })

  // Function to fetch all dashboard data
  const fetchDashboardData = async () => {
    try {
      // 1. Get Stats (Orders & Products)
      const { data: orders } = await supabase.from('orders').select('total_amount, status')
      const { data: products } = await supabase.from('products').select('stock')

      // 2. Get Recent 5 Orders
      const { data: recent } = await supabase
        .from('orders')
        .select('id, customer_name, total_amount, status, created_at')
        .order('created_at', { ascending: false })
        .limit(5)

      if (orders && products) {
        const revenue = orders
          .filter(o => o.status !== 'cancelled') // Exclude cancelled from revenue
          .reduce((sum, order) => sum + order.total_amount, 0)
        
        const lowStock = products.filter((p) => (p.stock || 0) < 5).length

        setStats({
          totalRevenue: revenue,
          totalOrders: orders.length,
          totalProducts: products.length,
          lowStockCount: lowStock
        })
      }

      if (recent) {
        setRecentOrders(recent)
      }

    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()

    // --- REAL-TIME LISTENER ---
    // Update dashboard pag may bagong order or status change
    const subscription = supabase
      .channel('dashboard-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          fetchDashboardData() // Refresh data automatically!
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [])

  // Helper para sa kulay ng status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'shipped': return 'bg-blue-100 text-blue-700'
      case 'delivered': return 'bg-green-100 text-green-700'
      case 'cancelled': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  if (loading) return <div className="p-10 text-center">Loading dashboard...</div>

  return (
    <main className="max-w-7xl mx-auto px-4 py-6 md:py-10">
      
      {/* --- RESPONSIVE HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">Dashboard</h1>
        
        <div className="w-full md:w-auto grid grid-cols-1 sm:grid-cols-3 gap-2 sm:flex">
            <Link href="/admin/coupons" className="bg-white border border-gray-300 px-4 py-2.5 rounded-lg hover:bg-gray-50 text-sm font-medium text-center flex items-center justify-center">Promo Codes</Link>
            <Link href="/admin/orders" className="bg-white border border-gray-300 px-4 py-2.5 rounded-lg hover:bg-gray-50 text-sm font-medium text-center flex items-center justify-center">Manage Orders</Link>
            <Link href="/admin/products" className="bg-black text-white px-4 py-2.5 rounded-lg hover:bg-gray-800 text-sm font-bold text-center flex items-center justify-center">Manage Inventory</Link>
        </div>
      </div>

      {/* --- STAT CARDS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
        
        {/* Revenue */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">₱{stats.totalRevenue.toLocaleString()}</h3>
            </div>
            <div className="bg-green-100 p-2 rounded-lg text-green-600"><DollarSign size={24} /></div>
          </div>
          <p className="text-xs text-green-600 flex items-center gap-1"><TrendingUp size={12} /> All time sales</p>
        </div>

        {/* Orders */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Orders</p>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">{stats.totalOrders}</h3>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><ShoppingBag size={24} /></div>
          </div>
          <p className="text-xs text-gray-500">Orders placed so far</p>
        </div>

        {/* Products */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Products</p>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">{stats.totalProducts}</h3>
            </div>
            <div className="bg-purple-100 p-2 rounded-lg text-purple-600"><Package size={24} /></div>
          </div>
          <p className="text-xs text-gray-500">Active items in store</p>
        </div>

        {/* Low Stock */}
        <div className={`p-6 rounded-xl border shadow-sm ${stats.lowStockCount > 0 ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className={`text-sm font-medium ${stats.lowStockCount > 0 ? 'text-red-600' : 'text-gray-500'}`}>Low Stock Items</p>
              <h3 className={`text-2xl md:text-3xl font-bold mt-1 ${stats.lowStockCount > 0 ? 'text-red-700' : 'text-gray-900'}`}>{stats.lowStockCount}</h3>
            </div>
            <div className={`p-2 rounded-lg ${stats.lowStockCount > 0 ? 'bg-red-200 text-red-700' : 'bg-gray-100 text-gray-500'}`}><AlertTriangle size={24} /></div>
          </div>
          <p className={`text-xs ${stats.lowStockCount > 0 ? 'text-red-600' : 'text-gray-500'}`}>{stats.lowStockCount > 0 ? 'Needs restocking ASAP!' : 'Inventory looks good'}</p>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 mb-10">
        
        {/* Main Chart (Occupies 4 columns) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
           <OverviewChart />
        </div>

        {/* --- RECENT ACTIVITY (DYNAMIC) --- */}
        <div className="lg:col-span-3 bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
           <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-gray-900">Recent Orders</h3>
             <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500">Real-time</span>
           </div>

           <div className="space-y-4 flex-1 overflow-y-auto max-h-75 pr-2">
              {recentOrders.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">No recent orders found.</p>
              ) : (
                recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition border border-transparent hover:border-gray-100">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                          <User size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 line-clamp-1">{order.customer_name}</p>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock size={10} />
                            {new Date(order.created_at).toLocaleDateString()}
                          </div>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-sm font-bold">₱{order.total_amount.toLocaleString()}</p>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                     </div>
                  </div>
                ))
              )}
           </div>
           
           <div className="mt-4 pt-4 border-t border-gray-100">
              <Link href="/admin/orders" className="block w-full text-center py-2 text-sm text-gray-600 hover:text-black hover:bg-gray-50 rounded transition border border-dashed border-gray-300 font-medium">
                 View All Orders
              </Link>
           </div>
        </div>
      </div>

      {/* --- QUICK LINKS SECTION --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Link href="/admin/orders" className="group bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-black transition">
          <h3 className="font-bold text-lg mb-2 flex items-center justify-between">
            View Recent Orders <ArrowRight className="group-hover:translate-x-1 transition" size={20} />
          </h3>
          <p className="text-gray-500">Check pending orders, update status to shipped/delivered.</p>
        </Link>

        <Link href="/" target="_blank" className="group bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-black transition">
          <h3 className="font-bold text-lg mb-2 flex items-center justify-between">
            Visit Live Store <ArrowRight className="group-hover:translate-x-1 transition" size={20} />
          </h3>
          <p className="text-gray-500">See what your customers are seeing right now.</p>
        </Link>
      </div>

    </main>
  )
}