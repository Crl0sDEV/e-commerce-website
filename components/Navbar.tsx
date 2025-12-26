"use client";

import Link from "next/link";
import { Store, ShoppingCart } from "lucide-react";
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

  // 3. ANG LOGIC: "Kung nasa Admin page ako, wag mo irender ang Navbar"
  if (pathname.startsWith("/admin")) {
    return null;
  }

  // --- DITO NA YUNG ORIGINAL CODE MO SA BABA ---
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. Add 'relative' class dito sa container */}
        <div className="flex justify-between items-center h-16 relative">
          
          {/* --- LEFT: LOGO --- */}
          {/* Add 'flex items-center' para pantay ang icon at text */}
          <div className="flex items-center"> 
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-black text-white p-1 rounded-md flex items-center justify-center">
                <Store size={24} />
              </div>
              <span className="font-bold text-xl tracking-tight leading-none">BossStore</span>
            </Link>
          </div>

          {/* --- CENTER: TRACK ORDER (ABSOLUTE) --- */}
          {/* Ito ang magic: 'absolute' + 'left-1/2' + 'translate' */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden sm:block">
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
    </nav>
  );
}
