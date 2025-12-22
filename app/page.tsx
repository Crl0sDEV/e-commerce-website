import { supabase } from '@/lib/supabaseClient'
import ProductCard from '@/components/ProductCard'
import { Product } from '@/types'

// Ito ay async function kasi mag-aantay tayo sa database
export default async function Home() {
  
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false }) // Newest first

  // 2. Error Handling (Basic)
  if (error) {
    console.error('Error fetching products:', error)
    return <div className="p-10 text-center text-red-500">May error sa pag-load ng products.</div>
  }

  // 3. Render
  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      
      {/* Hero / Header Section */}
      <section className="bg-white border-b py-16 px-4 mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
          My Awesome Store
        </h1>
        <p className="text-gray-500 text-lg">
          The best items for the best price.
        </p>
      </section>

      {/* Product Grid Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {!products || products.length === 0 ? (
          // Empty State
          <div className="text-center py-20 text-gray-500">
            Wala pang products boss. Mag-add ka muna sa Database.
          </div>
        ) : (
          // Grid Layout
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </main>
  )
}