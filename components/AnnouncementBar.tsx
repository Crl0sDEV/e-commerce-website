'use client'

import { useState, useEffect } from 'react'
import { X, Copy, Tag } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { toast } from 'sonner'
import { usePathname } from "next/navigation";

type Coupon = {
  code: string
  discount_percentage: number
  valid_until: string | null
}

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true)
  const [promo, setPromo] = useState<Coupon | null>(null)
  const [loading, setLoading] = useState(true)
  const pathname = usePathname();

  useEffect(() => {
    const fetchLatestPromo = async () => {
      try {
        // 1. Kunin ang latest na ACTIVE coupon
        const { data, error } = await supabase
          .from('coupons')
          .select('code, discount_percentage, valid_until')
          .eq('is_active', true) // Dapat active
          .order('created_at', { ascending: false }) // Pinakabago muna
          .limit(1) // Isa lang kukunin
          .single()

        if (error || !data) {
          setLoading(false)
          return
        }

        // 2. Client-side Expiration Check
        // Kung may expiration date at LUMIPAS NA, wag ipakita.
        if (data.valid_until && new Date(data.valid_until) < new Date()) {
          setPromo(null)
        } else {
          setPromo(data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchLatestPromo()
  }, [])

  const copyCode = () => {
    if (promo) {
      navigator.clipboard.writeText(promo.code)
      toast.success(`Code ${promo.code} copied!`)
    }
  }

  // Kung closed na, loading pa, o walang promo, WAG mag-render.
  if (!isVisible || loading || !promo) return null

  
  if (pathname && pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <div className="bg-black text-white text-xs sm:text-sm py-2.5 px-4 relative z-50 transition-all duration-300 ease-in-out">
      <div className="flex justify-center items-center gap-2 text-center pr-8">
        
        {/* Icon */}
        <Tag size={14} className="text-yellow-400 hidden sm:block" />

        <p className="font-medium">
          <span className="text-yellow-400 font-bold">SALE! </span>
          Get <span className="font-bold">{promo.discount_percentage}% OFF</span> with code: 
        </p>

        {/* Code Badge (Click to Copy) */}
        <button 
          onClick={copyCode}
          className="group flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 px-2 py-0.5 rounded cursor-pointer transition ml-1"
          title="Click to copy"
        >
          <span className="font-mono font-bold text-yellow-400 border-b border-yellow-400 border-dashed group-hover:scale-105 transition inline-block">
            {promo.code}
          </span>
          <Copy size={10} className="text-gray-400 group-hover:text-white" />
        </button>

        {/* Expiration Text (If exists) */}
        {promo.valid_until && (
          <span className="text-gray-400 text-xs ml-1 hidden md:inline">
            (Valid until {new Date(promo.valid_until).toLocaleDateString()})
          </span>
        )}

      </div>
      
      {/* Close Button */}
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1"
      >
        <X size={16} />
      </button>
    </div>
  )
}