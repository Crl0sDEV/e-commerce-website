import { ScrollText, Truck, RefreshCcw, AlertTriangle } from 'lucide-react'

export const metadata = {
  title: 'Terms & Conditions | BossStore',
}

export default function TermsPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4 flex items-center justify-center gap-3">
          <ScrollText size={40} className="text-black" /> Terms & Conditions
        </h1>
        <p className="text-gray-500">Please read carefully before placing an order.</p>
      </div>

      <div className="space-y-8 text-gray-700 leading-relaxed">
        
        {/* Section 1 */}
        <section>
          <h3 className="text-lg font-bold text-black mb-2 flex items-center gap-2">
            <Truck size={18} /> 1. Ordering & Delivery
          </h3>
          <p className="text-sm">
            By placing an order, you agree to pay the full amount stated. For Cash on Delivery (COD) orders, please ensure someone is available to receive and pay for the item. Repeated failed deliveries may result in banning from our store.
          </p>
        </section>

        {/* Section 2 */}
        <section>
          <h3 className="text-lg font-bold text-black mb-2 flex items-center gap-2">
            <AlertTriangle size={18} /> 2. Payments (GCash/Maya)
          </h3>
          <p className="text-sm">
            For online payments, customers must upload or input the correct <strong>Reference Number</strong>. BossStore reserves the right to cancel orders with invalid or falsified payment details.
          </p>
        </section>

        {/* Section 3 */}
        <section>
          <h3 className="text-lg font-bold text-black mb-2 flex items-center gap-2">
            <RefreshCcw size={18} /> 3. Return & Refund Policy
          </h3>
          <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
            <li>We accept returns within <strong>7 days</strong> of receipt for defective items only.</li>
            <li>Items must be unused and in original packaging.</li>
            <li>&quot;Change of Mind&quot; is not a valid reason for return/refund under PH Consumer Law.</li>
            <li>Customer handles the return shipping fee unless the item was sent in error.</li>
          </ul>
        </section>

        <section className="bg-gray-50 p-4 rounded-lg text-sm text-gray-500 mt-8">
          Disclaimer: BossStore is a demo e-commerce platform. These terms are subject to change without prior notice.
        </section>

      </div>
    </main>
  )
}