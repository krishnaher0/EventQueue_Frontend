const Privacy = () => {
  return (
    <main className="flex-grow bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-700 to-emerald-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-emerald-100">Last updated: January 3, 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-16">
        <div className="space-y-8 text-slate-700">
          
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Introduction</h2>
            <p className="leading-relaxed">
              EventQueue ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Information We Collect</h2>
            <p className="leading-relaxed mb-4">
              We collect information in the following ways:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Personal Information:</strong> Name, email address, phone number, address, and payment information when you create an account or make a booking</li>
              <li><strong>Usage Information:</strong> Pages visited, time spent, links clicked, and search queries</li>
              <li><strong>Device Information:</strong> IP address, browser type, operating system, and device identifiers</li>
              <li><strong>Cookies:</strong> We use cookies and similar tracking technologies to enhance your experience</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. How We Use Your Information</h2>
            <p className="leading-relaxed mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Process your bookings and payments</li>
              <li>Send you transactional emails and booking confirmations</li>
              <li>Provide customer support and respond to your inquiries</li>
              <li>Improve our services and website functionality</li>
              <li>Comply with legal obligations and enforce our agreements</li>
              <li>Send promotional emails (with your consent)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Data Security</h2>
            <p className="leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your personal information, we cannot guarantee its absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Third-Party Sharing</h2>
            <p className="leading-relaxed mb-4">
              We do not sell, trade, or rent your personal information to third parties. However, we may share your information with:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Service providers who assist us in operating our website and conducting our business</li>
              <li>Payment processors to facilitate transactions</li>
              <li>Event organizers and venue owners for booking fulfillment</li>
              <li>Legal authorities when required by law</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Your Rights</h2>
            <p className="leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Access, correct, or delete your personal information</li>
              <li>Opt-out of promotional communications</li>
              <li>Request a copy of your data in a portable format</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p className="leading-relaxed mt-4">
              To exercise these rights, please contact us at privacy@eventqueue.com.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Cookies</h2>
            <p className="leading-relaxed">
              Our website uses cookies to enhance user experience. Most web browsers automatically accept cookies, but you can usually modify your browser settings to decline cookies. Disabling cookies may affect the functionality of our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Children's Privacy</h2>
            <p className="leading-relaxed">
              EventQueue is not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information and terminate the child's account immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">9. International Data Transfer</h2>
            <p className="leading-relaxed">
              Your information may be transferred to and maintained on servers located outside your state, province, country, or other governmental jurisdiction where privacy laws may not be as protective as those in your location.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Changes to This Privacy Policy</h2>
            <p className="leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new Privacy Policy on our website and updating the "Last Updated" date at the top of this page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Contact Us</h2>
            <p className="leading-relaxed mb-4">
              If you have questions about this Privacy Policy or our privacy practices, please contact us at:
            </p>
            <ul className="list-none space-y-2 ml-4 mt-4">
              <li><strong>Email:</strong> privacy@eventqueue.com</li>
              <li><strong>Support:</strong> support@eventqueue.com</li>
              <li><strong>Phone:</strong> +1 (555) 123-4567</li>
              <li><strong>Address:</strong> Bhaisepati, Lalitpur, Nepal</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Data Retention</h2>
            <p className="leading-relaxed">
              We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this Privacy Policy. You may request deletion of your data at any time, subject to legal retention requirements.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Privacy;
