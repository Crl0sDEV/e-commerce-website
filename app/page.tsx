import { supabase } from '@/lib/supabaseClient'
import ProductGrid from '@/components/ProductGrid' // <--- Import natin yung bago

// Revalidate data every 0 seconds (Always fresh) or 60 (Cache for 1 min)
export const revalidate = 0 

export default async function Home() {
  // 1. Fetch ALL products
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error)
    return <div className="p-10 text-center text-red-500">Failed to load products.</div>
  }

  // 2. Render the Page
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Hero / Welcome Message */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl mb-4">
          Boss Store Collections
        </h1>
        <p className="max-w-xl mx-auto text-lg text-gray-500">
          The best quality items for the best price. Check out our latest drops below.
        </p>
      </div>

      {/* 3. Pass data to the Client Component */}
      {products && <ProductGrid products={products} />}

    </main>
  )
}