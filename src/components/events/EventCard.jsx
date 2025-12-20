import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getLowestPrice = () => {
    if (event.isFree) return 0;
    if (event.ticketTypes && event.ticketTypes.length > 0) {
      return Math.min(...event.ticketTypes.map(t => t.price));
    }
    return event.price || 0;
  };

  const formatPrice = (price, currency = 'NPR') => {
    if (price === 0) return 'Free';
    return `${currency} ${price.toLocaleString()}`;
  };

  const getLocation = () => {
    if (event.venueType === 'online') return 'Online Event';
    if (event.venueName) return event.venueName;
    if (event.address?.city) return event.address.city;
    if (event.location) return event.location;
    return 'Location TBD';
  };

  const price = getLowestPrice();

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop'}
          alt={event.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop';
          }}
        />
        {event.isFeatured && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Featured
          </span>
        )}
        {event.tags && event.tags.length > 0 && (
          <div className="absolute bottom-3 left-3 flex gap-2">
            {event.tags.slice(0, 2).map((tag, idx) => (
              <span key={idx} className="bg-white/90 text-xs font-medium px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold mb-3 text-slate-800 line-clamp-1">{event.title}</h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span>{formatDate(event.startDate || event.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <span>{event.startTime || event.time || 'Time TBD'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span className="line-clamp-1">{getLocation()}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
          <span className={`text-lg font-bold ${price === 0 ? 'text-emerald-500' : 'text-slate-800'}`}>
            {formatPrice(price, event.currency)}
          </span>
          <Link
            to={`/events/${event._id}`}
            className="bg-secondary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-900 transition-colors"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
