import { Link, useSearchParams } from 'react-router-dom';

const PaymentFailure = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type');

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-sm p-12 max-w-md text-center">
        <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Failed</h1>
        <p className="text-gray-600 mb-8">
          Your payment could not be processed. Please try again or contact support if the issue persists.
        </p>

        <div className="space-y-3">
          {type === 'order' && (
            <Link
              to="/cart"
              className="block w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Return to Cart
            </Link>
          )}
          {type === 'event' && (
            <Link
              to="/events"
              className="block w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Browse Events
            </Link>
          )}
          {type === 'venue' && (
            <Link
              to="/venues"
              className="block w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Browse Venues
            </Link>
          )}
          <Link
            to="/"
            className="block w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;
