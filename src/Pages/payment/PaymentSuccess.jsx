import { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { paymentsAPI } from '../services/api';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState('');
  const verificationAttempted = useRef(false);

  // Parse type, data, and method - handle eSewa's malformed URL issue
  // eSewa sometimes returns: ?type=venue?data=... instead of ?type=venue&data=...
  let type = searchParams.get('type');
  let data = searchParams.get('data');
  let method = searchParams.get('method'); // 'khalti' or 'esewa'

  // Khalti specific params
  const pidx = searchParams.get('pidx');
  const transactionId = searchParams.get('transaction_id');
  const khaltiStatus = searchParams.get('status');

  // Fix: If type contains "?data=", split it properly
  if (type && type.includes('?data=')) {
    const parts = type.split('?data=');
    type = parts[0];
    data = parts[1];
  }

  // Also check if data is in the URL hash or after a second ?
  if (!data) {
    const fullUrl = window.location.href;
    const dataMatch = fullUrl.match(/[?&]data=([^&]+)/);
    if (dataMatch) {
      data = dataMatch[1];
    }
  }

  // Debug: log all params and full URL
  useEffect(() => {
    console.log('Payment Success - Full URL:', window.location.href);
    console.log('Payment Success - All params:', Object.fromEntries(searchParams.entries()));
    console.log('Data param:', data);
    console.log('Type param:', type);

    // Try to decode if data exists and looks URL encoded
    if (data) {
      try {
        // Decode the base64 data to see what's inside
        const decoded = atob(data);
        console.log('Decoded data:', decoded);
        const parsed = JSON.parse(decoded);
        console.log('Parsed data:', parsed);
      } catch (e) {
        console.log('Could not decode/parse data:', e.message);
      }
    }
  }, [searchParams, data, type]);

  useEffect(() => {
    // Prevent double verification
    if (verificationAttempted.current) return;

    console.log('PaymentSuccess useEffect - data:', data, 'type:', type, 'method:', method, 'pidx:', pidx);

    // Handle Khalti callback
    if (method === 'khalti' && pidx) {
      verificationAttempted.current = true;
      verifyKhaltiPayment();
      return;
    }

    // Handle eSewa callback
    if (data) {
      verificationAttempted.current = true;
      verifyPayment();
    } else {
      // No data from eSewa - check if this is a simulated success
      const simulated = searchParams.get('simulated');
      if (simulated === 'true') {
        setLoading(false);
        setVerified(true);
      } else {
        // Try fallback verification based on type
        verificationAttempted.current = true;
        completePendingPayment(type || 'event');
      }
    }
  }, [data, type, method, pidx]);

  const verifyKhaltiPayment = async () => {
    try {
      console.log('Verifying Khalti payment with pidx:', pidx);

      const response = await paymentsAPI.verifyKhaltiPayment(pidx, type);
      console.log('Khalti verification response:', response);

      if (response.success) {
        console.log('Khalti payment verified successfully!');
        setVerified(true);
        setPaymentData(response.data);

        // Clear cart if order
        if (type === 'order') {
          localStorage.removeItem('cart');
        }
      } else {
        console.log('Khalti payment verification failed:', response);
        setError(response.message || 'Payment verification failed');
      }
    } catch (err) {
      console.error('Khalti verification error:', err);
      setError(err.message || 'Payment verification failed');
    } finally {
      setLoading(false);
    }
  };

  const completePendingPayment = async (paymentType) => {
    try {
      console.log('Attempting fallback payment completion for type:', paymentType);
      let response;

      switch (paymentType) {
        case 'venue':
          response = await paymentsAPI.completePendingVenuePayment();
          break;
        case 'order':
          response = await paymentsAPI.completePendingOrderPayment();
          break;
        case 'event':
        default:
          response = await paymentsAPI.completePendingEventPayment();
          break;
      }

      console.log('Fallback completion response:', response);

      if (response.success) {
        console.log('Payment completed via fallback!');
        setVerified(true);
        setPaymentData(response.data);
      } else {
        console.log('Fallback completion failed:', response);
        setError('Payment verification failed. Please contact support if you were charged.');
      }
    } catch (err) {
      console.error('Fallback payment completion error:', err);
      setError(err.message || 'Payment verification failed. Please contact support if you were charged.');
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async () => {
    try {
      console.log('Verifying payment with data:', data);
      console.log('Payment type:', type);

      let response;
      switch (type) {
        case 'event':
          console.log('Calling verifyEventPayment...');
          response = await paymentsAPI.verifyEventPayment(data);
          console.log('verifyEventPayment response:', response);
          break;
        case 'order':
          console.log('Calling verifyOrderPayment...');
          response = await paymentsAPI.verifyOrderPayment(data);
          console.log('verifyOrderPayment response:', response);
          // Clear cart on successful order
          localStorage.removeItem('cart');
          break;
        case 'venue':
          console.log('Calling verifyVenuePayment...');
          response = await paymentsAPI.verifyVenuePayment(data);
          console.log('verifyVenuePayment response:', response);
          break;
        default:
          throw new Error('Invalid payment type');
      }

      if (response.success) {
        console.log('Payment verified successfully!');
        setVerified(true);
        setPaymentData(response.data);
      } else {
        console.log('Payment verification failed:', response);
        setError('Payment verification failed');
      }
    } catch (err) {
      console.error('Payment verification error:', err);
      setError(err.message || 'Payment verification failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-gray-600">Verifying payment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
        <div className="bg-white rounded-2xl shadow-sm p-12 max-w-md text-center">
          <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Verification Failed</h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-sm p-12 max-w-md text-center">
        <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          {type === 'event' && 'Your event booking has been confirmed.'}
          {type === 'order' && 'Your order has been placed successfully.'}
          {type === 'venue' && 'Your venue booking has been confirmed.'}
        </p>

        {paymentData && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            {paymentData.transactionId && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Transaction ID:</span> {paymentData.transactionId}
              </p>
            )}
            {paymentData.orderNumber && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Order Number:</span> {paymentData.orderNumber}
              </p>
            )}
          </div>
        )}

        <div className="space-y-3">
          {type === 'order' && (
            <Link
              to="/orders"
              className="block w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              View My Orders
            </Link>
          )}
          {type === 'event' && (
            <Link
              to="/my-tickets"
              className="block w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              View My Tickets
            </Link>
          )}
          {type === 'venue' && (
            <Link
              to="/my-venue-bookings"
              className="block w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              View My Venue Bookings
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

export default PaymentSuccess;
