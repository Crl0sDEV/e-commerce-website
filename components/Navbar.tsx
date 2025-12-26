"use client";

import { useState } from "react";
import Link from "next/link";
import { Store, ShoppingCart, Menu, X, Package, Home } from 'lucide-react';
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const CartButton = dynamic(() => import("./CartButton"), {
  ssr: false,
  loading: () => (
    <div className="p-2 opacity-50">
      <ShoppingCart size={24} className="text-gray-400" />
    </div>
  ),
});

export default function Navbar() {
  const pathname = usePathname();
  // 2. STATE FOR MOBILE MENU
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // ADMIN CHECK
  if (pathname && pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex justify-between items-center h-16 relative">
          
          {/* --- LEFT: HAMBURGER & LOGO --- */}
          <div className="flex items-center gap-4"> 
            
            {/* MOBILE HAMBURGER BUTTON (Visible only on Mobile) */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="sm:hidden p-1 text-gray-600 hover:text-black"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* LOGO */}
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-black text-white p-1 rounded-md flex items-center justify-center">
                <Store size={24} />
              </div>
              {/* Hide text on very small screens if needed, otherwise block */}
              <span className="font-bold text-xl tracking-tight leading-none hidden xs:block">BossStore</span>
            </Link>
          </div>

          {/* --- CENTER: DESKTOP LINKS (ABSOLUTE) --- */}
          {/* Ito yung alignment fix mo, dinagdagan ko lang ng Home link */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden sm:flex items-center gap-8">
            <Link 
              href="/" 
              className="text-sm font-medium text-gray-600 hover:text-black transition"
            >
              Home
            </Link>
            <Link 
              href="/track" 
              className="text-sm font-medium text-gray-600 hover:text-black transition"
            >
              Track Order
            </Link>
          </div>

          {/* --- RIGHT: CART --- */}
          <div className="flex items-center gap-4">
            <CartButton />
          </div>

        </div>
      </div>

      {/* --- MOBILE MENU OVERLAY (Sliding from Top) --- */}
      {isMobileMenuOpen && (
        <div className="sm:hidden absolute top-16 left-0 w-full bg-white border-b border-gray-200 shadow-xl animate-in slide-in-from-top-5 duration-200">
          <div className="flex flex-col p-4 space-y-4">
            
            <Link 
              href="/" 
              onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
              className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg text-gray-700 font-medium"
            >
              <Home size={20} /> Home
            </Link>
            
            <Link 
              href="/track" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg text-gray-700 font-medium"
            >
              <Package size={20} /> Track Order
            </Link>

          </div>
        </div>
      )}
    </nav>
  );
}