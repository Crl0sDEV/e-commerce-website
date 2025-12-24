export default function Loading() {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Hero Skeleton */}
        <div className="text-center mb-12 space-y-4 animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
  
        {/* Product Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
              {/* Image Box */}
              <div className="h-64 bg-gray-200 animate-pulse"></div>
              
              <div className="p-5 space-y-3">
                {/* Title Lines */}
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
                
                {/* Price & Button */}
                <div className="flex justify-between items-center pt-4">
                  <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
      </main>
    )
  }