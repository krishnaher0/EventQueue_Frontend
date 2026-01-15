import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { eventsAPI } from '../../services/api';
import { refundAPI } from '../../services/refundApi';
import AdminLayout from '../../components/admin/AdminLayout';
import RefundActionModal from '../../components/admin/RefundActionModal';

const AdminEventBookings = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' or 'refunds'
  const [bookings, setBookings] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalBookings: 0,
  });
  const [refundPagination, setRefundPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
  });
  const [refundStats, setRefundStats] = useState(null);
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [modalAction, setModalAction] = useState(null); // 'approve', 'reject', 'process'

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }
    if (activeTab === 'bookings') {
      fetchBookings();
    } else {
      fetchRefunds();
      fetchRefundStats();
    }
  }, [isAuthenticated, user, navigate, authLoading, pagination.currentPage, refundPagination.currentPage, activeTab]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await eventsAPI.getAllEventBookings({
        page: pagination.currentPage,
        limit: 20,
      });
      setBookings(response.data?.bookings || []);
      setPagination({
        currentPage: response.data?.pagination?.currentPage || 1,
        totalPages: response.data?.pagination?.totalPages || 1,
        totalBookings: response.data?.pagination?.total || 0,
      });
    } catch (err) {
      console.error('Error fetching event bookings:', err);
      toast.error('Failed to fetch event bookings');
    } finally {
      setLoading(false);
    }
  };

  const fetchRefunds = async () => {
    setLoading(true);
    try {
      const response = await refundAPI.getAllRefunds({
        page: refundPagination.currentPage,
        limit: 20,
      });
      setRefunds(response.data?.refunds || []);
      setRefundPagination({
        currentPage: response.data?.pagination?.currentPage || 1,
        totalPages: response.data?.pagination?.totalPages || 1,
        total: response.data?.pagination?.total || 0,
      });
    } catch (err) {
      console.error('Error fetching refunds:', err);
      toast.error('Failed to fetch refunds');
    } finally {
      setLoading(false);
    }
  };

  const fetchRefundStats = async () => {
    try {
      const response = await refundAPI.getRefundStats();
      setRefundStats(response.data);
    } catch (err) {
      console.error('Error fetching refund stats:', err);
    }
  };

  const handleRefundAction = (refund, action) => {
    setSelectedRefund(refund);
    setModalAction(action);
    setShowRefundModal(true);
  };

  const handleRefundSubmit = async (formData) => {
    try {
      if (modalAction === 'approve') {
        await refundAPI.approveRefund(selectedRefund._id, formData.notes, formData.refundMethod);
        toast.success('Refund approved successfully');
      } else if (modalAction === 'reject') {
        await refundAPI.rejectRefund(selectedRefund._id, formData.notes);
        toast.success('Refund rejected');
      } else if (modalAction === 'process') {
        await refundAPI.processRefund(selectedRefund._id, formData.transactionId, formData.notes);
        toast.success('Refund marked as processed');
      }
      setShowRefundModal(false);
      setSelectedRefund(null);
      setModalAction(null);
      fetchRefunds();
      fetchRefundStats();
    } catch (err) {
      console.error('Error processing refund:', err);
      toast.error(err.message || 'Failed to process refund');
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  const handleRefundPageChange = (newPage) => {
    setRefundPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'processed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (authLoading || loading) {
    return (
      <AdminLayout title="Event Bookings">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Event Bookings & Refunds"
      subtitle={activeTab === 'bookings'
        ? `Manage all event bookings (${pagination.totalBookings} total)`
        : `Manage refund requests (${refundPagination.total} total)`
      }
    >
      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`${
              activeTab === 'bookings'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Bookings
          </button>
          <button
            onClick={() => setActiveTab('refunds')}
            className={`${
              activeTab === 'refunds'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
          >
            Refund Requests
            {refundStats?.pending > 0 && (
              <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                {refundStats.pending}
              </span>
            )}
          </button>
        </nav>
      </div>

      {activeTab === 'bookings' ? (
        <div className="bg-white rounded-xl shadow-sm">
        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-slate-900">No bookings yet</h3>
            <p className="mt-1 text-sm text-slate-500">No event bookings have been made yet.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Event
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Ticket Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Total Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Payment Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Booked Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {bookings.map((booking, index) => (
                    <tr key={`${booking.event?._id}-${booking.user?._id}-${index}`} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-900">
                          {booking.event?.title || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900">{booking.user?.fullName || 'N/A'}</div>
                        <div className="text-sm text-slate-500">{booking.user?.email || 'N/A'}</div>
                        {booking.user?.phone && (
                          <div className="text-sm text-slate-500">{booking.user.phone}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900 capitalize">{booking.ticketType || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900">{booking.quantity || 0}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-900">
                          NPR {booking.totalPrice?.toLocaleString() || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            booking.paymentStatus === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : booking.paymentStatus === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {booking.paymentStatus || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {booking.bookedAt ? formatDate(booking.bookedAt) : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="px-6 py-4 flex items-center justify-between border-t border-slate-200">
                <div className="text-sm text-slate-700">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      ) : (
        /* Refunds Tab */
        <div className="bg-white rounded-xl shadow-sm">
          {/* Stats Cards */}
          {refundStats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 border-b">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-600 font-medium">Pending</p>
                <p className="text-2xl font-bold text-yellow-900">{refundStats.pending}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600 font-medium">Approved</p>
                <p className="text-2xl font-bold text-blue-900">{refundStats.approved}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600 font-medium">Processed</p>
                <p className="text-2xl font-bold text-green-900">{refundStats.processed}</p>
                <p className="text-xs text-green-600 mt-1">
                  NPR {refundStats.processedRefundAmount?.toLocaleString()}
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-red-600 font-medium">Rejected</p>
                <p className="text-2xl font-bold text-red-900">{refundStats.rejected}</p>
              </div>
            </div>
          )}

          {refunds.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-slate-900">No refund requests</h3>
              <p className="mt-1 text-sm text-slate-500">No refund requests have been made yet.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Event
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Ticket Info
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Refund Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Reason
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {refunds.map((refund) => (
                      <tr key={refund._id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-slate-900">
                            {refund.event?.title || 'N/A'}
                          </div>
                          <div className="text-xs text-slate-500">
                            {formatDate(refund.event?.startDate)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-900">{refund.user?.fullName || 'N/A'}</div>
                          <div className="text-xs text-slate-500">{refund.user?.email || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-900">{refund.ticketType}</div>
                          <div className="text-xs text-slate-500">Qty: {refund.quantity}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-slate-900">
                            NPR {refund.refundAmount?.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-slate-900 max-w-xs truncate">
                            {refund.reason}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(refund.status)}`}>
                            {refund.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {refund.status === 'pending' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleRefundAction(refund, 'approve')}
                                className="text-green-600 hover:text-green-900"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleRefundAction(refund, 'reject')}
                                className="text-red-600 hover:text-red-900"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                          {refund.status === 'approved' && (
                            <button
                              onClick={() => handleRefundAction(refund, 'process')}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Mark Processed
                            </button>
                          )}
                          {refund.status === 'processed' && (
                            <span className="text-slate-500">Completed</span>
                          )}
                          {refund.status === 'rejected' && (
                            <span className="text-slate-500">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {refundPagination.totalPages > 1 && (
                <div className="px-6 py-4 flex items-center justify-between border-t border-slate-200">
                  <div className="text-sm text-slate-700">
                    Page {refundPagination.currentPage} of {refundPagination.totalPages}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRefundPageChange(refundPagination.currentPage - 1)}
                      disabled={refundPagination.currentPage === 1}
                      className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handleRefundPageChange(refundPagination.currentPage + 1)}
                      disabled={refundPagination.currentPage === refundPagination.totalPages}
                      className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Refund Action Modal */}
      {showRefundModal && selectedRefund && (
        <RefundActionModal
          refund={selectedRefund}
          action={modalAction}
          onClose={() => {
            setShowRefundModal(false);
            setSelectedRefund(null);
            setModalAction(null);
          }}
          onSubmit={handleRefundSubmit}
        />
      )}
    </AdminLayout>
  );
};

export default AdminEventBookings;
