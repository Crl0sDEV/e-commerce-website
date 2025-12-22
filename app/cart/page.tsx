'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Trash2, Plus, Minus, ArrowLeft, CreditCard } from 'lucide-react'
import useCartStore from '@/store/useCartStore'
import dynamic from 'next/dynamic'

// 2. Palitan ang pangalan ng function (HINDI na 'export default')
// Gawin nating "CartContent" or kahit ano, basta hindi exported directly
function CartContent() {
  const { cart, addItem, decreaseItem, removeItem } = useCartStore()
  
  // --- TINANGGAL NA NATIN ANG "isMounted" at "useEffect" ---
  // Kasi sure tayo na sa browser lang to tatakbo dahil sa dynamic import sa baba.

  // Calculate Total Price
  const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0)

  // Empty State
  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="bg-gray-100 p-6 rounded-full mb-4">
          <CreditCard size={48} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven&apos;t added anything yet.</p>
        <Link 
          href="/"
          className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition flex items-center gap-2"
        >
          <ArrowLeft size={20} />
          Start Shopping
        </Link>
      </div>
    )
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* LEFT COLUMN: Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div 
              key={item.id} 
              className="flex gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm"
            >
              {/* Product Image */}
              <div className="relative w-24 h-24 bg-gray-100 rounded-lg shrink-0 overflow-hidden">
                 <Image 
                    src={item.image_url} 
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                 />
              </div>

              {/* Details */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.category}</p>
                  <p className="font-semibold text-gray-900 mt-1">₱{item.price}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col items-end justify-between">
                <button 
                  onClick={() => removeItem(item.id)}
                  className="text-gray-400 hover:text-red-500 transition p-1"
                >
                  <Trash2 size={20} />
                </button>

                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                  <button 
                    onClick={() => decreaseItem(item.id)}
                    className="p-1 hover:bg-white rounded shadow-sm transition disabled:opacity-50"
                    disabled={item.quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  
                  <span className="text-sm font-semibold w-4 text-center">
                    {item.quantity}
                  </span>

                  <button 
                    onClick={() => addItem(item)}
                    className="p-1 hover:bg-white rounded shadow-sm transition"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT COLUMN: Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>₱{totalPrice}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-lg text-gray-900">
                <span>Total</span>
                <span>₱{totalPrice}</span>
              </div>
            </div>

            <Link 
              href="/checkout"
              className="block w-full bg-black text-center text-white font-bold py-3 rounded-lg mt-6 hover:bg-gray-800 transition"
            >
              Proceed to Checkout
            </Link>
            
            <p className="text-xs text-center text-gray-400 mt-4">
              Secure Checkout • COD Available
            </p>
          </div>
        </div>

      </div>
    </main>
  )
}

// 3. ETO YUNG MAJOR CHANGE:
// Export default gamit ang dynamic import na may ssr: false
export default dynamic(() => Promise.resolve(CartContent), { 
  ssr: false,
  loading: () => (
    // Optional: Loading skeleton habang nagloload sa browser
    <div className="min-h-[60vh] flex items-center justify-center">
       <p className="text-gray-500">Loading cart...</p>
    </div>
  )
})