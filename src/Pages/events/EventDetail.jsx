import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { eventsAPI, paymentsAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";


const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [paymentMethod, setPaymentMethod] = useState('esewa');
  const esewaFormRef = useRef(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await eventsAPI.getById(id);
        setEvent(response.data.event);
        if (response.data.event.ticketTypes?.length > 0) {
          setSelectedTicket(response.data.event.ticketTypes[0]);
        }
      } catch (error) {
        console.error('Error fetching event:', error);
        setMessage({ type: 'error', text: 'Failed to load event details' });
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatPrice = (price, currency = 'NPR') => {
    if (price === 0) return 'Free';
    return `${currency} ${price.toLocaleString()}`;
  };

  const handleBooking = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/events/${id}` } });
      return;
    }

    if (!selectedTicket) {
      setMessage({ type: 'error', text: 'Please select a ticket type' });
      return;
    }

    // If the ticket is free, book directly
    if (selectedTicket.price === 0) {
      setBooking(true);
      setMessage({ type: '', text: '' });

      try {
        const response = await eventsAPI.book(id);
        setMessage({ type: 'success', text: response.message || 'Event booked successfully!' });
        const updatedEvent = await eventsAPI.getById(id);
        setEvent(updatedEvent.data.event);
      } catch (error) {
        setMessage({
          type: 'error',
          text: error.message || 'Failed to book event. Please try again.'
        });
      } finally {
        setBooking(false);
      }
      return;
    }

    // For paid tickets, initiate payment
    setBooking(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await paymentsAPI.initiateEventPayment(id, selectedTicket.name, quantity, paymentMethod);
      const { paymentMethod: method, esewaUrl, esewaPayload, khaltiPaymentUrl, transactionUuid } = response.data;

      // Check if we should use test mode (for development when eSewa sandbox is down)
      const useTestMode = import.meta.env.DEV && import.meta.env.VITE_ESEWA_TEST_MODE === 'true';

      if (method === 'khalti' && khaltiPaymentUrl) {
        // Redirect to Khalti payment page
        window.location.href = khaltiPaymentUrl;
        return;
      }

      if (useTestMode && method === 'esewa') {
        // Redirect to test payment page
        const testUrl = `/payment/test?txn=${transactionUuid}&amount=${esewaPayload.total_amount}&event=${encodeURIComponent(event.title)}`;
        navigate(testUrl);
        return;
      }

      // Create and submit eSewa form
      if (esewaUrl && esewaPayload) {
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
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to initiate payment. Please try again.'
      });
      setBooking(false);
    }
  };

  const isAlreadyBooked = () => {
    if (!user?._id || !event?.attendees) return false;
    const currentUserId = user._id.toString();
    return event.attendees.some(attendee => {
      if (!attendee?.user) return false;
      // Handle both populated (object) and non-populated (string) user references
      const attendeeUserId = typeof attendee.user === 'object'
        ? attendee.user?._id
        : attendee.user;
      return attendeeUserId && attendeeUserId.toString() === currentUserId;
    });
  };

  const getAvailableTickets = (ticket) => {
    return ticket.quantity - (ticket.sold || 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-96 bg-slate-200 rounded-xl mb-8"></div>
            <div className="h-8 bg-slate-200 rounded w-2/3 mb-4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2 mb-8"></div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <div className="h-40 bg-slate-200 rounded"></div>
              </div>
              <div className="h-64 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-slate-50 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Event Not Found</h1>
          <p className="text-slate-500 mb-6">The event you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/events')}
            className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            Browse Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Image */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img
          src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=600&fit=crop'}
          alt={event.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=600&fit=crop';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="max-w-6xl mx-auto">
            {event.isFeatured && (
              <span className="inline-block bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
                Featured Event
              </span>
            )}
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{event.title}</h1>
            <p className="text-white/80 text-lg">{event.category}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* Event Details Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Event Details</h2>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Date</p>
                    <p className="font-medium">{formatDate(event.startDate)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Time</p>
                    <p className="font-medium">{event.startTime} {event.endTime && `- ${event.endTime}`}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Location</p>
                    <p className="font-medium">{event.venueName || 'Online'}</p>
                    {event.address?.city && (
                      <p className="text-sm text-slate-500">{event.address.city}, {event.address.country}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Capacity</p>
                    <p className="font-medium">
                      {event.totalCapacity ? `${event.attendees?.length || 0} / ${event.totalCapacity}` : '50'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">About This Event</h2>
              <p className="text-slate-600 whitespace-pre-line">{event.description}</p>

              {event.tags && event.tags.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <p className="text-sm text-slate-500 mb-3">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Organizer Info */}
            {event.organizer && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Organizer</h2>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold text-lg">
                      {event.organizer.fullName?.charAt(0) || 'O'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{event.organizer.fullName || 'Event Organizer'}</p>
                    <p className="text-sm text-slate-500">{event.organizer.email}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Booking Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Book This Event</h2>

              {/* Ticket Types */}
              {event.ticketTypes && event.ticketTypes.length > 0 ? (
                <div className="space-y-3 mb-6">
                  {event.ticketTypes.map((ticket, idx) => (
                    <label
                      key={idx}
                      className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        selectedTicket?.name === ticket.name
                          ? 'border-primary bg-primary/5'
                          : 'border-slate-200 hover:border-slate-300'
                      } ${getAvailableTickets(ticket) === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="ticket"
                            checked={selectedTicket?.name === ticket.name}
                            onChange={() => setSelectedTicket(ticket)}
                            disabled={getAvailableTickets(ticket) === 0}
                            className="w-4 h-4 text-primary"
                          />
                          <div>
                            <p className="font-medium">{ticket.name}</p>
                            <p className="text-sm text-slate-500">
                              {getAvailableTickets(ticket) > 0
                                ? `${getAvailableTickets(ticket)} available`
                                : 'Sold out'}
                            </p>
                          </div>
                        </div>
                        <span className="font-semibold">
                          {formatPrice(ticket.price, event.currency)}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                  <p className="text-2xl font-bold text-center">
                    {event.isFree ? 'Free Entry' : formatPrice(0, event.currency)}
                  </p>
                </div>
              )}

              {/* Quantity Selector */}
              {selectedTicket && getAvailableTickets(selectedTicket) > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Number of Tickets
                  </label>
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 text-slate-600 hover:bg-slate-50"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(getAvailableTickets(selectedTicket), quantity + 1))}
                      className="px-4 py-2 text-slate-600 hover:bg-slate-50"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Total */}
              {selectedTicket && (
                <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Total</span>
                    <span className="text-2xl font-bold">
                      {formatPrice(selectedTicket.price * quantity, event.currency)}
                    </span>
                  </div>
                </div>
              )}

              {/* Payment Method Selection */}
              {selectedTicket && selectedTicket.price > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Select Payment Method</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('esewa')}
                      className={`p-3 border-2 rounded-lg flex flex-col items-center gap-1 transition ${
                        paymentMethod === 'esewa'
                          ? 'border-green-500 bg-green-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <img
                        src="https://esewa.com.np/common/images/esewa-icon-large.png"
                        alt="eSewa"
                        className="h-6"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      <span className={`text-xs font-medium ${paymentMethod === 'esewa' ? 'text-green-700' : 'text-slate-600'}`}>
                        eSewa
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('khalti')}
                      className={`p-3 border-2 rounded-lg flex flex-col items-center gap-1 transition ${
                        paymentMethod === 'khalti'
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <img
                        src="https://web.khalti.com/static/img/logo1.png"
                        alt="Khalti"
                        className="h-6"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      <span className={`text-xs font-medium ${paymentMethod === 'khalti' ? 'text-purple-700' : 'text-slate-600'}`}>
                        Khalti
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* Book Button */}
              <button
                onClick={handleBooking}
                disabled={booking || isAlreadyBooked() || (selectedTicket && getAvailableTickets(selectedTicket) === 0)}
                className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
                  isAlreadyBooked()
                    ? 'bg-green-500 cursor-not-allowed'
                    : booking
                    ? 'bg-slate-400 cursor-wait'
                    : selectedTicket && getAvailableTickets(selectedTicket) === 0
                    ? 'bg-slate-400 cursor-not-allowed'
                    : paymentMethod === 'khalti'
                    ? 'bg-purple-600 hover:bg-purple-700'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {booking ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    {selectedTicket?.price > 0 ? `Redirecting to ${paymentMethod === 'khalti' ? 'Khalti' : 'eSewa'}...` : 'Processing...'}
                  </span>
                ) : isAlreadyBooked() ? (
                  'Already Booked'
                ) : selectedTicket && getAvailableTickets(selectedTicket) === 0 ? (
                  'Sold Out'
                ) : selectedTicket?.price > 0 ? (
                  `Pay with ${paymentMethod === 'khalti' ? 'Khalti' : 'eSewa'}`
                ) : (
                  'Book Now (Free)'
                )}
              </button>

              {!isAuthenticated && (
                <p className="text-center text-sm text-slate-500 mt-4">
                  Please <a href="/login" className="text-primary hover:underline">login</a> to book this event
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
