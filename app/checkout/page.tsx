'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CheckCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import useCartStore from '@/store/useCartStore'
import { supabase } from '@/lib/supabaseClient'

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, clearCart } = useCartStore()
  
  // States
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contact: ''
  })

  // Hydration fix
  useEffect(() => setIsMounted(true), [])

  // Computed Total
  const totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0)

  // Redirect kung walang laman cart
  useEffect(() => {
    if (isMounted && cart.length === 0 && !success) {
      router.push('/cart')
    }
  }, [isMounted, cart, router, success])

  // --- MAIN CHECKOUT LOGIC ---
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // STEP 1: VALIDATION (Check Stock First)
      // Bago tayo gumawa ng order, check muna natin kung may stock pa sa database
      for (const item of cart) {
        const { data: product } = await supabase
          .from('products')
          .select('stock, name')
          .eq('id', item.id)
          .single()

        if (!product) throw new Error(`Product ${item.name} not found`)

        // Kung mas madami ang order kesa sa stock...
        if (item.quantity > (product.stock || 0)) {
          alert(`Pasensya na boss! Yung item na "${product.name}" ay may ${product.stock} stocks nalang. Paki-bawasan ang cart mo.`)
          setLoading(false)
          return // STOP THE PROCESS DITO
        }
      }

      // STEP 2: CREATE ORDER (Kung may stock, proceed na)
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            customer_name: formData.name,
            customer_address: formData.address,
            customer_contact: formData.contact,
            total_amount: totalAmount,
            status: 'pending'
          }
        ])
        .select() 

      if (orderError) throw orderError

      const newOrderId = orderData[0].id
      setOrderId(newOrderId) // Save ID para sa UI

      // STEP 3: SAVE ORDER ITEMS
      const orderItems = cart.map((item) => ({
        order_id: newOrderId,    
        product_id: item.id,
        quantity: item.quantity,
        price_at_purchase: item.price 
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) throw itemsError

      // STEP 4: DEDUCT STOCKS
      // Loop ulit para bawasan na ang database
      for (const item of cart) {
        const { data: currentProduct } = await supabase
          .from('products')
          .select('stock')
          .eq('id', item.id)
          .single()
        
        if (currentProduct) {
          const newStock = currentProduct.stock - item.quantity
          
          await supabase
            .from('products')
            .update({ stock: Math.max(0, newStock) }) // Math.max(0) para sure di mag negative
            .eq('id', item.id)
        }
      }

      // STEP 5: SUCCESS
      clearCart()
      setSuccess(true)

    } catch (error) {
      console.error('Checkout Error:', error)
      alert('May error sa pag-place ng order. Paki-try ulit.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  if (!isMounted) return null

  // --- SUCCESS SCREEN ---
  if (success) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-10 animate-in fade-in zoom-in duration-300">
        <div className="bg-green-100 p-4 rounded-full mb-4">
          <CheckCircle size={64} className="text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed!</h1>
        <p className="text-gray-500 max-w-md mb-6">
          Thank you, {formData.name}! We have received your order. 
          Expect a delivery within 3-5 business days.
        </p>

        {/* ORDER ID DISPLAY */}
        {orderId && (
          <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl mb-6 w-full max-w-sm">
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">
              Your Order ID
            </p>
            <div className="flex items-center justify-center gap-2 bg-white border border-gray-200 p-2 rounded-lg">
               <code className="text-sm sm:text-base font-mono font-bold text-gray-900 select-all break-all">
                 {orderId}
               </code>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Please copy this ID to track your order.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Link href="/track" className="text-blue-600 hover:underline text-sm font-medium">
            Track your order here
          </Link>
          <Link href="/" className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition font-bold">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  // --- CHECKOUT FORM ---
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/cart" className="inline-flex items-center text-gray-500 hover:text-black mb-6">
        <ArrowLeft size={20} className="mr-2" /> Back to Cart
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* LEFT: FORM */}
        <div>
          <form onSubmit={handleCheckout} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input required name="name" type="text" placeholder="Juan Dela Cruz" className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-black transition" value={formData.name} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input required name="contact" type="tel" placeholder="0917 123 4567" className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-black transition" value={formData.contact} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Complete Address</label>
              <textarea required name="address" rows={3} placeholder="Unit, Street, Barangay, City" className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-black transition resize-none" value={formData.address} onChange={handleChange} />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-black text-white font-bold py-4 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="animate-spin" /> Processing...</> : `Place Order (COD) • ₱${totalAmount}`}
            </button>
          </form>
        </div>

        {/* RIGHT: SUMMARY */}
        <div className="bg-gray-50 p-6 rounded-xl h-fit border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-4 max-h-100 overflow-y-auto pr-2">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded overflow-hidden relative">
                     <Image src={item.image_url} alt={item.name} fill className="object-cover" sizes="48px" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-semibold">₱{item.price * item.quantity}</p>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-200 mt-6 pt-4 space-y-2">
             <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>₱{totalAmount}</span></div>
             <div className="flex justify-between text-gray-600"><span>Shipping</span><span className="text-green-600">Free</span></div>
             <div className="flex justify-between text-xl font-bold text-gray-900 pt-2"><span>Total</span><span>₱{totalAmount}</span></div>
          </div>
        </div>

      </div>
    </main>
  )
}