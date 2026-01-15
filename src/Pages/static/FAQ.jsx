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
      answer: "Yes, you can cancel your booking up to 48 hours before the event for a full refund. To modify your booking, visit your 'My Tickets' section and select the event you wish to modify."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept various payment methods including credit cards, debit cards, Khalti, and eSewa. All transactions are secure and encrypted."
    },
    // ... rest of your FAQ data
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className="flex-grow bg-white min-h-screen">
      {/* Header - Simple Slate Gray instead of Purple Gradient */}
      <div className="bg-slate-50 border-b border-slate-200 py-16">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 text-center">
          <span className="text-indigo-600 font-bold tracking-widest uppercase text-xs">Help Center</span>
          <h1 className="text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-slate-500 text-lg mt-4 max-w-2xl mx-auto">
            Everything you need to know about the platform. Can't find the answer? Reach out to our team.
          </p>
        </div>
      </div>

      {/* Content - Narrower container for better readability */}
      <div className="max-w-3xl mx-auto px-4 lg:px-8 py-16">
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`border rounded-xl transition-all duration-200 ${
                openIndex === index 
                ? 'border-indigo-200 bg-indigo-50/30' 
                : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left"
              >
                <h3 className={`text-base font-semibold transition-colors ${
                  openIndex === index ? 'text-indigo-700' : 'text-slate-900'
                }`}>
                  {faq.question}
                </h3>
                <ChevronDown
                  size={20}
                  className={`text-slate-400 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180 text-indigo-600' : ''
                  }`}
                />
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-6 text-slate-600 leading-relaxed text-sm">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Support Section - Subtler styling */}
        <div className="mt-16 text-center border-t border-slate-100 pt-12">
          <h2 className="text-xl font-bold text-slate-900">Still have questions?</h2>
          <p className="text-slate-500 mt-2">
            Our friendly team is here to help you with any issues.
          </p>
          <div className="mt-8">
            <a
              href="/contact"
              className="inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 px-8 rounded-full transition shadow-sm"
            >
              Get in touch
            </a>
          </div>
        </div>
      </div>
    </main>
  );
};

export default FAQ;