'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CheckCircle, Loader2, Tag } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image' // Import Image component
import useCartStore from '@/store/useCartStore'
import { supabase } from '@/lib/supabaseClient'
import { toast } from 'sonner'
import PhoneInputCustom from '@/components/PhoneInputCustom'

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, clearCart } = useCartStore()
  
  // States
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  // PAYMENT METHOD STATES
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'GCASH'>('COD')
  const [refNumber, setRefNumber] = useState('')

  // PROMO CODE STATES
  const [couponCode, setCouponCode] = useState('')
  const [discountAmount, setDiscountAmount] = useState(0)
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contact: '' 
  })

  useEffect(() => setIsMounted(true), [])

  const sanitizePhone = (phone: string) => {
    return phone ? phone.replace(/\D/g, '') : ''
  }

  const subTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  const totalAmount = Math.max(0, subTotal - discountAmount) 

  useEffect(() => {
    if (isMounted && cart.length === 0 && !success) {
      router.push('/cart')
    }
  }, [isMounted, cart, router, success])

  // --- LOGIC: APPLY COUPON ---
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return

    const cleanPhone = sanitizePhone(formData.contact)

    if (!cleanPhone || cleanPhone.length < 10) {
      toast.warning('Please enter a valid Phone Number first.')
      return
    }
    
    setIsValidatingCoupon(true)

    try {
      const { data: coupon, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.toUpperCase().trim())
        .eq('is_active', true)
        .single()

      if (error || !coupon) {
        toast.error('Invalid or expired coupon code.')
        setDiscountAmount(0)
        setAppliedCoupon(null)
        setIsValidatingCoupon(false)
        return
      }

      if (coupon.valid_until && new Date() > new Date(coupon.valid_until)) {
        toast.error('This promo code has expired.')
        setIsValidatingCoupon(false)
        return
      }

      const { data: existingUsage } = await supabase
        .from('orders')
        .select('id')
        .eq('used_coupon_code', coupon.code)
        .ilike('customer_contact', `%${cleanPhone}%`) 
        .limit(1)

      if (existingUsage && existingUsage.length > 0) {
        toast.error('You have already used this code!')
        setIsValidatingCoupon(false)
        return
      }

      const discount = (subTotal * coupon.discount_percentage) / 100
      setDiscountAmount(discount)
      setAppliedCoupon(coupon.code)
      toast.success(`Coupon applied! You saved ₱${discount.toFixed(2)}`)

    } catch (error) {
      console.error(error)
      toast.error('Error checking coupon.')
    } finally {
      setIsValidatingCoupon(false)
    }
  }

  // --- LOGIC: CHECKOUT ---
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const cleanPhone = sanitizePhone(formData.contact)

    if (cleanPhone.length < 10) {
        toast.error("Please enter a valid phone number.")
        setLoading(false)
        return
    }

    if (paymentMethod === 'GCASH' && refNumber.length < 5) {
        toast.error('Please enter a valid GCash Reference Number.')
        setLoading(false)
        return
    }

    try {
      if (appliedCoupon) {
         const { data: existingUsage } = await supabase
            .from('orders')
            .select('id')
            .eq('used_coupon_code', appliedCoupon)
            .ilike('customer_contact', `%${cleanPhone}%`)
            .limit(1)

         if (existingUsage && existingUsage.length > 0) {
            toast.error(`System detected this number has already used the code.`)
            setDiscountAmount(0)
            setAppliedCoupon(null)
            setLoading(false)
            return 
         }
      }

      for (const item of cart) {
        const { data: product } = await supabase
          .from('products')
          .select('stock, name')
          .eq('id', item.id)
          .single()

        if (!product || item.quantity > (product.stock || 0)) {
          toast.error(`Stock issue with ${item.name}.`)
          setLoading(false)
          return
        }
      }

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            customer_name: formData.name,
            customer_address: formData.address,
            customer_contact: cleanPhone,
            total_amount: totalAmount,
            discount_amount: discountAmount,
            used_coupon_code: appliedCoupon,
            payment_method: paymentMethod, 
            payment_ref: paymentMethod === 'GCASH' ? refNumber : null,
            status: 'pending'
          }
        ])
        .select() 

      if (orderError) throw orderError

      const newOrderId = orderData[0].id
      setOrderId(newOrderId)

      const orderItems = cart.map((item) => ({
        order_id: newOrderId,    
        product_id: item.id,
        quantity: item.quantity,
        price_at_purchase: item.price 
      }))

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
      if (itemsError) throw itemsError

      for (const item of cart) {
        const { data: curr } = await supabase.from('products').select('stock').eq('id', item.id).single()
        if (curr) {
          await supabase.from('products').update({ stock: Math.max(0, curr.stock - item.quantity) }).eq('id', item.id)
        }
      }

      clearCart()
      setSuccess(true)

    } catch (error) {
      console.error(error)
      toast.error('Failed to place order.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handlePhoneChange = (value: string) => {
    if (appliedCoupon) {
        setAppliedCoupon(null)
        setDiscountAmount(0)
        toast.info('Number changed. Coupon removed.')
    }
    setFormData({ ...formData, contact: value })
  }

  if (!isMounted) return null

  if (success) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-10 animate-in fade-in zoom-in duration-300">
        <div className="bg-green-100 p-4 rounded-full mb-4">
          <CheckCircle size={64} className="text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed!</h1>
        <p className="text-gray-500 max-w-md mb-6">
          Thank you, {formData.name}! We have received your order via {paymentMethod}.
        </p>
        {orderId && (
          <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl mb-6 w-full max-w-sm">
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Your Order ID</p>
            <div className="flex items-center justify-center gap-2 bg-white border border-gray-200 p-2 rounded-lg">
               <code className="text-sm sm:text-base font-mono font-bold text-gray-900 select-all break-all">{orderId}</code>
            </div>
          </div>
        )}
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Link href="/track" className="text-blue-600 hover:underline text-sm font-medium">Track your order here</Link>
          <Link href="/" className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition font-bold">Continue Shopping</Link>
        </div>
      </div>
    )
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/cart" className="inline-flex items-center text-gray-500 hover:text-black mb-6">
        <ArrowLeft size={20} className="mr-2" /> Back to Cart
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* --- LEFT SIDE: ORDER SUMMARY --- */}
        <div className="bg-gray-50 p-6 rounded-xl h-fit border border-gray-100 order-2 lg:order-1">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-4 max-h-75 overflow-y-auto pr-2">
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

          <div className="mt-6 pt-6 border-t border-gray-200">
             <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Promo Code</label>
             <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="WELCOME10" 
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm uppercase outline-none focus:border-black"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  disabled={appliedCoupon !== null} 
                />
                <button 
                   onClick={handleApplyCoupon}
                   disabled={isValidatingCoupon || appliedCoupon !== null || !couponCode}
                   className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-700 disabled:opacity-50"
                >
                   {appliedCoupon ? 'Applied' : 'Apply'}
                </button>
             </div>
          </div>
          
          <div className="border-t border-gray-200 mt-6 pt-4 space-y-2">
             <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>₱{subTotal.toFixed(2)}</span></div>
             
             {discountAmount > 0 && (
               <div className="flex justify-between text-green-600 font-medium animate-in fade-in">
                 <span className="flex items-center gap-1"><Tag size={14}/> Discount ({appliedCoupon})</span>
                 <span>-₱{discountAmount.toFixed(2)}</span>
               </div>
             )}

             <div className="flex justify-between text-gray-600"><span>Shipping</span><span className="text-green-600">Free</span></div>
             
             <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-dashed border-gray-300 mt-2">
                <span>Total</span>
                <span>₱{totalAmount.toFixed(2)}</span>
             </div>
          </div>
        </div>

        {/* --- RIGHT SIDE: FORM & PAYMENT --- */}
        <div className="sticky top-24 order-1 lg:order-2">
            <form onSubmit={handleCheckout} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input required name="name" type="text" placeholder="Juan Dela Cruz" className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-black transition" value={formData.name} onChange={handleChange} />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <PhoneInputCustom 
                    value={formData.contact} 
                    onChange={handlePhoneChange} 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Complete Address</label>
                  <textarea required name="address" rows={3} placeholder="Unit, Street, Barangay, City" className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-black transition resize-none" value={formData.address} onChange={handleChange} />
                </div>

                {/* --- PAYMENT METHOD SECTION --- */}
                <div className="pt-4 border-t border-gray-100">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Payment Method</label>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        {/* COD OPTION */}
                        <div 
                            onClick={() => setPaymentMethod('COD')}
                            className={`border rounded-xl p-4 cursor-pointer flex flex-col items-center justify-center transition ${paymentMethod === 'COD' ? 'border-black bg-gray-50 ring-1 ring-black' : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'}`}
                        >
                            <span className="font-bold text-gray-900">COD</span>
                            <span className="text-xs text-gray-500">Pay on delivery</span>
                        </div>

                        {/* GCASH OPTION (With Logo) */}
                        <div 
                            onClick={() => setPaymentMethod('GCASH')}
                            className={`border rounded-xl p-4 cursor-pointer flex flex-col items-center justify-center transition ${paymentMethod === 'GCASH' ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'}`}
                        >
                            {/* DITO NATIN NILAGAY YUNG LOGO BOSS */}
                            <div className="relative w-16 h-6 mb-1">
                                <Image 
                                    src="/gcash-logo.png" 
                                    alt="GCash" 
                                    fill 
                                    className="object-contain"
                                    sizes="64px"
                                />
                            </div>
                            <span className="text-xs text-gray-500">Scan to pay</span>
                        </div>
                    </div>

                    {/* QR Code & Reference Input */}
                    {paymentMethod === 'GCASH' && (
                        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl animate-in fade-in slide-in-from-top-2">
                            <div className="text-center mb-4">
                                <p className="text-sm text-blue-800 font-medium mb-2">Scan QR to Pay</p>
                                
                                {/* DITO NA LALABAS YUNG QR IMAGE MO BOSS */}
                                <div className="relative w-48 h-48 mx-auto border-2 border-dashed border-blue-200 rounded-lg overflow-hidden bg-white">
                                    <Image 
                                        src="/my-qr.jpg" 
                                        alt="Scan to Pay" 
                                        fill 
                                        className="object-cover"
                                        sizes="(max-width: 768px) 192px, 192px"
                                    />
                                </div>
                                
                                <p className="text-xs text-gray-500 mt-2">Total Amount: <span className="font-bold text-lg text-black">₱{totalAmount.toFixed(2)}</span></p>
                            </div>

                            <div className="bg-white p-3 rounded-lg border border-gray-200">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Reference Number</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter the Ref No. (e.g. 100234...)"
                                    className="w-full text-sm outline-none font-mono tracking-wider"
                                    value={refNumber}
                                    onChange={(e) => setRefNumber(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    )}
                </div>

                <button type="submit" disabled={loading} className="w-full bg-black text-white font-bold py-4 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center justify-center gap-2">
                  {loading ? <><Loader2 className="animate-spin" /> Processing...</> : `Place Order (${paymentMethod}) • ₱${totalAmount.toFixed(2)}`}
                </button>
            </form>
        </div>

      </div>
    </main>
  )
}