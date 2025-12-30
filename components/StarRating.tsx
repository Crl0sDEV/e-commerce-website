'use client'

import { Star } from 'lucide-react'

interface StarRatingProps {
  rating: number          // Current rating (0-5)
  editable?: boolean      // Pwede ba palitan? (Yes sa form, No sa display)
  onChange?: (rating: number) => void // Function pag kinlick
  size?: number           // Laki ng icon
}

export default function StarRating({ 
  rating, 
  editable = false, 
  onChange,
  size = 20 
}: StarRatingProps) {
  
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!editable}
          onClick={() => editable && onChange && onChange(star)}
          className={`${editable ? 'cursor-pointer hover:scale-110 transition' : 'cursor-default'}`}
        >
          <Star 
            size={size} 
            className={`${
              star <= rating 
                ? 'fill-yellow-400 text-yellow-400' // Puno
                : 'fill-gray-100 text-gray-300'     // Bakante
            }`} 
          />
        </button>
      ))}
    </div>
  )
}