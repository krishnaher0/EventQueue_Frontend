import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { venuesAPI } from '../../services/api';

const VENUE_TYPES = [
  'All',
  'Conference Hall',
  'Banquet Hall',
  'Outdoor Venue',
  'Hotel',
  'Restaurant',
  'Stadium',
  'Auditorium',
  'Meeting Room',
  'Rooftop',
  'Garden',
  'Beach',
  'Other',
];

const Venues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [sortBy, setSortBy] = useState('-createdAt');
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchVenues();
  }, [selectedType, sortBy, cityFilter]);

  const fetchVenues = async () => {
    try {
      setLoading(true);
      const params = { sort: sortBy };
      if (selectedType !== 'All') {
        params.type = selectedType;
      }
      if (cityFilter) {
        params.city = cityFilter;
      }
      const response = await venuesAPI.getAll(params);
      setVenues(response.data.venues);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching venues:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVenues = venues.filter((venue) =>
    venue.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-blue-600 mb-4 italic">
              Spot your desired Venues
            </h1>
            <p className="text-lg text-gray-700 italic">
              This is the perfect place for you to search for your desired venues to conduct various events
            </p>
          </div>

          {/* Search Box */}
          <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-4">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search Input */}
              <div className="flex-1 relative">
                <svg
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search venues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Type Filter */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 w-full md:w-48"
              >
                {VENUE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type === 'All' ? 'All Types' : type}
                  </option>
                ))}
              </select>

              {/* Location Filter */}
              <input
                type="text"
                placeholder="All Locations"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 w-full md:w-48"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Sort and Featured Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Featured Venues</h2>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="-createdAt">Newest First</option>
            <option value="pricing.basePrice">Price: Low to High</option>
            <option value="-pricing.basePrice">Price: High to Low</option>
            <option value="-ratings.average">Highest Rated</option>
            <option value="capacity.maximum">Capacity: Low to High</option>
            <option value="-capacity.maximum">Capacity: High to Low</option>
          </select>
        </div>

        {/* Venues Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : filteredVenues.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No venues found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVenues.map((venue) => (
              <Link
                key={venue._id}
                to={`/venues/${venue._id}`}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition group"
              >
                <div className="aspect-video overflow-hidden relative">
                  <img
                    src={venue.image || 'https://via.placeholder.com/400x300'}
                    alt={venue.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  {venue.isFeatured && (
                    <span className="absolute top-3 left-3 px-3 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full">
                      Featured
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs text-indigo-600 font-medium">
                        {venue.type}
                      </span>
                      <h3 className="font-semibold text-gray-900 mt-1 text-lg">
                        {venue.name}
                      </h3>
                    </div>
                    {venue.ratings?.average > 0 && (
                      <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-green-600"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm font-medium text-green-700">
                          {venue.ratings.average.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-3 text-gray-500 text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>
                      {venue.address?.city}, {venue.address?.country || 'Nepal'}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mt-3 text-gray-500 text-sm">
                    <div className="flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <span>Up to {venue.capacity?.maximum}</span>
                    </div>
                  </div>

                  {venue.amenities && venue.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {venue.amenities.slice(0, 3).map((amenity) => (
                        <span
                          key={amenity}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                        >
                          {amenity}
                        </span>
                      ))}
                      {venue.amenities.length > 3 && (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                          +{venue.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div>
                      <span className="text-xl font-bold text-gray-900">
                        NPR {venue.pricing?.basePrice?.toLocaleString()}
                      </span>
                      <span className="text-gray-500 text-sm">/day</span>
                    </div>
                    <span className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg group-hover:bg-indigo-700 transition">
                      View Details
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => fetchVenues(i + 1)}
                className={`px-4 py-2 rounded-lg ${
                  pagination.currentPage === i + 1
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 border hover:border-indigo-500'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Venues;
