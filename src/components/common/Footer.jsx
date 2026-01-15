import { Link } from 'react-router-dom';
import { Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-200 pt-20 pb-1 mt-auto">
      <div className="max-w-7xl mx-auto px-2 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          
          {/* Brand Section - Takes 4 columns */}
          <div className="lg:col-span-4">
            <Link to="/" className="inline-block mb-6">
              <img src="/logo/logo.png" alt="EventQ" className="h-16" />
            </Link>
            <p className="text-slate-500 text-lg leading-relaxed mb-8 max-w-sm">
              Connecting people through unforgettable experiences. The most trusted platform for discovering and booking premium events and venues.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: Twitter, href: "#" },
                { Icon: Instagram, href: "#" },
                { Icon: Linkedin, href: "#" }
              ].map((social, i) => (
                <a 
                  key={i} 
                  href={social.href} 
                  className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-600 hover:bg-indigo-50 transition-all duration-300"
                >
                  <social.Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Spacer for Desktop */}
          <div className="hidden lg:block lg:col-span-1"></div>

          {/* Links Sections - 7 columns remaining */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h4 className="text-slate-900 font-bold text-sm uppercase tracking-wider mb-6">Platform</h4>
              <ul className="space-y-4">
                <li><Link to="/events" className="footer-link">Discover</Link></li>
                <li><Link to="/shop" className="footer-link">Shops</Link></li>
                <li><Link to="/venues" className="footer-link">Venues</Link></li>
                <li><Link to="/blogs" className="footer-link">Articles</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-slate-900 font-bold text-sm uppercase tracking-wider mb-6">Support</h4>
              <ul className="space-y-4">
                <li><Link to="/faq" className="footer-link">Help Center</Link></li>
                <li><Link to="/contacts" className="footer-link">Contact Us</Link></li>
                <li><Link to="/terms" className="footer-link">Terms</Link></li>
                <li><Link to="/privacy" className="footer-link">Privacy</Link></li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h4 className="text-slate-900 font-bold text-sm uppercase tracking-wider mb-6">Contact</h4>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-slate-500 text-sm">
                  <Mail size={16} className="text-indigo-500" />
                  <span>support@eventq.com</span>
                </li>
                <li className="flex items-center gap-3 text-slate-500 text-sm">
                  <Phone size={16} className="text-indigo-500" />
                  <span>+977 1 1234567</span>
                </li>
                <li className="flex items-start gap-3 text-slate-500 text-sm">
                  <MapPin size={16} className="text-indigo-500 shrink-0 mt-0.5" />
                  <span>Lalitpur, Nepal</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-1 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-400 text-xs font-medium">
            &copy; {currentYear} EventQueue. Built with precision in Nepal.
          </p>
          
         
        </div>
      </div>

      <style>{`
        .footer-link {
          @apply text-slate-500 text-sm hover:text-indigo-600 transition-colors duration-200 font-medium;
        }
      `}</style>
    </footer>
  );
};

export default Footer;