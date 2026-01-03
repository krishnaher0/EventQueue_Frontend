import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, Search } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Communities = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [communities, setCommunities] = useState([]);
  const [userCommunities, setUserCommunities] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = ['all', 'Technology', 'Events', 'Arts & Culture', 'Sports', 'Food & Drink', 'Business', 'Travel', 'Entertainment', 'Other'];

  // Fetch all communities
  useEffect(() => {
    fetchCommunities();
  }, [filter, searchTerm, page]);

  // Fetch user's communities
  useEffect(() => {
    if (user) {
      fetchUserCommunities();
    }
  }, [user]);

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page,
        limit: 9,
        ...(filter !== 'all' && { category: filter }),
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await fetch(`http://localhost:5001/api/communities?${params}`);
      const data = await response.json();

      if (data.success) {
        setCommunities(data.data);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      console.error('Error fetching communities:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserCommunities = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/communities/user/my-communities', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();

      if (data.success) {
        const userCommsSet = new Set(data.data.map(c => c._id));
        setUserCommunities(userCommsSet);
      }
    } catch (error) {
      console.error('Error fetching user communities:', error);
    }
  };

  const handleJoin = async (communityId) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/api/communities/${communityId}/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        setUserCommunities(prev => new Set([...prev, communityId]));
      }
    } catch (error) {
      console.error('Error joining community:', error);
    }
  };

  const handleLeave = async (communityId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/communities/${communityId}/leave`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        setUserCommunities(prev => {
          const newSet = new Set(prev);
          newSet.delete(communityId);
          return newSet;
        });
      }
    } catch (error) {
      console.error('Error leaving community:', error);
    }
  };

  const handleViewCommunity = (communityId) => {
    navigate(`/community/${communityId}`);
  };

  return (
    <main className="min-h-screen bg-slate-50 py-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-12 mb-8">
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Communities</h1>
              <p className="text-purple-100">
                Join communities of like-minded people and connect with others who share your interests
              </p>
            </div>
            {user && (
              <button
                onClick={() => navigate('/create-community')}
                className="bg-white text-purple-600 hover:bg-purple-50 font-semibold py-2 px-6 rounded-lg flex items-center gap-2 transition"
              >
                <Plus size={20} />
                Create Community
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search communities..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="overflow-x-auto pb-2">
            <div className="flex gap-2 min-w-max">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => {
                    setFilter(category);
                    setPage(1);
                  }}
                  className={`px-4 py-2 rounded-full font-medium transition whitespace-nowrap ${
                    filter === category
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  {category === 'all' ? 'All' : category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Communities Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-600 text-lg">Loading communities...</p>
          </div>
        ) : communities.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 text-lg">No communities found</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {communities.map(community => (
                <div
                  key={community._id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden flex flex-col"
                >
                  {community.coverImage && (
                    <img
                      src={community.coverImage}
                      alt={community.name}
                      className="w-full h-40 object-cover cursor-pointer"
                      onClick={() => handleViewCommunity(community._id)}
                    />
                  )}
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex items-start justify-between mb-2">
                      <span className="inline-block bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-medium">
                        {community.category}
                      </span>
                      <span className="text-sm text-slate-500 flex items-center gap-1">
                        <Users size={14} />
                        {community.members?.length || 0} members
                      </span>
                    </div>
                    <h3
                      onClick={() => handleViewCommunity(community._id)}
                      className="font-semibold text-slate-800 mb-2 cursor-pointer hover:text-purple-600 transition"
                    >
                      {community.name}
                    </h3>
                    <p className="text-sm text-slate-600 mb-4 line-clamp-2 flex-grow">
                      {community.description}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewCommunity(community._id)}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-3 rounded-lg transition"
                      >
                        View
                      </button>
                      {user && userCommunities.has(community._id) ? (
                        <button
                          onClick={() => handleLeave(community._id)}
                          className="flex-1 bg-slate-100 text-slate-600 hover:bg-slate-200 font-semibold py-2 px-3 rounded-lg transition"
                        >
                          Leave
                        </button>
                      ) : (
                        <button
                          onClick={() => handleJoin(community._id)}
                          className="flex-1 bg-slate-100 text-slate-600 hover:bg-slate-200 font-semibold py-2 px-3 rounded-lg transition"
                        >
                          Join
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mb-8">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 disabled:opacity-50"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      page === pageNum
                        ? 'bg-purple-600 text-white'
                        : 'border border-slate-300 text-slate-700 hover:border-purple-600'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default Communities;
