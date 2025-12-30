'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Loader2, Package, ChevronRight, Clock, ShoppingBag, Star, X } from 'lucide-react'
import useUserStore from '@/store/useUserStore'
import { toast } from 'sonner'
import StarRating from '@/components/StarRating' // IMPORT STAR RATING

// Types
interface OrderItem {
  id: string
  product_id: string // Need natin product_id para sa review connection
  quantity: number
  price_at_purchase: number
  products: {
    name: string
    image_url: string
  } | null
}

interface Order {
  id: string
  created_at: string
  status: string
  total_amount: number
  payment_method: string
  order_items: OrderItem[]
}

export default function MyOrdersPage() {
  const router = useRouter()
  const { user, loading: userLoading } = useUserStore()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  // REVIEW MODAL STATES
  const [isReviewOpen, setIsReviewOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<{orderId: string, productId: string, productName: string, productImg: string} | null>(null)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)

  useEffect(() => {
    if (!userLoading && !user) {
        router.push('/login')
        return
    }

    const fetchOrders = async () => {
        if (!user) return
        try {
            const { data, error } = await supabase
                .from('orders')
                .select(`
                    id, created_at, status, total_amount, payment_method,
                    order_items (
                        id, product_id, quantity, price_at_purchase,
                        products (name, image_url)
                    )
                `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (error) throw error
            setOrders(data as unknown as Order[])
        } catch (error) {
            console.error('Error fetching orders:', error)
        } finally {
            setLoading(false)
        }
    }

    if (user) fetchOrders()
  }, [user, userLoading, router])

  // --- REVIEW HANDLERS ---
  const openReviewModal = (orderId: string, item: OrderItem) => {
      setSelectedItem({
          orderId,
          productId: item.product_id,
          productName: item.products?.name || 'Item',
          productImg: item.products?.image_url || ''
      })
      setRating(5)
      setComment('')
      setIsReviewOpen(true)
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!selectedItem || !user) return
      setSubmittingReview(true)

      try {
          // Check if already reviewed (Optional: Depende kung gusto mo allow multiple reviews)
          const { data: existing } = await supabase
            .from('reviews')
            .select('id')
            .eq('order_id', selectedItem.orderId)
            .eq('product_id', selectedItem.productId)
            .single()

          if (existing) {
              toast.error("You have already reviewed this item.")
              setIsReviewOpen(false)
              return
          }

          const { error } = await supabase.from('reviews').insert({
              user_id: user.id,
              product_id: selectedItem.productId,
              order_id: selectedItem.orderId,
              rating: rating,
              comment: comment
          })

          if (error) throw error

          toast.success("Review submitted! Thank you.")
          setIsReviewOpen(false)

      } catch (error) {
          console.error(error)
          toast.error("Failed to submit review.")
      } finally {
          setSubmittingReview(false)
      }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'paid': return 'bg-blue-100 text-blue-800'
      case 'shipped': return 'bg-purple-100 text-purple-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (userLoading || loading) {
    return <div className="h-[60vh] flex items-center justify-center"><Loader2 className="animate-spin text-gray-400" size={32} /></div>
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 relative">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <Package className="text-black" /> Order History
        </h1>

        {orders.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
                <ShoppingBag size={48} className="text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h2>
                <Link href="/" className="bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition inline-block mt-4">Start Shopping</Link>
            </div>
        ) : (
            <div className="space-y-6">
                {orders.map((order) => (
                    <div key={order.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition duration-200">
                        {/* HEADER */}
                        <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100">
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold tracking-wide mb-1">Order Placed</p>
                                <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                                    <Clock size={14} className="text-gray-400"/>
                                    {new Date(order.created_at).toLocaleDateString()} 
                                    <span className="text-gray-300">|</span>
                                    <span className="font-mono text-gray-500">#{order.id.slice(0, 8)}</span>
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                                {order.status}
                            </span>
                        </div>

                        {/* ITEMS */}
                        <div className="p-6">
                            <div className="space-y-4">
                                {order.order_items.map((item) => (
                                    <div key={item.id} className="flex flex-col sm:flex-row gap-4 sm:items-center">
                                        <div className="flex gap-4 flex-1">
                                            <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                                                {item.products?.image_url && (
                                                    <Image src={item.products.image_url} alt={item.products.name} fill className="object-cover" sizes="64px"/>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 line-clamp-1">{item.products?.name || 'Unknown Item'}</p>
                                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                                <p className="text-sm font-medium mt-1">₱{item.price_at_purchase.toLocaleString()}</p>
                                            </div>
                                        </div>

                                        {/* WRITE REVIEW BUTTON (Only if Delivered) */}
                                        {order.status === 'delivered' && (
                                            <button 
                                                onClick={() => openReviewModal(order.id, item)}
                                                className="text-sm border border-gray-300 px-4 py-2 rounded-lg hover:bg-black hover:text-white transition flex items-center gap-2 w-full sm:w-auto justify-center"
                                            >
                                                <Star size={16} /> Rate Item
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        {/* FOOTER */}
                        <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
                            <Link 
                                href={`/track?id=${order.id}`} 
                                className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1"
                            >
                                Track Order <ChevronRight size={16} />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {/* --- REVIEW MODAL --- */}
        {isReviewOpen && selectedItem && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
                <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-in zoom-in-95">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold">Write a Review</h3>
                        <button onClick={() => setIsReviewOpen(false)} className="text-gray-400 hover:text-black">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="flex items-center gap-4 mb-6 bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <div className="relative w-12 h-12 bg-white rounded overflow-hidden border border-gray-200">
                            {selectedItem.productImg && <Image src={selectedItem.productImg} alt="Product" fill className="object-cover"/>}
                        </div>
                        <p className="font-medium text-sm line-clamp-1">{selectedItem.productName}</p>
                    </div>

                    <form onSubmit={handleSubmitReview} className="space-y-4">
                        <div className="flex flex-col items-center gap-2 mb-4">
                            <label className="text-sm font-bold text-gray-500 uppercase tracking-wide">Rate Product</label>
                            <StarRating rating={rating} editable={true} onChange={setRating} size={32} />
                            <p className="text-xs text-gray-400">Tap stars to rate</p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Your Experience</label>
                            <textarea 
                                rows={4}
                                required
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="What did you like about the product?"
                                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={submittingReview}
                            className="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition disabled:opacity-50 flex justify-center"
                        >
                            {submittingReview ? <Loader2 className="animate-spin" /> : "Submit Review"}
                        </button>
                    </form>
                </div>
            </div>
        )}
    </main>
  )
}