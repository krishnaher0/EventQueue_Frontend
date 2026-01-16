import { Link } from 'react-router-dom';
import { Home, Search, Calendar, MapPin, ShoppingBag } from 'lucide-react';

const NotFound = () => {
  return (
    <main className="flex-grow bg-white min-h-screen">
      {/* Header Section */}
      <div className="bg-slate-50 border-b border-slate-200 py-16">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 text-center">
          <div className="inline-block">
            <span className="text-9xl font-extrabold text-indigo-600">404</span>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 mt-6 tracking-tight">
            Page Not Found
          </h1>
          <p className="text-slate-500 text-lg mt-4 max-w-2xl mx-auto">
            Sorry, we couldn't find the page you're looking for. The page may have been moved, deleted, or never existed.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-3xl mx-auto px-4 lg:px-8 py-16">
        {/* Quick Navigation */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Where would you like to go?</h2>
          <p className="text-slate-500">Here are some helpful links to get you back on track:</p>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <Link
            to="/"
            className="group border border-slate-200 rounded-xl p-6 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all duration-200"
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                <Home className="text-indigo-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Go Home</h3>
                <p className="text-sm text-slate-600">Return to the homepage and start fresh</p>
              </div>
            </div>
          </Link>

          <Link
            to="/events"
            className="group border border-slate-200 rounded-xl p-6 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all duration-200"
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                <Calendar className="text-indigo-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Browse Events</h3>
                <p className="text-sm text-slate-600">Discover upcoming events near you</p>
              </div>
            </div>
          </Link>

          <Link
            to="/venues"
            className="group border border-slate-200 rounded-xl p-6 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all duration-200"
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                <MapPin className="text-indigo-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Explore Venues</h3>
                <p className="text-sm text-slate-600">Find and book amazing venues</p>
              </div>
            </div>
          </Link>

          <Link
            to="/shop"
            className="group border border-slate-200 rounded-xl p-6 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all duration-200"
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                <ShoppingBag className="text-indigo-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Visit Shop</h3>
                <p className="text-sm text-slate-600">Browse our products and merchandise</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Help Section */}
        <div className="text-center border-t border-slate-100 pt-12">
          <h2 className="text-xl font-bold text-slate-900">Need help finding something?</h2>
          <p className="text-slate-500 mt-2">
            If you believe this is an error or need assistance, please contact our support team.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 px-8 rounded-full transition shadow-sm"
            >
              Contact Support
            </Link>
            <Link
              to="/faq"
              className="inline-flex items-center justify-center border border-slate-300 hover:border-slate-400 text-slate-700 font-medium py-3 px-8 rounded-full transition"
            >
              <Search size={18} className="mr-2" />
              Search FAQ
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
