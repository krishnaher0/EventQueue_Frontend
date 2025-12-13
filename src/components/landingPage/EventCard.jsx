import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
    const {
        _id,
        title,
        image,
        date,
        time,
        location,
        price,
        category,
        tag,
    } = event;

    const tagColors = {
        Featured: 'bg-orange-500',
        Outdoor: 'bg-green-500',
        Conference: 'bg-blue-500',
        Art: 'bg-purple-500',
        Business: 'bg-indigo-500',
        Sports: 'bg-red-500',
    };

    const formatDate = (dateString) => {
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100">
            {/* Image */}
            <div className="relative">
                <img
                    src={image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop'}
                    alt={title}
                    className="w-full h-48 object-cover"
                />
                {tag && (
                    <span className={`absolute top-3 left-3 ${tagColors[tag] || 'bg-gray-500'} text-white text-xs px-3 py-1 rounded-full`}>
                        {tag}
                    </span>
                )}
                {category && (
                    <span className="absolute bottom-3 left-3 bg-white/90 text-gray-700 text-xs px-3 py-1 rounded-full">
                        {category}
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="p-5">
                <h3 className="font-semibold text-lg text-gray-900 mb-3 line-clamp-1">{title}</h3>

                <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-500 text-sm">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatDate(date)}
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {time || '9:00 AM'}
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {location}
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="font-bold text-gray-900">
                        {price === 0 || price === 'Free' ? (
                            <span className="text-green-600">Free</span>
                        ) : (
                            <span>NPR {price}</span>
                        )}
                    </div>
                    <Link
                        to={`/event/${_id}`}
                        className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                    >
                        Book Now
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default EventCard;
