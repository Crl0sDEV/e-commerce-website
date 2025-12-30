'use client'

import { useEffect, useState, useCallback } from 'react' // Added useCallback
import { supabase } from '@/lib/supabaseClient'
import StarRating from './StarRating'
import Image from 'next/image'
import { UserCircle } from 'lucide-react'

interface Review {
  id: string
  rating: number
  comment: string
  created_at: string
  user_id: string
  profiles: {
    full_name: string
    avatar_url: string | null
  } | null
}

interface ProductReviewsProps {
  productId: string
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [average, setAverage] = useState(0)

  // 1. Fetch Reviews & Calculate Average
  // WRAPPED IN USECALLBACK TO FIX DEPENDENCY WARNING
  const fetchReviews = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id, rating, comment, created_at, user_id,
          profiles (full_name, avatar_url)
        `)
        .eq('product_id', productId)
        .order('created_at', { ascending: false })

      if (error) throw error

      const fetchedReviews = data as unknown as Review[]
      setReviews(fetchedReviews)

      // Calculate Average
      if (fetchedReviews.length > 0) {
        const total = fetchedReviews.reduce((sum, r) => sum + r.rating, 0)
        setAverage(total / fetchedReviews.length)
      }

    } catch (error) {
      console.error("Error loading reviews:", error)
    } finally {
      setLoading(false)
    }
  }, [productId])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  if (loading) return <div className="py-10 text-center text-gray-400">Loading reviews...</div>

  return (
    <div className="mt-16 border-t border-gray-200 pt-10">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h3>

      {/* --- SUMMARY SECTION --- */}
      <div className="flex items-center gap-4 mb-10 bg-gray-50 p-6 rounded-xl border border-gray-100">
        <div className="text-center">
            <span className="text-5xl font-black text-gray-900 block">{average.toFixed(1)}</span>
            <span className="text-xs text-gray-500 uppercase font-bold tracking-wide">out of 5</span>
        </div>
        
        <div className="h-12 w-px bg-gray-200 mx-2"></div>
        
        <div>
            <StarRating rating={Math.round(average)} size={24} />
            <p className="text-sm text-gray-500 mt-1">{reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}</p>
        </div>
      </div>

      {/* --- REVIEW LIST --- */}
      {reviews.length === 0 ? (
        <p className="text-gray-500 italic">No reviews yet. Be the first to review this product!</p>
      ) : (
        <div className="space-y-8">
            {reviews.map((review) => (
                <div key={review.id} className="flex gap-4 animate-in fade-in slide-in-from-bottom-2">
                    {/* AVATAR */}
                    <div className="relative w-10 h-10 bg-gray-200 rounded-full overflow-hidden shrink-0">
                        {review.profiles?.avatar_url ? (
                            <Image 
                                src={review.profiles.avatar_url} 
                                alt="User" 
                                fill 
                                className="object-cover" 
                                sizes="40px"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <UserCircle size={24} />
                            </div>
                        )}
                    </div>

                    {/* CONTENT */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                            <h4 className="font-bold text-gray-900 text-sm">
                                {review.profiles?.full_name || 'Anonymous User'}
                            </h4>
                            <span className="text-xs text-gray-400">
                                {new Date(review.created_at).toLocaleDateString()}
                            </span>
                        </div>
                        
                        <div className="mb-2">
                            <StarRating rating={review.rating} size={14} />
                        </div>
                        
                        <p className="text-gray-600 text-sm leading-relaxed">
                            {review.comment || <span className="italic text-gray-400">No comment provided.</span>}
                        </p>
                    </div>
                </div>
            ))}
        </div>
      )}
    </div>
  )
}