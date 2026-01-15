import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import EventCard from "../../components/events/EventCard";
import { eventsAPI } from "../../services/api";

const categories = [
  'All',
  'Business',
  'Social & Networking',
  'Sports & Fitness',
  'Food & Drink',
  'Workshops',
  'Arts & Culture',
  'Technology',
  'Health & Wellness',
  'Education',
  'Charity',
  'Other'
];

const Events = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalEvents: 0
  });

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || 'All',
    search: searchParams.get('search') || '',
    location: searchParams.get('location') || ''
  });

  const [searchInput, setSearchInput] = useState(filters.search);
  const [locationInput, setLocationInput] = useState(filters.location);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchInput }));
      if (searchInput) {
        searchParams.set('search', searchInput);
      } else {
        searchParams.delete('search');
      }
      setSearchParams(searchParams);
    }, 300); // 300ms debounce delay for faster response

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Debounced location effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({ ...prev, location: locationInput }));
      if (locationInput) {
        searchParams.set('location', locationInput);
      } else {
        searchParams.delete('location');
      }
      setSearchParams(searchParams);
    }, 300); // 300ms debounce delay for faster response

    return () => clearTimeout(timer);
  }, [locationInput]);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const params = {
          page: pagination.currentPage,
          limit: 12
        };

        if (filters.category && filters.category !== 'All') {
          params.category = filters.category;
        }
        if (filters.search) {
          params.search = filters.search;
        }
        if (filters.location) {
          params.location = filters.location;
        }

        const response = await eventsAPI.getAll(params);
        setEvents(response.data.events);
        setPagination(response.data.pagination);
      } catch (error) {
        console.error('Error fetching events:', error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [filters, pagination.currentPage]);

  const handleCategoryChange = (category) => {
    setFilters(prev => ({ ...prev, category }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    if (category === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleLocationChange = (e) => {
    const value = e.target.value;
    setLocationInput(value);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b">
        {/* <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Discover Events</h1>
          <p className="text-slate-500">Find and book amazing events happening around you</p>
        </div> */}
      </div>

      {/* Filters */}
      <div className="bg-white border-b sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchInput}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>

            {/* Location */}
            <div className="md:w-64">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <input
                  type="text"
                  placeholder="Location"
                  value={locationInput}
                  onChange={handleLocationChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  filters.category === category
                    ? 'bg-blue-500 text-black'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="h-44 animate-shimmer"></div>
                <div className="p-5">
                  <div className="h-6 animate-shimmer rounded mb-4"></div>
                  <div className="h-4 animate-shimmer rounded mb-2"></div>
                  <div className="h-4 animate-shimmer rounded w-3/5"></div>
                </div>
              </div>
            ))}
          </div>
        ) : events.length > 0 ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-slate-600">
                Showing <span className="font-medium">{events.length}</span> of{' '}
                <span className="font-medium">{pagination.totalEvents}</span> events
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {events.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-12 flex justify-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {[...Array(pagination.totalPages)].map((_, idx) => (
                  <button
                    key={idx + 1}
                    onClick={() => handlePageChange(idx + 1)}
                    className={`w-10 h-10 rounded-lg font-medium ${
                      pagination.currentPage === idx + 1
                        ? 'bg-primary text-white'
                        : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">No events found</h3>
            <p className="text-slate-500 mb-6">Try adjusting your filters or search terms</p>
            <button
              onClick={() => {
                setFilters({ category: 'All', search: '', location: '' });
                setSearchInput('');
                setLocationInput('');
                setSearchParams({});
              }}
              className="text-primary font-medium hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
