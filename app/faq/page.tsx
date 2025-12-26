import { HelpCircle } from 'lucide-react'

export const metadata = {
  title: 'FAQs | BossStore',
}

export default function FAQPage() {
  const faqs = [
    {
      question: "How long is the shipping time?",
      answer: "We ship nationwide! Metro Manila orders take 2-3 days, while provincial orders take 5-7 days."
    },
    {
      question: "Do you accept Cash on Delivery (COD)?",
      answer: "Yes! We accept COD for all orders nationwide. You pay only when you receive your item."
    },
    {
      question: "Can I return my item?",
      answer: "We offer a 7-day return policy for defective items. Please keep the original packaging and invoice."
    },
    {
      question: "Where is your physical store?",
      answer: "We are currently an online-exclusive store based in Metro Manila, ensuring the best prices for you."
    },
    {
      question: "How do I use a Promo Code?",
      answer: "On the Checkout page, look for the 'Promo Code' box before placing your order. Enter the code and click Apply."
    }
  ]

  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold mb-4 flex items-center justify-center gap-3">
          <HelpCircle size={40} className="text-black" /> Frequently Asked Questions
        </h1>
        <p className="text-gray-500 text-lg">
          Got questions? We&apos;ve got answers.
        </p>
      </div>

      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
            <h3 className="font-bold text-lg text-gray-900 mb-2">{faq.question}</h3>
            <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>
    </main>
  )
}