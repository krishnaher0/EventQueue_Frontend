import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const RecommendedEvents = ({ events, loading, basedOn }) => {
  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!events || events.length === 0) {
    return null;
  }

  const getRecommendationTitle = () => {
    if (basedOn === 'personal_history') {
      return '✨ Recommended For You';
    } else if (basedOn === 'trending') {
      return '🔥 Trending Events';
    }
    return '🎯 Discover Events';
  };

  const getRecommendationSubtitle = () => {
    if (basedOn === 'personal_history') {
      return 'Based on your booking history and preferences';
    } else if (basedOn === 'trending') {
      return 'Most popular events this week';
    }
    return 'Explore events you might love';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatPrice = (pricing) => {
    if (!pricing || pricing.length === 0) return 'Free';
    const minPrice = Math.min(...pricing.map((p) => p.price));
    if (minPrice === 0) return 'Free';
    return `NPR ${minPrice.toLocaleString()}`;
  };

  return (
    <section className="py-16 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {getRecommendationTitle()}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {getRecommendationSubtitle()}
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {events.map((event) => (
            <Link
              key={event._id}
              to={`/events/${event._id}`}
              className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Event Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={
                    event.image ||
                    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop'
                  }
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src =
                      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop';
                  }}
                />
                {event.category && (
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-indigo-600 text-xs font-semibold rounded-full">
                      {event.category}
                    </span>
                  </div>
                )}
              </div>

              {/* Event Details */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                  {event.title}
                </h3>

                <div className="space-y-2 text-sm text-gray-600">
                  {/* Date */}
                  {event.startDate && (
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-indigo-500 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>{formatDate(event.startDate)}</span>
                      {event.startTime && <span className="text-gray-400">• {event.startTime}</span>}
                    </div>
                  )}

                  {/* Location */}
                  {(event.venueName || event.venueType === 'online') && (
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-indigo-500 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="line-clamp-1">
                        {event.venueType === 'online' ? 'Online Event' : event.venueName}
                      </span>
                    </div>
                  )}

                  {/* Price */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t">
                    <span className="text-lg font-bold text-indigo-600">
                      {formatPrice(event.pricing)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {event.attendees?.length || 0} attending
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl"
          >
            <span>Explore All Events</span>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

RecommendedEvents.propTypes = {
  events: PropTypes.array,
  loading: PropTypes.bool,
  basedOn: PropTypes.string,
};

RecommendedEvents.defaultProps = {
  events: [],
  loading: false,
  basedOn: 'popular',
};

export default RecommendedEvents;
