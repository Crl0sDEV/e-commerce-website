import Link from 'next/link'
import { Store, Heart, ShieldCheck, Truck } from 'lucide-react'

export const metadata = {
  title: 'About Us | BossStore',
}

export default function AboutPage() {
  return (
    <main>
      {/* Hero Section */}
      <div className="bg-black text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6">Our Story</h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          We are BossStore. We believe that premium quality shouldn&apos;t break the bank.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        
        {/* Mission / Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div className="relative h-100 bg-gray-100 rounded-2xl overflow-hidden">
            {/* Placeholder Image - Pwede mong palitan ng actual image */}
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-400">
               <Store size={64} />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-6">Designed for the Modern Boss</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Founded in 2024, BossStore started with a simple mission: to provide high-quality essentials accessible to everyone. 
              We curate items that blend style, functionality, and durability.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Whether you are looking for the perfect outfit for your next meeting or gadgets to boost your productivity, 
              we have got you covered.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 border border-gray-200 rounded-xl text-center">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck size={24} />
            </div>
            <h3 className="font-bold text-lg mb-2">Authentic Quality</h3>
            <p className="text-gray-500 text-sm">We guarantee that every item you purchase is 100% original and high quality.</p>
          </div>
          <div className="p-8 border border-gray-200 rounded-xl text-center">
             <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart size={24} />
            </div>
            <h3 className="font-bold text-lg mb-2">Customer First</h3>
            <p className="text-gray-500 text-sm">Our support team is available 24/7 to assist you with any concerns.</p>
          </div>
          <div className="p-8 border border-gray-200 rounded-xl text-center">
             <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck size={24} />
            </div>
            <h3 className="font-bold text-lg mb-2">Fast Delivery</h3>
            <p className="text-gray-500 text-sm">We ensure your orders arrive safe and on time, anywhere in the Philippines.</p>
          </div>
        </div>
        
        {/* CTA */}
        <div className="text-center mt-20">
          <Link href="/" className="bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-gray-800 transition">
            Start Shopping
          </Link>
        </div>

      </div>
    </main>
  )
}