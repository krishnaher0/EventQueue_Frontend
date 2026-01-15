import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: '63575446-7cc8-4a01-9e9b-0aa1969a7ac9',
          name: formData.name,
          email: formData.email,
          subject: `[Events Queue] ${formData.subject}`,
          message: formData.message,
          from_name: 'Events Queue Contact Form',
        }),
      });

      const result = await response.json();
      if (result.success) {
        setStatus({ type: 'success', message: 'Thank you! We will get back to you soon.' });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error('Failed');
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Something went wrong. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex-grow bg-white min-h-screen">
      {/* Header - Refined Slate Style */}
      <div className="bg-slate-50 border-b border-slate-200 py-16">
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          <span className="text-indigo-600 font-bold tracking-widest uppercase text-xs">Contact Us</span>
          <h1 className="text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">Let's start a conversation</h1>
          <p className="text-slate-500 text-lg mt-4 max-w-2xl">
            We'd love to hear from you. Whether you have a question about features, trials, pricing, or anything else, our team is ready to answer.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Left: Contact Details */}
          <div className="lg:col-span-5 space-y-12">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Contact Information</h2>
              <div className="space-y-8">
                {[
                  { icon: Mail, label: 'Email', val: 'support@eventqueue.com' },
                  { icon: Phone, label: 'Phone', val: '+977-1-1234567' },
                  { icon: MapPin, label: 'Office', val: 'Bhaisepati, Lalitpur, Nepal' }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center shrink-0">
                      <item.icon className="text-slate-600" size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">{item.label}</h4>
                      <p className="text-slate-600 mt-1">{item.val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Simple Business Hours Card */}
            <div className="p-8 bg-slate-900 rounded-2xl text-white shadow-xl">
              <h3 className="text-lg font-bold mb-4 text-indigo-400">Business Hours</h3>
              <div className="space-y-3 text-sm opacity-90">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span>Mon - Fri</span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span>Saturday</span>
                  <span>10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>24/7</span>
                  <span>Opened</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Modern Form Card */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-slate-200 rounded-2xl p-8 lg:p-10 shadow-sm transition-all hover:shadow-md">
              <h2 className="text-2xl font-bold text-slate-900 mb-8">Send us a Message</h2>

              {status.message && (
                <div className={`mb-8 flex items-center gap-3 p-4 rounded-xl text-sm ${
                  status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                }`}>
                  {status.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                  <span className="font-medium">{status.message}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1 ">Full Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="form-input-style border-2" placeholder="Sanam Thanet" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1 mr-24 w-1/2">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="form-input-style border-2" placeholder="sanam@example.com" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1 mr-4 ">Subject</label>
                  <input type="text" name="subject" value={formData.subject} onChange={handleChange} required className="form-input-style border-slate-900 border-2 w-full b" placeholder="How can we help you?" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1 mb-8 ">Message</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} required rows="4" className="form-input-style resize-none w-full pad2x px-2 border-2" placeholder="Write your message here..." />
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed">
                  {isSubmitting ? <><Loader2 className="h-5 w-5 animate-spin" /> Processing...</> : <><Send size={18} /> Send Message</>}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>

      {/* Tailwind Component CSS (Add to global CSS or use inline as above) */}
      <style>{`
        .form-input-style {
          @apply w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all duration-200 placeholder:text-slate-400 text-slate-700;
        }
      `}</style>
    </main>
  );
};

export default ContactPage;