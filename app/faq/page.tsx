export default function FAQPage() {
    const faqs = [
      {
        q: "How long does shipping take?",
        a: "Standard shipping takes 3-5 business days within Metro Manila and 5-7 days for provincial areas."
      },
      {
        q: "What payment methods do you accept?",
        a: "Currently, we only accept Cash on Delivery (COD) to ensure trust and security for our customers."
      },
      {
        q: "Can I return my order?",
        a: "Yes! We have a 7-day return policy for defective items. Please contact our support team immediately."
      },
      {
        q: "Do you have a physical store?",
        a: "We are currently an online-exclusive store, which allows us to keep our prices low for you!"
      }
    ]
  
    return (
      <main className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h1>
        
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white border border-gray-200 p-6 rounded-xl hover:shadow-sm transition">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.q}</h3>
              <p className="text-gray-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </main>
    )
  }