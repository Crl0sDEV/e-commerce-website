"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image"; 
import { Store, ShoppingCart, Menu, X, Package, Home, User, LogOut, UserCircle, Loader2 } from 'lucide-react';
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import useUserStore from "@/store/useUserStore"; 

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { user, profile, fetchUser, logout, loading } = useUserStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (pathname && pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex justify-between items-center h-16 relative">
          
          {/* --- LEFT: HAMBURGER & LOGO --- */}
          <div className="flex items-center gap-4"> 
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="sm:hidden p-1 text-gray-600 hover:text-black"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <Link href="/" className="flex items-center gap-2">
              <div className="bg-black text-white p-1 rounded-md flex items-center justify-center">
                <Store size={24} />
              </div>
              <span className="font-bold text-xl tracking-tight leading-none hidden xs:block">BossStore</span>
            </Link>
          </div>

          {/* --- CENTER: DESKTOP LINKS --- */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden sm:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-gray-600 hover:text-black transition">
              Home
            </Link>
            <Link href="/track" className="text-sm font-medium text-gray-600 hover:text-black transition">
              Track Order
            </Link>
          </div>

          {/* --- RIGHT: CART & USER --- */}
          <div className="flex items-center gap-3">
            
            <CartButton />

            <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block"></div>

            {/* USER AUTH SECTION (Desktop) */}
            <div className="hidden sm:block relative">
                {loading ? (
                    <Loader2 className="animate-spin text-gray-400" size={20} />
                ) : user ? (
                    // --- LOGGED IN (Avatar & Dropdown) ---
                    <div className="relative">
                        <button 
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-2 hover:bg-gray-100 p-1 pr-3 rounded-full transition border border-transparent hover:border-gray-200"
                        >
                            {/* AVATAR CONTAINER */}
                            <div className="w-8 h-8 relative bg-black text-white rounded-full overflow-hidden text-xs font-bold flex items-center justify-center">
                                {profile?.avatar_url ? (
                                    // 2. USE NEXT IMAGE HERE
                                    <Image 
                                      src={profile.avatar_url} 
                                      alt="Profile" 
                                      fill 
                                      sizes="32px"
                                      className="object-cover" 
                                    />
                                ) : (
                                    <span>{profile?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}</span>
                                )}
                            </div>
                            <span className="text-sm font-medium max-w-25 truncate">
                                {profile?.full_name?.split(' ')[0] || 'User'}
                            </span>
                        </button>

                        {/* DROPDOWN MENU */}
                        {isDropdownOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)}></div>
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-1 overflow-hidden animate-in fade-in zoom-in duration-200">
                                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                                        <p className="text-xs text-gray-500">Signed in as</p>
                                        <p className="text-sm font-bold truncate">{user.email}</p>
                                    </div>
                                    <Link href="/profile" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition">
                                        <UserCircle size={16} /> My Profile
                                    </Link>
                                    <Link href="/my-orders" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition">
                                        <Package size={16} /> My Orders
                                    </Link>
                                    <button 
                                        onClick={() => { logout(); setIsDropdownOpen(false); }}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition border-t border-gray-100"
                                    >
                                        <LogOut size={16} /> Logout
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    // --- GUEST (Login Button) ---
                    <Link 
                        href="/login" 
                        className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition shadow-sm"
                    >
                        <User size={18} /> Log In
                    </Link>
                )}
            </div>

          </div>

        </div>
      </div>

      {/* --- MOBILE MENU OVERLAY --- */}
      {isMobileMenuOpen && (
        <div className="sm:hidden absolute top-16 left-0 w-full bg-white border-b border-gray-200 shadow-xl animate-in slide-in-from-top-5 duration-200 max-h-[80vh] overflow-y-auto">
          <div className="flex flex-col p-4 space-y-2">
            
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg text-gray-700 font-medium">
              <Home size={20} /> Home
            </Link>
            <Link href="/track" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg text-gray-700 font-medium">
              <Package size={20} /> Track Order
            </Link>

            <div className="h-px bg-gray-100 my-2"></div>

            {/* User Section (Mobile) */}
            {user ? (
                <>
                    <div className="px-3 py-2">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">My Account</p>
                        <div className="flex items-center gap-3 mt-2 mb-2">
                            {/* MOBILE AVATAR CONTAINER */}
                            <div className="w-8 h-8 relative bg-gray-200 rounded-full flex items-center justify-center font-bold text-sm overflow-hidden">
                                {profile?.avatar_url ? (
                                    // 3. USE NEXT IMAGE HERE AS WELL
                                    <Image 
                                      src={profile.avatar_url} 
                                      alt="Profile" 
                                      fill 
                                      sizes="32px"
                                      className="object-cover" 
                                    />
                                ) : (
                                    <span>{profile?.full_name?.charAt(0) || 'U'}</span>
                                )}
                            </div>
                            <div>
                                <p className="text-sm font-bold">{profile?.full_name || 'Valued Customer'}</p>
                                <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                        </div>
                    </div>
                    <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg text-gray-700 font-medium">
                        <UserCircle size={20} /> Edit Profile
                    </Link>
                    <Link href="/my-orders" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg text-gray-700 font-medium">
                        <Package size={20} /> Order History
                    </Link>
                    <button 
                        onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                        className="flex w-full items-center gap-3 p-3 hover:bg-red-50 rounded-lg text-red-600 font-medium text-left"
                    >
                        <LogOut size={20} /> Logout
                    </button>
                </>
            ) : (
                <>
                    <p className="px-3 text-xs text-gray-400 font-bold uppercase tracking-wider mt-2">Account</p>
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg text-gray-700 font-medium">
                        <User size={20} /> Log In
                    </Link>
                    <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 bg-black text-white rounded-lg font-bold justify-center mt-2">
                        Create Account
                    </Link>
                </>
            )}

          </div>
        </div>
      )}
    </nav>
  );
}