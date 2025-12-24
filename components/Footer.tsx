'use client'

import Link from 'next/link'
import { Facebook, Instagram, Twitter, MapPin, Mail, Phone } from 'lucide-react'
import { usePathname } from "next/navigation";

export default function Footer() {
    const pathname = usePathname();

  // 3. ANG LOGIC: "Kung nasa Admin page ako, wag mo irender ang Navbar"
  if (pathname.startsWith("/admin")) {
    return null;
  }
  
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* 1. Brand Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">BossStore</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Your one-stop shop for the best quality items. 
              We deliver style and convenience right to your doorstep.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* 2. Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/" className="hover:text-white transition">All Products</Link></li>
              <li><Link href="/?category=Clothing" className="hover:text-white transition">Clothing</Link></li>
              <li><Link href="/?category=Shoes" className="hover:text-white transition">Shoes</Link></li>
              <li><Link href="/?category=Accessories" className="hover:text-white transition">Accessories</Link></li>
            </ul>
          </div>

          {/* 3. Customer Service */}
          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/track" className="hover:text-white transition">Track Order</Link></li>
              <li><Link href="/faq" className="hover:text-white transition">FAQs</Link></li>
              <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link href="/admin/login" className="hover:text-white transition">Admin Login</Link></li>
            </ul>
          </div>

          {/* 4. Contact Info */}
          <div>
            <h4 className="font-bold mb-4">Contact Us</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="shrink-0 mt-0.5" />
                <span>123 Boss Street, Business District, Metro Manila, PH</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="shrink-0" />
                <span>support@bossstore.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="shrink-0" />
                <span>+63 917 123 4567</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} BossStore. All rights reserved.</p>
        </div>

      </div>
    </footer>
  )
}