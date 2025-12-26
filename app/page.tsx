import { supabase } from '@/lib/supabaseClient'
import ProductGrid from '@/components/ProductGrid'
import Hero from '@/components/Hero'

export const revalidate = 0 

export default async function Home() {
  
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error)
    return <div className="p-10 text-center text-red-500">Failed to load products.</div>
  }

  return (
    <>
      <Hero />

      <main id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {products && <ProductGrid products={products} />}

      </main>
    </>
  )
}