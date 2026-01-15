import { useState } from 'react';

const RefundActionModal = ({ refund, action, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    notes: '',
    refundMethod: 'original_payment_method',
    transactionId: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (action) {
      case 'approve':
        return 'Approve Refund Request';
      case 'reject':
        return 'Reject Refund Request';
      case 'process':
        return 'Mark Refund as Processed';
      default:
        return 'Refund Action';
    }
  };

  const getButtonText = () => {
    switch (action) {
      case 'approve':
        return 'Approve Refund';
      case 'reject':
        return 'Reject Refund';
      case 'process':
        return 'Mark as Processed';
      default:
        return 'Submit';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">{getTitle()}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Refund Details */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">{refund.event?.title}</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-600">Customer</p>
                <p className="font-medium text-gray-900">{refund.user?.fullName}</p>
              </div>
              <div>
                <p className="text-gray-600">Ticket Type</p>
                <p className="font-medium text-gray-900">{refund.ticketType}</p>
              </div>
              <div>
                <p className="text-gray-600">Quantity</p>
                <p className="font-medium text-gray-900">{refund.quantity}</p>
              </div>
              <div>
                <p className="text-gray-600">Refund Amount</p>
                <p className="font-semibold text-indigo-600">
                  NPR {refund.refundAmount?.toLocaleString()}
                </p>
              </div>
            </div>

            {refund.reason && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-gray-600 text-sm mb-1">Customer's Reason:</p>
                <p className="text-gray-900 text-sm">{refund.reason}</p>
              </div>
            )}

            {refund.bankDetails && refund.bankDetails.accountName && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-gray-600 text-sm mb-1">Bank Details:</p>
                <div className="text-sm text-gray-900 space-y-1">
                  <p>Name: {refund.bankDetails.accountName}</p>
                  <p>Account: {refund.bankDetails.accountNumber}</p>
                  <p>Bank: {refund.bankDetails.bankName} - {refund.bankDetails.branch}</p>
                </div>
              </div>
            )}
          </div>

          {/* Approve - Refund Method */}
          {action === 'approve' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Refund Method <span className="text-red-500">*</span>
              </label>
              <select
                name="refundMethod"
                value={formData.refundMethod}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="original_payment_method">Original Payment Method</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="cash">Cash</option>
              </select>
            </div>
          )}

          {/* Process - Transaction ID */}
          {action === 'process' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transaction ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="transactionId"
                value={formData.transactionId}
                onChange={handleChange}
                required
                placeholder="Enter refund transaction ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Admin Notes */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admin Notes {action === 'reject' && <span className="text-red-500">*</span>}
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              required={action === 'reject'}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder={
                action === 'reject'
                  ? 'Please provide a reason for rejection (required)'
                  : 'Add any additional notes (optional)'
              }
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 px-4 py-2 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed ${
                action === 'reject'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {loading ? 'Processing...' : getButtonText()}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RefundActionModal;
