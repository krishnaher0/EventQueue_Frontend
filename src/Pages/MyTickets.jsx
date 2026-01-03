import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const MyTickets = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login', { state: { from: '/my-tickets' } });
      return;
    }

    if (isAuthenticated) {
      fetchTickets();
    }
  }, [isAuthenticated, authLoading, navigate]);

  const fetchTickets = async () => {
    try {
      const response = await authAPI.getMyTickets();
      setTickets(response.data.tickets);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError('Failed to load your tickets. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatPrice = (price, currency = 'NPR') => {
    if (!price || price === 0) return 'Free';
    return `${currency} ${price.toLocaleString()}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const isUpcoming = (date) => {
    if (!date) return false;
    return new Date(date) > new Date();
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-48 mb-8"></div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-6 mb-4 shadow-sm">
                <div className="flex gap-4">
                  <div className="w-32 h-24 bg-slate-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-6 bg-slate-200 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">My Tickets</h1>
          <p className="text-slate-500">View and manage your event bookings</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg">
            {error}
          </div>
        )}

        {tickets.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
                <path d="M15 5v2"/>
                <path d="M15 11v2"/>
                <path d="M15 17v2"/>
                <path d="M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7a2 2 0 0 1 2-2z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">No tickets yet</h3>
            <p className="text-slate-500 mb-6">You haven't booked any events yet. Start exploring!</p>
            <Link
              to="/events"
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
            >
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Upcoming Events */}
            {tickets.filter(t => isUpcoming(t.event.startDate)).length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-slate-800 mb-4">Upcoming Events</h2>
                <div className="space-y-4">
                  {tickets
                    .filter(t => isUpcoming(t.event.startDate))
                    .map((ticket) => (
                      <TicketCard key={ticket._id} ticket={ticket} formatDate={formatDate} formatPrice={formatPrice} getStatusColor={getStatusColor} />
                    ))}
                </div>
              </div>
            )}

            {/* Past Events */}
            {tickets.filter(t => !isUpcoming(t.event.startDate)).length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-slate-500 mb-4">Past Events</h2>
                <div className="space-y-4 opacity-75">
                  {tickets
                    .filter(t => !isUpcoming(t.event.startDate))
                    .map((ticket) => (
                      <TicketCard key={ticket._id} ticket={ticket} formatDate={formatDate} formatPrice={formatPrice} getStatusColor={getStatusColor} isPast />
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

const TicketCard = ({ ticket, formatDate, formatPrice, getStatusColor, isPast }) => {
  const { event } = ticket;

  return (
    <div className={`bg-white rounded-xl shadow-sm overflow-hidden ${isPast ? 'opacity-60' : ''}`}>
      <div className="flex flex-col sm:flex-row">
        {/* Event Image */}
        <div className="sm:w-48 h-32 sm:h-auto">
          <img
            src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop'}
            alt={event.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop';
            }}
          />
        </div>

        {/* Ticket Info */}
        <div className="flex-1 p-5">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(ticket.status)}`}>
                  {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                </span>
                <span className="text-xs text-slate-500">{event.category}</span>
              </div>

              <Link to={`/events/${event._id}`} className="hover:text-primary">
                <h3 className="text-lg font-semibold text-slate-800 mb-2">{event.title}</h3>
              </Link>

              <div className="space-y-1 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  <span>{formatDate(event.startDate)} at {event.startTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <span>{event.venueName || (event.venueType === 'online' ? 'Online Event' : 'Location TBD')}</span>
                </div>
              </div>
            </div>

            {/* Ticket Details */}
            <div className="sm:text-right">
              <div className="bg-slate-50 rounded-lg p-3 inline-block">
                <p className="text-xs text-slate-500 mb-1">Ticket</p>
                <p className="font-medium text-slate-800">{ticket.ticketType}</p>
                <p className="text-sm text-slate-500">x{ticket.quantity}</p>
                <p className="text-lg font-bold text-primary mt-1">
                  {formatPrice(ticket.totalPrice)}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 pt-4 border-t flex flex-wrap gap-3">
            <Link
              to={`/events/${event._id}`}
              className="text-sm text-primary font-medium hover:underline"
            >
              View Event
            </Link>
            {!isPast && ticket.status === 'confirmed' && (
              <>
                <span className="text-slate-300">|</span>
                <button className="text-sm text-slate-600 font-medium hover:text-slate-800">
                  Download Ticket
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTickets;
