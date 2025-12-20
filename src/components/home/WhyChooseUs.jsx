const features = [
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
        <path d="M9 16l2 2 4-4"/>
      </svg>
    ),
    title: 'Easy Booking',
    description: 'Book tickets in seconds with our streamlined checkout process. No hassle, just pure excitement.'
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: 'Community First',
    description: 'Join a vibrant community of event lovers. Share experiences and discover events together.'
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="1.5">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        <circle cx="12" cy="16" r="1"/>
      </svg>
    ),
    title: 'Secure Payments',
    description: 'Your transactions are protected with bank-level security. Book with confidence, every time.'
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="1.5">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
    title: 'Curated Selection',
    description: 'Handpicked events tailored to your interests. Quality over quantity, always.'
  }
];

const WhyChooseUs = () => {
  return (
    <section className="bg-slate-50 py-16 px-4 lg:px-8 xl:px-12">
      <div className="w-full">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-2">Why Choose EventQueue?</h2>
          <p className="text-slate-500">We make event discovery and booking effortless, so you can focus on what matters most – creating memories.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-xl text-center">
              <div className="mb-5 flex justify-center">{feature.icon}</div>
              <h3 className="font-semibold text-lg mb-3">{feature.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
