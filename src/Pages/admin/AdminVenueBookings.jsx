import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { venuesAPI } from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminVenueBookings = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalBookings: 0,
  });
  const [statusFilter, setStatusFilter] = useState('');

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
    fetchBookings();
  }, [isAuthenticated, user, navigate, authLoading, pagination.currentPage, statusFilter]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.currentPage,
        limit: 20,
      };
      if (statusFilter) params.status = statusFilter;

      const response = await venuesAPI.getAllBookingsAdmin(params);
      setBookings(response.data?.bookings || []);
      setPagination({
        currentPage: response.data?.pagination?.currentPage || 1,
        totalPages: response.data?.pagination?.totalPages || 1,
        totalBookings: response.data?.pagination?.total || 0,
      });
    } catch (err) {
      console.error('Error fetching venue bookings:', err);
      toast.error('Failed to fetch venue bookings');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
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
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  if (authLoading || loading) {
    return (
      <AdminLayout title="Venue Bookings">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Venue Bookings"
      subtitle={`Manage all venue bookings (${pagination.totalBookings} total)`}
    >
      {/* Filter Buttons */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => handleStatusFilter('')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            statusFilter === '' ? 'bg-primary text-white' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => handleStatusFilter('pending')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            statusFilter === 'pending' ? 'bg-primary text-white' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => handleStatusFilter('confirmed')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            statusFilter === 'confirmed' ? 'bg-primary text-white' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          Confirmed
        </button>
        <button
          onClick={() => handleStatusFilter('completed')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            statusFilter === 'completed' ? 'bg-primary text-white' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          Completed
        </button>
        <button
          onClick={() => handleStatusFilter('cancelled')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            statusFilter === 'cancelled' ? 'bg-primary text-white' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          Cancelled
        </button>
      </div>

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
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-slate-900">No bookings found</h3>
            <p className="mt-1 text-sm text-slate-500">
              {statusFilter ? `No ${statusFilter} bookings found.` : 'No venue bookings have been made yet.'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Venue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Event Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Booking Dates
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Total Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Payment Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {booking.venue?.image && (
                            <img
                              src={booking.venue.image}
                              alt={booking.venue.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          )}
                          <div>
                            <div className="text-sm font-medium text-slate-900">
                              {booking.venue?.name || 'N/A'}
                            </div>
                            <div className="text-sm text-slate-500">
                              {booking.venue?.address?.city || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900">{booking.user?.fullName || 'N/A'}</div>
                        <div className="text-sm text-slate-500">{booking.user?.email || 'N/A'}</div>
                        {booking.user?.phone && (
                          <div className="text-sm text-slate-500">{booking.user.phone}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900">{booking.eventName || 'N/A'}</div>
                        {booking.eventType && (
                          <div className="text-sm text-slate-500 capitalize">{booking.eventType}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900">
                          {booking.startDate ? formatDate(booking.startDate) : 'N/A'}
                        </div>
                        <div className="text-sm text-slate-500">
                          to {booking.endDate ? formatDate(booking.endDate) : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-900">
                          NPR {booking.pricing?.totalPrice?.toLocaleString() || 0}
                        </div>
                        {booking.pricing?.additionalServices > 0 && (
                          <div className="text-xs text-slate-500">
                            +{booking.pricing.additionalServices} services
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {booking.status || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            booking.payment?.status === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : booking.payment?.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {booking.payment?.status || 'N/A'}
                        </span>
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
    </AdminLayout>
  );
};

export default AdminVenueBookings;
