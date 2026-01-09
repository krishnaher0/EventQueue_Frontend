import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { venuesAPI } from '../../services/api';
import { 
  Building2, Calendar, Clock, Users, MapPin, Phone, Mail, 
  User, ChevronLeft, Search, Filter, CheckCircle, XCircle, 
  AlertCircle, RefreshCw, CreditCard
} from 'lucide-react';

const MyVenueBookings = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/my-venue-bookings' } });
      return;
    }
    fetchBookings();
  }, [isAuthenticated, navigate]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await venuesAPI.getMyBookings();
      setBookings(response.data?.bookings || response.bookings || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      setCancellingId(bookingId);
      await venuesAPI.cancelBooking(bookingId);
      // Update local state
      setBookings(prev => 
        prev.map(b => b._id === bookingId ? { ...b, status: 'cancelled' } : b)
      );
    } catch (err) {
      alert(err.message || 'Failed to cancel booking');
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'failed':
      case 'refunded':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'completed':
      case 'paid':
        return <CheckCircle size={14} />;
      case 'pending':
        return <Clock size={14} />;
      case 'cancelled':
      case 'failed':
        return <XCircle size={14} />;
      default:
        return <AlertCircle size={14} />;
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatShortDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  // Filter bookings
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.venue?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.eventName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.eventType?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Group bookings by status
  const upcomingBookings = filteredBookings.filter(b => 
    ['confirmed', 'pending'].includes(b.status) && new Date(b.startDate) >= new Date()
  );
  const pastBookings = filteredBookings.filter(b => 
    b.status === 'completed' || new Date(b.endDate) < new Date()
  );
  const cancelledBookings = filteredBookings.filter(b => b.status === 'cancelled');

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
          >
            <ChevronLeft size={20} />
            Back to Profile
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Venue Bookings</h1>
              <p className="text-gray-500 mt-1">Manage your venue reservations</p>
            </div>
            <Link
              to="/venues"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
            >
              <Building2 size={18} />
              Browse Venues
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
                <p className="text-sm text-gray-500">Total Bookings</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-green-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {bookings.filter(b => b.status === 'confirmed').length}
                </p>
                <p className="text-sm text-gray-500">Confirmed</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="text-yellow-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {bookings.filter(b => b.status === 'pending').length}
                </p>
                <p className="text-sm text-gray-500">Pending</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <CreditCard className="text-purple-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  NPR {bookings.reduce((sum, b) => sum + (b.pricing?.totalPrice || 0), 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">Total Spent</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by venue, event name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button
                onClick={fetchBookings}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                title="Refresh"
              >
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm p-12 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-500">Loading your bookings...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Building2 className="mx-auto text-gray-300 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No venue bookings found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your filters'
                : "You haven't booked any venues yet. Start exploring!"}
            </p>
            <Link
              to="/venues"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              <Building2 size={18} />
              Browse Venues
            </Link>
          </div>
        ) : (
          /* Bookings List */
          <div className="space-y-6">
            {/* Upcoming Bookings */}
            {upcomingBookings.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="text-indigo-600" size={20} />
                  Upcoming Bookings ({upcomingBookings.length})
                </h2>
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <BookingCard 
                      key={booking._id} 
                      booking={booking}
                      onCancel={handleCancelBooking}
                      cancellingId={cancellingId}
                      getStatusColor={getStatusColor}
                      getPaymentStatusColor={getPaymentStatusColor}
                      getStatusIcon={getStatusIcon}
                      formatDate={formatDate}
                      formatShortDate={formatShortDate}
                      calculateDays={calculateDays}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Past Bookings */}
            {pastBookings.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="text-green-600" size={20} />
                  Past Bookings ({pastBookings.length})
                </h2>
                <div className="space-y-4">
                  {pastBookings.map((booking) => (
                    <BookingCard 
                      key={booking._id} 
                      booking={booking}
                      isPast={true}
                      getStatusColor={getStatusColor}
                      getPaymentStatusColor={getPaymentStatusColor}
                      getStatusIcon={getStatusIcon}
                      formatDate={formatDate}
                      formatShortDate={formatShortDate}
                      calculateDays={calculateDays}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Cancelled Bookings */}
            {cancelledBookings.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <XCircle className="text-red-600" size={20} />
                  Cancelled Bookings ({cancelledBookings.length})
                </h2>
                <div className="space-y-4">
                  {cancelledBookings.map((booking) => (
                    <BookingCard 
                      key={booking._id} 
                      booking={booking}
                      isCancelled={true}
                      getStatusColor={getStatusColor}
                      getPaymentStatusColor={getPaymentStatusColor}
                      getStatusIcon={getStatusIcon}
                      formatDate={formatDate}
                      formatShortDate={formatShortDate}
                      calculateDays={calculateDays}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Booking Card Component
const BookingCard = ({ 
  booking, 
  onCancel, 
  cancellingId,
  isPast = false,
  isCancelled = false,
  getStatusColor,
  getPaymentStatusColor,
  getStatusIcon,
  formatDate,
  formatShortDate,
  calculateDays,
}) => {
  const navigate = useNavigate();

  return (
    <div className={`bg-white rounded-xl shadow-sm overflow-hidden border ${isCancelled ? 'opacity-75' : ''}`}>
      <div className="flex flex-col md:flex-row">
        {/* Venue Image */}
        <div className="md:w-48 h-48 md:h-auto relative">
          <img
            src={booking.venue?.images?.[0] || booking.venue?.image || '/placeholder-venue.jpg'}
            alt={booking.venue?.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3">
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
              {getStatusIcon(booking.status)}
              {booking.status}
            </span>
          </div>
        </div>

        {/* Booking Details */}
        <div className="flex-1 p-5">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            {/* Left Section */}
            <div className="flex-1">
              <Link 
                to={`/venues/${booking.venue?._id}`}
                className="text-xl font-bold text-gray-900 hover:text-indigo-600 transition"
              >
                {booking.venue?.name || 'Venue'}
              </Link>
              
              <div className="mt-2 space-y-1">
                <p className="text-indigo-600 font-medium">{booking.eventName}</p>
                <p className="text-sm text-gray-500">{booking.eventType}</p>
              </div>

              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar size={12} /> Dates
                  </p>
                  <p className="text-sm font-medium">
                    {formatShortDate(booking.startDate)} - {formatShortDate(booking.endDate)}
                  </p>
                  <p className="text-xs text-gray-400">
                    ({calculateDays(booking.startDate, booking.endDate)} days)
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock size={12} /> Time
                  </p>
                  <p className="text-sm font-medium">
                    {booking.startTime} - {booking.endTime}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Users size={12} /> Guests
                  </p>
                  <p className="text-sm font-medium">{booking.expectedGuests}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Payment</p>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${getPaymentStatusColor(booking.payment?.status)}`}>
                    {booking.payment?.status || 'pending'}
                  </span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="mt-4 pt-4 border-t flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <User size={14} />
                  {booking.contact?.name}
                </span>
                <span className="flex items-center gap-1">
                  <Phone size={14} />
                  {booking.contact?.phone}
                </span>
                <span className="flex items-center gap-1">
                  <Mail size={14} />
                  {booking.contact?.email}
                </span>
              </div>
            </div>

            {/* Right Section - Price & Actions */}
            <div className="md:text-right md:min-w-[180px]">
              <p className="text-xs text-gray-500">Total Amount</p>
              <p className="text-2xl font-bold text-green-600">
                NPR {booking.pricing?.totalPrice?.toLocaleString() || 0}
              </p>
              
              {booking.payment?.method && (
                <p className="text-xs text-gray-400 mt-1">
                  via {booking.payment.method}
                </p>
              )}

              {/* Actions */}
              {!isPast && !isCancelled && (
                <div className="mt-4 flex flex-col gap-2">
                  {booking.payment?.status !== 'paid' && booking.status === 'pending' && (
                    <button 
                      onClick={() => navigate(`/payment/venue/${booking._id}`)}
                      className="w-full px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition"
                    >
                      Complete Payment
                    </button>
                  )}
                  {booking.status === 'pending' && (
                    <button
                      onClick={() => onCancel?.(booking._id)}
                      disabled={cancellingId === booking._id}
                      className="w-full px-4 py-2 border border-red-300 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition disabled:opacity-50"
                    >
                      {cancellingId === booking._id ? 'Cancelling...' : 'Cancel Booking'}
                    </button>
                  )}
                </div>
              )}

              {isPast && booking.status === 'completed' && (
                <button className="mt-4 w-full px-4 py-2 border border-indigo-300 text-indigo-600 text-sm font-medium rounded-lg hover:bg-indigo-50 transition">
                  Leave Review
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Booking ID Footer */}
      <div className="bg-gray-50 px-5 py-2 flex items-center justify-between text-xs text-gray-500">
        <span>Booking ID: {booking._id}</span>
        <span>Booked on {formatDate(booking.createdAt)}</span>
      </div>
    </div>
  );
};

export default MyVenueBookings;