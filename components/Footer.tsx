'use client'

import Link from 'next/link'
import { Facebook, Instagram, Twitter, MapPin, Mail, Phone, Store } from 'lucide-react'
import { usePathname } from "next/navigation";

export default function Footer() {
    const pathname = usePathname();

  if (pathname && pathname.startsWith("/admin")) {
    return null;
  }
  
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* 1. Brand Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
               <div className="bg-white text-black p-1 rounded-md">
                 <Store size={20} />
               </div>
               <h3 className="text-xl font-bold">BossStore</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Your one-stop shop for the best quality items. 
              We deliver style and convenience right to your doorstep.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition hover:scale-110 transform duration-200">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition hover:scale-110 transform duration-200">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition hover:scale-110 transform duration-200">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* 2. Quick Links */}
          <div>
            <h4 className="font-bold mb-4 text-white">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/" className="hover:text-white transition">All Products</Link></li>
              <li><Link href="/?category=Clothing" className="hover:text-white transition">Clothing</Link></li>
              <li><Link href="/?category=Shoes" className="hover:text-white transition">Shoes</Link></li>
              <li><Link href="/?category=Accessories" className="hover:text-white transition">Accessories</Link></li>
            </ul>
          </div>

          {/* 3. Help & Legal (UPDATED) */}
          <div>
            <h4 className="font-bold mb-4 text-white">Help & Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/track" className="hover:text-white transition">Track Order</Link></li>
              <li><Link href="/faq" className="hover:text-white transition">FAQs</Link></li>
              <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
              
              {/* NEW LEGAL LINKS */}
              <li className="pt-2">
                <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition">Terms & Conditions</Link>
              </li>
            </ul>
          </div>

          {/* 4. Contact Info */}
          <div>
            <h4 className="font-bold mb-4 text-white">Contact Us</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="shrink-0 mt-0.5 text-gray-500" />
                <span>123 Boss Street, Business District, Metro Manila, PH</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="shrink-0 text-gray-500" />
                <span>support@bossstore.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="shrink-0 text-gray-500" />
                <span>+63 917 123 4567</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright & Admin Link */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} BossStore. All rights reserved.</p>
          
          {/* Subtle Admin Link */}
          <Link href="/admin/login" className="hover:text-gray-300 opacity-50 hover:opacity-100 transition text-xs">
            Admin Portal
          </Link>
        </div>

      </div>
    </footer>
  )
}