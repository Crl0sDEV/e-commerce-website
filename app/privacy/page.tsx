import { ShieldCheck, Lock, Eye } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy | BossStore',
}

export default function PrivacyPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4 flex items-center justify-center gap-3">
          <ShieldCheck size={40} className="text-green-600" /> Privacy Policy
        </h1>
        <p className="text-gray-500">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      <div className="space-y-8 text-gray-700 leading-relaxed">
        
        {/* Section 1 */}
        <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Eye size={20} /> 1. Information We Collect
          </h2>
          <p className="mb-2">We collect only the information necessary to process and deliver your orders:</p>
          <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
            <li>Full Name</li>
            <li>Delivery Address</li>
            <li>Phone Number (for courier coordination)</li>
            <li>Payment Details (GCash Reference Numbers)</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Lock size={20} /> 2. How We Use Your Data
          </h2>
          <p>Your data is strictly used for:</p>
          <ul className="list-disc list-inside space-y-1 ml-4 text-sm mt-2">
            <li>Processing your orders and generating invoices.</li>
            <li>Coordinating with our courier partners (J&T, Lalamove, etc.) for delivery.</li>
            <li>Sending you order updates via SMS or Email.</li>
          </ul>
          <p className="mt-4 font-semibold text-black">
            We do NOT sell, share, or trade your personal information to third parties for marketing purposes.
          </p>
        </section>

        {/* Section 3 */}
        <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-3">3. Data Security</h2>
          <p>
            We implement strict security measures to protect your personal information. Our database is secured with enterprise-grade encryption (Supabase) and access is restricted only to authorized personnel.
          </p>
        </section>

        {/* Section 4 */}
        <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-3">4. Your Rights</h2>
          <p>
            Under the Data Privacy Act of 2012, you have the right to access, correct, or request the deletion of your personal data from our system. Contact us if you wish to exercise these rights.
          </p>
        </section>

      </div>
    </main>
  )
}