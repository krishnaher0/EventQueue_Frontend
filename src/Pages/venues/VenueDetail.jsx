import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { venuesAPI, paymentsAPI } from '../../services/api';

const VenueDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('esewa');
  const [bookingData, setBookingData] = useState({
    eventName: '',
    eventType: '',
    startDate: '',
    endDate: '',
    startTime: '09:00',
    endTime: '18:00',
    expectedGuests: '',
    additionalRequirements: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
  });
  const [phoneError, setPhoneError] = useState('');

  // Update contact info when user loads
  useEffect(() => {
    if (user) {
      setBookingData(prev => ({
        ...prev,
        contactName: prev.contactName || user.fullName || user.name || '',
        contactEmail: prev.contactEmail || user.email || '',
      }));
    }
  }, [user]);

  useEffect(() => {
    fetchVenue();
  }, [id]);

  const fetchVenue = async () => {
    try {
      setLoading(true);
      const response = await venuesAPI.getById(id);
      setVenue(response.data?.venue || response.data || response.venue || response);
    } catch (error) {
      console.error('Error fetching venue:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Phone number validation
    if (name === 'contactPhone') {
      // Allow only numbers
      const numericValue = value.replace(/\D/g, '');

      // Limit to 10 digits
      if (numericValue.length <= 10) {
        setBookingData({ ...bookingData, [name]: numericValue });

        // Validation messages
        if (numericValue.length === 0) {
          setPhoneError('');
        } else if (numericValue.length < 10) {
          setPhoneError('Phone number must be 10 digits');
        } else if (numericValue[0] !== '9') {
          setPhoneError('Phone number must start with 9');
        } else {
          setPhoneError('');
        }
      }
      return;
    }

    setBookingData({ ...bookingData, [name]: value });
  };

  const calculatePrice = () => {
    if (!bookingData.startDate || !bookingData.endDate) return venue?.pricing?.basePrice || venue?.pricePerDay || 0;
    const start = new Date(bookingData.startDate);
    const end = new Date(bookingData.endDate);
    const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1);
    return days * (venue?.pricing?.basePrice || venue?.pricePerDay || 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login', { state: { from: `/venues/${id}` } });
      return;
    }

    // Validate contact fields
    const contactName = bookingData.contactName || user?.fullName || user?.name;
    const contactEmail = bookingData.contactEmail || user?.email;
    const contactPhone = bookingData.contactPhone;

    if (!contactName || !contactEmail || !contactPhone) {
      setError('Please fill in all contact information (name, email, phone)');
      return;
    }

    // Validate phone number before submission
    if (contactPhone.length !== 10 || contactPhone[0] !== '9') {
      setError('Please enter a valid 10-digit phone number starting with 9');
      return;
    }

    if (!bookingData.eventName || !bookingData.eventType || !bookingData.startDate || !bookingData.endDate || !bookingData.expectedGuests) {
      setError('Please fill in all required fields');
      return;
    }

    setError('');
    setBookingLoading(true);

    try {
      const totalPrice = calculatePrice();
      const basePrice = venue?.pricing?.basePrice || venue?.pricePerDay || 0;

      const bookingPayload = {
        eventName: bookingData.eventName,
        eventType: bookingData.eventType,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        expectedGuests: parseInt(bookingData.expectedGuests),
        additionalRequirements: bookingData.additionalRequirements || '',
        contact: {
          name: contactName,
          phone: contactPhone,
          email: contactEmail,
        },
        pricing: {
          basePrice: basePrice,
          totalPrice: totalPrice,
        },
        paymentMethod: paymentMethod,
      };

      console.log('Sending booking payload:', bookingPayload);

      const response = await venuesAPI.book(id, bookingPayload);

      if (response.success) {
        // Initiate payment with selected method
        const paymentResponse = await paymentsAPI.initiateVenuePayment(
          response.data.booking._id,
          paymentMethod
        );

        if (paymentResponse.success) {
          const { paymentMethod: method, esewaUrl, esewaPayload, khaltiPaymentUrl } = paymentResponse.data;

          if (method === 'khalti' && khaltiPaymentUrl) {
            window.location.href = khaltiPaymentUrl;
          } else if (esewaUrl && esewaPayload) {
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = esewaUrl;

            Object.entries(esewaPayload).forEach(([key, value]) => {
              const input = document.createElement('input');
              input.type = 'hidden';
              input.name = key;
              input.value = value;
              form.appendChild(input);
            });

            document.body.appendChild(form);
            form.submit();
          }
        }
      }
    } catch (err) {
      console.error('Booking error:', err);
      setError(err.message || 'Failed to create booking');
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Venue not found</h2>
        <Link to="/venues" className="text-indigo-600 hover:underline">
          Back to Venues
        </Link>
      </div>
    );
  }

  const basePrice = venue?.pricing?.basePrice || venue?.pricePerDay || 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8 text-sm">
          <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link to="/venues" className="text-gray-500 hover:text-gray-700">Venues</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900">{venue.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="aspect-video">
                <img
                  src={venue.images?.[0] || venue.image || 'https://via.placeholder.com/800x450'}
                  alt={venue.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Details */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-block px-3 py-1 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-full">
                    {venue.type || venue.category}
                  </span>
                  <h1 className="mt-3 text-3xl font-bold text-gray-900">{venue.name}</h1>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <span>
                  {venue.address?.city || venue.location?.city}, {venue.address?.country || venue.location?.country || 'Nepal'}
                </span>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-3">About This Venue</h3>
                <p className="text-gray-600 leading-relaxed">{venue.description}</p>
              </div>

              {/* Amenities */}
              {venue.amenities && venue.amenities.length > 0 && (
                <div className="mt-8">
                  <h3 className="font-semibold text-gray-900 mb-4">Amenities & Features</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {venue.amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center gap-2 text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Booking Form (Always Visible) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <div className="text-center mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  NPR {basePrice.toLocaleString()}
                </span>
                <span className="text-gray-500">/day</span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Name *</label>
                  <input
                    type="text"
                    name="eventName"
                    value={bookingData.eventName}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Type *</label>
                  <select
                    name="eventType"
                    value={bookingData.eventType}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select type</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Conference">Conference</option>
                    <option value="Birthday Party">Birthday Party</option>
                    <option value="Corporate Event">Corporate Event</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                    <input
                      type="date"
                      name="startDate"
                      value={bookingData.startDate}
                      onChange={handleChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                    <input
                      type="date"
                      name="endDate"
                      value={bookingData.endDate}
                      onChange={handleChange}
                      required
                      min={bookingData.startDate || new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expected Guests *</label>
                  <input
                    type="number"
                    name="expectedGuests"
                    value={bookingData.expectedGuests}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Contact Information Section */}
                <div className="border-t pt-4 mt-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Contact Information</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name *</label>
                      <input
                        type="text"
                        name="contactName"
                        value={bookingData.contactName}
                        onChange={handleChange}
                        required
                        placeholder="Your full name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email *</label>
                      <input
                        type="email"
                        name="contactEmail"
                        value={bookingData.contactEmail}
                        onChange={handleChange}
                        required
                        placeholder="your@email.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone *</label>
                      <input
                        type="tel"
                        name="contactPhone"
                        value={bookingData.contactPhone}
                        onChange={handleChange}
                        required
                        placeholder="98XXXXXXXX"
                        maxLength="10"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                          phoneError ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {phoneError && (
                        <p className="mt-1 text-xs text-red-600">{phoneError}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>NPR {calculatePrice().toLocaleString()}</span>
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className="pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Select Payment Method</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('esewa')}
                      className={`p-3 border-2 rounded-xl flex flex-col items-center gap-2 transition ${
                        paymentMethod === 'esewa'
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-green-600 font-bold">eSewa</span>
                      {paymentMethod === 'esewa' && (
                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('khalti')}
                      className={`p-3 border-2 rounded-xl flex flex-col items-center gap-2 transition ${
                        paymentMethod === 'khalti'
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-purple-600 font-bold">Khalti</span>
                      {paymentMethod === 'khalti' && (
                        <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={bookingLoading}
                  className={`w-full py-4 text-white rounded-xl font-semibold transition disabled:opacity-50 ${
                    paymentMethod === 'khalti'
                      ? 'bg-purple-600 hover:bg-purple-700'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {bookingLoading ? 'Processing...' : `Pay with ${paymentMethod === 'khalti' ? 'Khalti' : 'eSewa'}`}
                </button>

                
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default VenueDetail;