import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { communityAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import heroImage from "../../images/community.png";

const Communities = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [search, setSearch] = useState(searchParams.get('search') || '');

  const categories = ['all', 'Technology', 'Gaming', 'Sports', 'Music', 'Art', 'Education', 'Business', 'Lifestyle', 'Other'];

  useEffect(() => {
    fetchCommunities();
  }, [category, searchParams.get('page')]);

  const fetchCommunities = async () => {
    setLoading(true);
    try {
      const params = {
        page: searchParams.get('page') || 1,
        limit: 12,
      };
      if (category !== 'all') params.category = category;
      if (search) params.search = search;

      const response = await communityAPI.getCommunities(params);
      setCommunities(response.data.communities);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Fetch communities error:', error);
      toast.error('Failed to load communities');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setSearchParams({ category: cat });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCommunities();
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section with Background Image and Search Overlay */}
      <div
        className="relative h-[500px] bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center px-4">
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">Communities</h1>
            <p className="text-white/90 text-lg">Connect with people who share your interests</p>
          </div>

          {/* Search Box */}
          <div className="w-full max-w-3xl bg-white rounded-lg shadow-xl p-2">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2">
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-slate-700"
              >
                <option value="all">All Categories</option>
                {categories.filter(cat => cat !== 'all').map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search communities..."
                className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {/* <button
                type="submit"
                className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                SEARCH NOW
              </button> */}
            </form>
          </div>

          {/* Create Community Button */}
          {isAuthenticated && (
            <Link
              to="/communities/create"
              className="absolute bottom-8 right-8 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
            >
              Create Community
            </Link>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Communities Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : communities.length === 0 ? (
        <div className="text-center py-20">
          <svg
            className="mx-auto h-12 w-12 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-slate-900">No communities found</h3>
          <p className="mt-1 text-sm text-slate-500">Try adjusting your search or filters</p>
          {isAuthenticated && (
            <Link
              to="/communities/create"
              className="mt-4 inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Create the first community
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {communities.map((community) => (
              <Link
                key={community._id}
                to={`/communities/${community.slug}`}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all group"
              >
                {/* Community Avatar */}
                <div className="h-32 bg-gradient-to-br from-primary to-purple-600 relative">
                  {community.coverImage && (
                    <img
                      src={community.coverImage}
                      alt={community.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute -bottom-12 left-6">
                    {community.avatar ? (
                      <img
                        src={community.avatar}
                        alt={community.name}
                        className="w-24 h-24 rounded-xl object-cover border-4 border-white shadow-md"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-white rounded-xl border-4 border-white shadow-md flex items-center justify-center">
                        <span className="text-3xl font-bold text-primary">
                          {community.name?.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 pt-16">
                  {/* Category Badge */}
                  <div className="mb-2">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                      {community.category}
                    </span>
                  </div>

                  {/* Name */}
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">
                    {community.name}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                    {truncateText(community.description, 100)}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        {community.memberCount || 0} members
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {community.postCount || 0} posts
                      </span>
                    </div>
                    {community.privacy === 'private' && (
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => setSearchParams({ ...Object.fromEntries(searchParams), page: pagination.currentPage - 1 })}
                disabled={pagination.currentPage === 1}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="text-slate-600">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setSearchParams({ ...Object.fromEntries(searchParams), page: pagination.currentPage + 1 })}
                disabled={pagination.currentPage === pagination.totalPages}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
      </div>
    </div>
  );
};

export default Communities;
