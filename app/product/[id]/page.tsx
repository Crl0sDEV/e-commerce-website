import { supabase } from '@/lib/supabaseClient'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Tag } from 'lucide-react'
import AddToCartButton from '@/components/AddToCartButton'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

interface Props {
    params: Promise<{ id: string }>
  }
  
  // 1. GENERATE METADATA FUNCTION
  export async function generateMetadata({ params }: Props): Promise<Metadata> {
    // Await params first (Next.js 15 requirement)
    const { id } = await params
  
    // Fetch product data
    const { data: product } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
  
    if (!product) {
      return {
        title: 'Product Not Found',
      }
    }
  
    return {
      title: product.name, // Browser Tab Title
      description: product.description,
      openGraph: {
        title: product.name,
        description: product.description,
        images: [
          {
            url: product.image_url, // Ito ang lalabas sa FB/Messenger Preview
            width: 800,
            height: 600,
            alt: product.name,
          },
        ],
      },
    }
  }

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  
  const { id } = await params

  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !product) {
    notFound()
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-10 min-h-screen">
      
      <Link href="/" className="inline-flex items-center text-gray-500 hover:text-black mb-8 transition">
        <ArrowLeft size={20} className="mr-2" /> Back to Store
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        
        {/* Product Image */}
        <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden shadow-sm">
          <Image 
            src={product.image_url} 
            alt={product.name}
            fill
            className="object-cover hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority 
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-center">
          
          <div className="mb-6">
            <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-4">
              <Tag size={12} />
              {product.category || 'Item'}
            </span>
            
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
              {product.name}
            </h1>
            
            <p className="text-2xl font-semibold text-gray-900">
              ₱{product.price}
            </p>
          </div>

          <div className="prose prose-sm text-gray-600 mb-8 border-t border-b border-gray-100 py-6">
            <p className="text-lg leading-relaxed">{product.description}</p>
          </div>

          <div className="mt-auto">
            <AddToCartButton product={product} />
            
            <p className="text-center text-xs text-gray-400 mt-4">
              Secure Checkout • Fast Delivery • Free Returns
            </p>
          </div>

        </div>

      </div>
    </main>
  )
}