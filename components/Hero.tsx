'use client'

import Link from 'next/link'
import { ArrowRight, ShoppingBag } from 'lucide-react'

export default function Hero() {
  return (
    // Background Container (Black theme)
    <div className="bg-black text-white relative overflow-hidden">
      
      {/* Optional: Pwede kang maglagay ng background image dito sa future gamit ang next/image */}
      {/* <Image src="/banner.jpg" fill className="object-cover opacity-50" /> */}

      {/* Decorative gradient blur effect (Optional, pangpaganda lang) */}
      <div className="absolute -top-40 -left-40 h-120 w-120 bg-purple-700/30 blur-[100px] rounded-full mix-blend-overlay pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 h-120 w-120 bg-blue-700/30 blur-[100px] rounded-full mix-blend-overlay pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36 relative z-10 text-center">
        
        {/* Small Label */}
        <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-sm border border-white/10">
          <ShoppingBag size={16} className="text-gray-300" />
          New Season Arrivals
        </div>
        
        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
          Elevate Your Style. <br/>
          <span className="text-transparent bg-clip-text bg-linear-to-r from-white to-gray-500">
            Premium Essentials.
          </span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Discover our latest collection of curated clothing and accessories designed for the modern boss. Quality you can feel.
        </p>
        
        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="#products"
            className="bg-white text-black px-8 py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition transform hover:scale-105 active:scale-95"
          >
            Shop Collection <ArrowRight size={20} />
          </Link>
          <Link
            href="/about"
            className="px-8 py-4 rounded-full font-bold flex items-center justify-center gap-2 border border-white/30 hover:bg-white/10 transition"
          >
            Learn More
          </Link>
        </div>

      </div>
    </div>
  )
}