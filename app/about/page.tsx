import { Store } from 'lucide-react'

export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-16 text-center">
      <div className="flex justify-center mb-6">
        <div className="bg-black p-4 rounded-2xl">
          <Store className="text-white" size={48} />
        </div>
      </div>
      
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6">About BossStore</h1>
      
      <div className="prose prose-lg mx-auto text-gray-600 space-y-6">
        <p>
          Welcome to <strong>BossStore</strong>, your number one source for all things premium. 
          We&apos;re dedicated to giving you the very best of clothing and accessories, with a focus on 
          dependability, customer service, and uniqueness.
        </p>
        <p>
          Founded in 2024, BossStore has come a long way from its beginnings in a home office. 
          When we first started out, our passion for &quot;Eco-friendly products&quot; drove us to do intense research, 
          so that BossStore can offer you the world&apos;s most advanced fashion. 
        </p>
        <p>
          We hope you enjoy our products as much as we enjoy offering them to you. 
          If you have any questions or comments, please don&apos;t hesitate to contact us.
        </p>
        
        <p className="font-bold pt-4 text-gray-900">Sincerely,<br/>The Boss</p>
      </div>
    </main>
  )
}