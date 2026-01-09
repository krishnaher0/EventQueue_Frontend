const Terms = () => {
  return (
    <main className="flex-grow bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-slate-300">Last updated: January 3, 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-16">
        <div className="space-y-8 text-slate-700">
          
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Acceptance of Terms</h2>
            <p className="leading-relaxed">
              By accessing and using the EventQueue platform, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Use License</h2>
            <p className="leading-relaxed mb-4">
              Permission is granted to temporarily download one copy of the materials (information or software) on EventQueue for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Modifying or copying the materials</li>
              <li>Using the materials for any commercial purpose or for any public display</li>
              <li>Attempting to decompile, reverse engineer, disassemble, or otherwise reverse engineer any software contained on EventQueue</li>
              <li>Removing any copyright or other proprietary notations from the materials</li>
              <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Disclaimer</h2>
            <p className="leading-relaxed">
              The materials on EventQueue are provided on an 'as is' basis. EventQueue makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Limitations</h2>
            <p className="leading-relaxed">
              In no event shall EventQueue or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on EventQueue, even if EventQueue or an EventQueue authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Accuracy of Materials</h2>
            <p className="leading-relaxed">
              The materials appearing on EventQueue could include technical, typographical, or photographic errors. EventQueue does not warrant that any of the materials on its website are accurate, complete, or current. EventQueue may make changes to the materials contained on its website at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Links</h2>
            <p className="leading-relaxed">
              EventQueue has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by EventQueue of the site. Use of any such linked website is at the user's own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Modifications</h2>
            <p className="leading-relaxed">
              EventQueue may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Governing Law</h2>
            <p className="leading-relaxed">
              These terms and conditions are governed by and construed in accordance with the laws of Nepal, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">9. User Responsibilities</h2>
            <p className="leading-relaxed mb-4">
              As a user of EventQueue, you are responsible for:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Maintaining the confidentiality of your account information and password</li>
              <li>Accepting responsibility for all activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use of your account</li>
              <li>Complying with all applicable laws and regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Cancellation Policy</h2>
            <p className="leading-relaxed mb-4">
              Event cancellations are subject to the following terms:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Cancellations must be made at least 48 hours before the event for a full refund</li>
              <li>Cancellations made less than 48 hours before the event may incur a cancellation fee</li>
              <li>EventQueue reserves the right to cancel events in case of force majeure or unforeseen circumstances</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Contact Information</h2>
            <p className="leading-relaxed">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <ul className="list-none space-y-2 ml-4 mt-4">
              <li><strong>Email:</strong> support@eventqueue.com</li>
              <li><strong>Phone:</strong> +1 (555) 123-4567</li>
              <li><strong>Address:</strong> Bhaisepati, Lalitpur, Nepal</li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Terms;
