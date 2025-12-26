import { supabase } from '@/lib/supabaseClient'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Tag } from 'lucide-react'
import AddToCartButton from '@/components/AddToCartButton'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import ProductCard from '@/components/ProductCard'

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

  export default async function ProductPage({ params }: Props) {
    const { id } = await params
  
    // 1. Fetch CURRENT Product
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
  
    if (error || !product) {
      notFound()
    }
  
    // 2. Fetch RELATED Products
    const { data: relatedProducts } = await supabase
      .from('products')
      .select('*')
      .eq('category', product.category) // Same category
      .neq('id', product.id)            // NOT the current ID (neq = not equal)
      .limit(4)                         // 4 items lang
  
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <Link href="/" className="inline-flex items-center text-gray-500 hover:text-black mb-8 transition">
        <ArrowLeft size={20} className="mr-2" /> Back to Store
      </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
          
          {/* Left: Image */}
          <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <Image 
              src={product.image_url} 
              alt={product.name} 
              fill 
              className="object-cover"
              priority
            />
          </div>
  
          {/* Right: Info */}
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-2">
            <Tag size={12} />
              {product.category}
            </span>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{product.name}</h1>
            <p className="text-2xl font-bold text-gray-900 mb-6">₱{product.price}</p>
            
            <div className="prose prose-sm text-gray-600 mb-8">
              <p>{product.description}</p>
            </div>
  
            <div className="mt-auto">
               {/* Stock Indicator */}
               <div className="mb-4">
                  {product.stock > 0 ? (
                    <p className="text-green-600 font-medium flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
                      In Stock ({product.stock} available)
                    </p>
                  ) : (
                    <p className="text-red-600 font-bold">Out of Stock</p>
                  )}
               </div>
  
               <AddToCartButton product={product} />
            </div>
          </div>
        </div>
  
        {/* --- NEW: RELATED PRODUCTS SECTION --- */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="border-t border-gray-200 pt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">You might also like</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((related) => (
                <ProductCard key={related.id} product={related} />
              ))}
            </div>
          </div>
        )}
  
      </main>
    )
  }