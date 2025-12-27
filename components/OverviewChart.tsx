'use client'

import { useEffect, useState } from 'react'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { supabase } from '@/lib/supabaseClient'
import { Loader2 } from 'lucide-react'

// Helper para sa Buwan
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export default function OverviewChart() {
  const [data, setData] = useState<{ name: string; total: number }[]>([])
  const [loading, setLoading] = useState(true)

  // Function to fetch and process data
  const fetchData = async () => {
    try {
      // 1. Fetch Orders (created_at & total_amount only)
      const { data: orders, error } = await supabase
        .from('orders')
        .select('created_at, total_amount')
        .eq('status', 'delivered') // OPTIONAL: Tanggalin ito kung gusto mo isama pati pending/shipped sales
        // .gte('created_at', `${new Date().getFullYear()}-01-01`) // OPTIONAL: Current Year only

      if (error) throw error

      // 2. Process Data (Group by Month)
      // Gumawa muna ng empty template para sa 12 months
      const monthlyData = monthNames.map(name => ({ name, total: 0 }))

      orders?.forEach(order => {
        const date = new Date(order.created_at)
        const monthIndex = date.getMonth() // 0 = Jan, 1 = Feb...
        
        // Add amount to the correct month
        monthlyData[monthIndex].total += order.total_amount
      })

      setData(monthlyData)
    } catch (error) {
      console.error('Error fetching chart data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()

    // 3. REAL-TIME MAGIC ⚡
    // Mag-aabang tayo ng bagong INSERT sa 'orders' table
    const subscription = supabase
      .channel('custom-all-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          console.log('Change received!', payload)
          fetchData() // Refresh chart kapag may bagong order!
        }
      )
      .subscribe()

    // Cleanup subscription pag umalis sa page
    return () => {
      supabase.removeChannel(subscription)
    }
  }, [])

  if (loading) {
    return (
      <div className="h-87.5 w-full flex items-center justify-center">
        <Loader2 className="animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="mb-4">
         <h3 className="text-lg font-bold text-gray-900">Revenue Overview</h3>
         <p className="text-sm text-gray-500">Real-time monthly sales performance ({new Date().getFullYear()})</p>
      </div>
      
      <div className="h-87.5 w-full animate-in fade-in zoom-in duration-500">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis 
              dataKey="name" 
              stroke="#888888" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
            />
            <YAxis 
              stroke="#888888" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
              tickFormatter={(value) => `₱${value.toLocaleString()}`}
            />
            
            <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: number | string | undefined) => [
                  `₱${Number(value || 0).toLocaleString()}`, 
                  'Revenue'
                ]}
            />
            <Bar 
                dataKey="total" 
                fill="#000000" 
                radius={[4, 4, 0, 0]} 
                barSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}