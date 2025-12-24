'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { ArrowRight, DollarSign, Package, ShoppingBag, TrendingUp, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    lowStockCount: 0
  })

  useEffect(() => {
    async function fetchStats() {
      try {
        // 1. Get ALL Orders (para sa Total Sales)
        const { data: orders } = await supabase
          .from('orders')
          .select('total_amount')
        
        // 2. Get ALL Products (para sa Stock check)
        const { data: products } = await supabase
          .from('products')
          .select('stock')

        if (orders && products) {
          // Compute Total Revenue
          const revenue = orders.reduce((sum, order) => sum + order.total_amount, 0)
          
          // Compute Low Stock (Items with less than 5 qty)
          const lowStock = products.filter((p) => p.stock < 5).length

          setStats({
            totalRevenue: revenue,
            totalOrders: orders.length,
            totalProducts: products.length,
            lowStockCount: lowStock
          })
        }
      } catch (error) {
        console.error('Error loading stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) return <div className="p-10 text-center">Loading dashboard...</div>

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <TrendingUp className="text-black" /> CEO Dashboard
        </h1>
        <div className="flex gap-2">
           <Link href="/admin/orders" className="bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium">
             Manage Orders
           </Link>
           <Link href="/admin/products/add" className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 text-sm font-bold">
             + Add Product
           </Link>
        </div>
      </div>

      {/* --- STAT CARDS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        
        {/* Card 1: Revenue */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">
                ₱{stats.totalRevenue.toLocaleString()}
              </h3>
            </div>
            <div className="bg-green-100 p-2 rounded-lg text-green-600">
              <DollarSign size={24} />
            </div>
          </div>
          <p className="text-xs text-green-600 flex items-center gap-1">
            <TrendingUp size={12} /> All time sales
          </p>
        </div>

        {/* Card 2: Orders */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Orders</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">
                {stats.totalOrders}
              </h3>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
              <ShoppingBag size={24} />
            </div>
          </div>
          <p className="text-xs text-gray-500">Orders placed so far</p>
        </div>

        {/* Card 3: Products */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Products</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">
                {stats.totalProducts}
              </h3>
            </div>
            <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
              <Package size={24} />
            </div>
          </div>
          <p className="text-xs text-gray-500">Active items in store</p>
        </div>

        {/* Card 4: Low Stock Alert */}
        <div className={`p-6 rounded-xl border shadow-sm ${stats.lowStockCount > 0 ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className={`text-sm font-medium ${stats.lowStockCount > 0 ? 'text-red-600' : 'text-gray-500'}`}>
                Low Stock Items
              </p>
              <h3 className={`text-3xl font-bold mt-1 ${stats.lowStockCount > 0 ? 'text-red-700' : 'text-gray-900'}`}>
                {stats.lowStockCount}
              </h3>
            </div>
            <div className={`p-2 rounded-lg ${stats.lowStockCount > 0 ? 'bg-red-200 text-red-700' : 'bg-gray-100 text-gray-500'}`}>
              <AlertTriangle size={24} />
            </div>
          </div>
          <p className={`text-xs ${stats.lowStockCount > 0 ? 'text-red-600' : 'text-gray-500'}`}>
            {stats.lowStockCount > 0 ? 'Needs restocking ASAP!' : 'Inventory looks good'}
          </p>
        </div>

      </div>

      {/* --- QUICK LINKS SECTION --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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