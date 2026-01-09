import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { paymentsAPI } from '../../services/api';

const TestPayment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const transactionUuid = searchParams.get('txn');
  const amount = searchParams.get('amount');
  const eventTitle = searchParams.get('event');

  const simulateSuccess = async () => {
    setLoading(true);
    setError('');

    // Create a mock eSewa response (base64 encoded)
    const mockResponse = {
      transaction_code: 'TEST-' + Date.now(),
      status: 'COMPLETE',
      total_amount: amount,
      transaction_uuid: transactionUuid,
      product_code: 'EPAYTEST',
      signed_field_names: 'transaction_code,status,total_amount,transaction_uuid,product_code,signed_field_names',
    };

    const encodedData = btoa(JSON.stringify(mockResponse));

    try {
      const response = await paymentsAPI.verifyEventPayment(encodedData);
      if (response.success) {
        navigate(`/payment/success?type=event&simulated=true`);
      } else {
        setError('Payment verification failed');
      }
    } catch (err) {
      setError(err.message || 'Payment simulation failed');
    } finally {
      setLoading(false);
    }
  };

  const simulateFailure = () => {
    navigate('/payment/failure?type=event');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">eSewa Test Payment</h1>
          <p className="text-slate-500">
            eSewa sandbox is having issues. Use this page to simulate payment for testing.
          </p>
        </div>

        <div className="bg-slate-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-slate-600">Event</span>
            <span className="font-medium">{eventTitle || 'Event Booking'}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-slate-600">Amount</span>
            <span className="font-bold text-lg">NPR {amount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Transaction ID</span>
            <span className="text-xs font-mono">{transactionUuid?.slice(0, 20)}...</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 text-red-800 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={simulateSuccess}
            disabled={loading}
            className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Simulate Successful Payment'}
          </button>
          <button
            onClick={simulateFailure}
            disabled={loading}
            className="w-full py-3 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
          >
            Simulate Failed Payment
          </button>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          This is a test page. In production, users will be redirected to real eSewa payment.
        </p>
      </div>
    </div>
  );
};

export default TestPayment;
