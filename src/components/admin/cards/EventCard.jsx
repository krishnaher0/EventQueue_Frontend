const EventCard = ({ event, onEdit, onPublish, onUnpublish, onReject, onDelete, isOrganizer = false }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Event Image */}
      <div className="aspect-video relative">
        <img
          src={event.image || 'https://via.placeholder.com/400x225?text=No+Image'}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        {/* Status Badges */}
        <div className="absolute top-3 right-3 flex gap-2">
          {event.isFeatured && (
            <span className="px-2.5 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full shadow">
              ⭐ Featured
            </span>
          )}
          <span
            className={`px-2.5 py-1 text-xs font-medium rounded-full shadow ${
              event.status === 'published'
                ? 'bg-green-500 text-white'
                : event.status === 'pending'
                ? 'bg-yellow-500 text-white'
                : event.status === 'cancelled'
                ? 'bg-red-500 text-white'
                : 'bg-slate-500 text-white'
            }`}
          >
            {event.status?.charAt(0).toUpperCase() + event.status?.slice(1)}
          </span>
        </div>
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 bg-primary/90 text-white text-xs font-medium rounded-full shadow">
            {event.category}
          </span>
        </div>
      </div>

      {/* Event Details */}
      <div className="p-4">
        <h3 className="font-semibold text-slate-900 text-lg line-clamp-1 mb-1">
          {event.title}
        </h3>
        
        {/* Location */}
        <p className="text-sm text-slate-500 flex items-center gap-1.5 mb-2">
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {event.location?.venue || event.location?.city || 'Location TBD'}
        </p>

        {/* Date & Organizer */}
        <div className="flex items-center justify-between text-sm mb-3">
          <span className="text-slate-600 flex items-center gap-1.5">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {event.startDate ? new Date(event.startDate).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            }) : 'Date TBD'}
          </span>
          <span className="text-slate-500 text-xs">
            by {event.organizer?.fullName || 'Admin'}
          </span>
        </div>

        {/* Ticket Info */}
        {event.ticketTypes && event.ticketTypes.length > 0 && (
          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-100">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            <span className="text-sm font-medium text-slate-700">
              From NPR {Math.min(...event.ticketTypes.map(t => t.price || 0)).toLocaleString()}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onEdit(event)}
            className="flex-1 px-3 py-2 text-sm bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition font-medium"
          >
            Edit
          </button>
          {!isOrganizer && (
            <>
              {event.status === 'published' ? (
                <button
                  onClick={() => onUnpublish(event)}
                  className="px-3 py-2 text-sm bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition font-medium"
                >
                  Unpublish
                </button>
              ) : (
                <button
                  onClick={() => onPublish(event._id)}
                  className="px-3 py-2 text-sm bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition font-medium"
                >
                  Publish
                </button>
              )}
              {event.status === 'pending' && (
                <button
                  onClick={() => onReject(event._id)}
                  className="px-3 py-2 text-sm bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition font-medium"
                >
                  Reject
                </button>
              )}
            </>
          )}
          <button
            onClick={() => onDelete(event._id)}
            className="px-3 py-2 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;