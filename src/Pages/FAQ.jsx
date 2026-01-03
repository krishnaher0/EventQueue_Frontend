import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How do I book an event?",
      answer: "To book an event, simply browse our Events section, select your desired event, and click the 'Book Now' button. Follow the checkout process to complete your booking. You'll receive a confirmation email with your ticket details."
    },
    {
      question: "Can I cancel or modify my booking?",
      answer: "Yes, you can cancel your booking up to 48 hours before the event for a full refund. To modify your booking, visit your 'My Tickets' section and select the event you wish to modify. Note: Modifications are subject to availability."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept various payment methods including credit cards, debit cards, Khalti, and eSewa. All transactions are secure and encrypted."
    },
    {
      question: "How do I become an event organizer?",
      answer: "To become an event organizer, visit our 'Request Host' page and fill out the application form. Our team will review your application and get back to you within 5-7 business days."
    },
    {
      question: "Can I book a venue through EventQueue?",
      answer: "Yes! We offer a comprehensive venue booking service. Browse available venues in our Venues section, check availability, and make your reservation. You can also filter by location, capacity, and amenities."
    },
    {
      question: "How do I contact customer support?",
      answer: "You can reach our customer support team through the Contact Us page, via email at support@eventqueue.com, or by calling +1 (555) 123-4567. We're available Monday-Saturday, 9 AM to 6 PM."
    },
    {
      question: "Is there a loyalty or rewards program?",
      answer: "Currently, we're developing an exclusive loyalty program for our frequent users. Stay tuned for more details! Subscribe to our newsletter to be notified when it launches."
    },
    {
      question: "How secure is my personal information?",
      answer: "We take data security seriously. All personal information is encrypted and stored securely following industry standards. We never share your data with third parties without your consent."
    },
    {
      question: "Can I view my booking history?",
      answer: "Yes, you can access your complete booking history in your Profile section. This includes past events, upcoming bookings, and downloadable tickets."
    },
    {
      question: "Do you offer group discounts?",
      answer: "Yes! For group bookings of 10 or more people, we offer special discounts. Please contact our support team at support@eventqueue.com with your group size and event details for a customized quote."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className="flex-grow bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-purple-100 text-lg">Find answers to common questions about EventQueue</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-16">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition text-left"
              >
                <h3 className="text-lg font-semibold text-slate-900">{faq.question}</h3>
                <ChevronDown
                  size={24}
                  className={`text-purple-600 flex-shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              {openIndex === index && (
                <div className="px-6 py-4 bg-white border-t border-slate-200">
                  <p className="text-slate-700 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 p-8 bg-purple-50 rounded-lg border border-purple-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Still have questions?</h2>
          <p className="text-slate-700 mb-6">
            Can't find the answer you're looking for? Please reach out to our support team.
          </p>
          <a
            href="/contact"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            Contact Support
          </a>
        </div>
      </div>
    </main>
  );
};

export default FAQ;
