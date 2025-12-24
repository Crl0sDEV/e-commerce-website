import Link from 'next/link'
import { FileQuestion } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="bg-gray-100 p-6 rounded-full mb-6 animate-bounce">
        <FileQuestion size={64} className="text-gray-400" />
      </div>
      
      <h1 className="text-4xl font-extrabold text-gray-900 mb-2">404 - Page Not Found</h1>
      <p className="text-gray-500 max-w-md mb-8">
        Oops! Parang naligaw ka boss. Baka nabura na yung page o mali lang ang spelling ng URL.
      </p>

      <Link 
        href="/" 
        className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
      >
        Back to Home
      </Link>
    </div>
  )
}