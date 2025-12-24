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
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-black text-white p-1.5 rounded-lg group-hover:bg-gray-800 transition">
              <Store size={24} />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900">
              BossStore
            </span>
          </Link>

          <Link
            href="/track"
            className="text-sm font-medium text-gray-600 hover:text-black transition hidden sm:block"
          >
            Track Order
          </Link>

          {/* Cart Section */}
          <div>
            <CartButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
