import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Share2, Users, Settings, Trash2, Edit2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const CommunityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [postComments, setPostComments] = useState({});
  const [newCommentText, setNewCommentText] = useState({});

  useEffect(() => {
    fetchCommunity();
  }, [id]);

  const fetchCommunity = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5001/api/communities/${id}`);
      const data = await response.json();

      if (data.success) {
        setCommunity(data.data);
        
        // Check if user is a member
        if (user && data.data.members.some(m => m._id === user._id)) {
          setIsMember(true);
        }

        // Track liked posts
        if (user) {
          const likedSet = new Set(
            data.data.posts
              .filter(post => post.likes.some(like => like._id === user._id))
              .map(post => post._id)
          );
          setLikedPosts(likedSet);
        }
      }
    } catch (error) {
      console.error('Error fetching community:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/api/communities/${id}/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        setIsMember(true);
        setCommunity(data.data);
      }
    } catch (error) {
      console.error('Error joining community:', error);
    }
  };

  const handleLeave = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/communities/${id}/leave`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        setIsMember(false);
        setCommunity(data.data);
      }
    } catch (error) {
      console.error('Error leaving community:', error);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostTitle || !newPostContent) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/api/communities/${id}/posts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newPostTitle,
          content: newPostContent,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setCommunity(data.data);
        setNewPostTitle('');
        setNewPostContent('');
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleLikePost = async (postId) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/api/communities/${id}/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        setCommunity(data.data);
        setLikedPosts(prev => {
          const newSet = new Set(prev);
          if (newSet.has(postId)) {
            newSet.delete(postId);
          } else {
            newSet.add(postId);
          }
          return newSet;
        });
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      const response = await fetch(`http://localhost:5001/api/communities/${id}/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setCommunity(data.data);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleAddComment = async (postId) => {
    const text = newCommentText[postId];
    if (!text) return;

    try {
      const response = await fetch(`http://localhost:5001/api/communities/${id}/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      if (data.success) {
        setCommunity(data.data);
        setNewCommentText(prev => ({
          ...prev,
          [postId]: '',
        }));
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600 text-lg">Loading community...</p>
      </main>
    );
  }

  if (!community) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600 text-lg">Community not found</p>
      </main>
    );
  }

  const isCreator = user && community.creator._id === user._id;

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        {community.coverImage && (
          <img
            src={community.coverImage}
            alt={community.name}
            className="w-full h-48 object-cover"
          />
        )}
        <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">{community.name}</h1>
              <p className="text-slate-600 mb-4 max-w-2xl">{community.description}</p>
              <div className="flex items-center gap-6 text-sm text-slate-600">
                <span className="bg-slate-100 px-3 py-1 rounded-full">{community.category}</span>
                <span className="flex items-center gap-1">
                  <Users size={16} />
                  {community.members?.length || 0} members
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              {isCreator && (
                <button className="p-2 hover:bg-slate-100 rounded-lg transition">
                  <Settings size={20} className="text-slate-600" />
                </button>
              )}
              {isMember ? (
                <button
                  onClick={handleLeave}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition"
                >
                  Leave Community
                </button>
              ) : (
                <button
                  onClick={handleJoin}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition"
                >
                  Join Community
                </button>
              )}
            </div>
          </div>

          {community.rules && community.rules.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">Community Rules</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                {community.rules.map((rule, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span>•</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8">
        {/* Create Post Form */}
        {isMember && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Create a Post</h3>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <input
                type="text"
                placeholder="Post title"
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
              <textarea
                placeholder="What's on your mind?"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                rows="4"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
              />
              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Post
              </button>
            </form>
          </div>
        )}

        {/* Posts */}
        <div className="space-y-6">
          {community.posts && community.posts.length > 0 ? (
            community.posts.map(post => (
              <div key={post._id} className="bg-white rounded-lg shadow-sm p-6">
                {/* Post Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {post.author?.profilePicture && (
                        <img
                          src={post.author.profilePicture}
                          alt={post.author.name}
                          className="w-8 h-8 rounded-full"
                        />
                      )}
                      <div>
                        <p className="font-semibold text-slate-900">{post.author?.name}</p>
                        <p className="text-xs text-slate-500">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-2">{post.title}</h4>
                  </div>
                  {user && post.author._id === user._id && (
                    <button
                      onClick={() => handleDeletePost(post._id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>

                {/* Post Content */}
                <p className="text-slate-700 mb-4 whitespace-pre-wrap">{post.content}</p>

                {/* Post Stats */}
                <div className="flex gap-4 text-sm text-slate-600 py-3 border-t border-b border-slate-200 mb-4">
                  <span className="flex items-center gap-1">
                    <Heart size={16} />
                    {post.likes?.length || 0} likes
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle size={16} />
                    {post.comments?.length || 0} comments
                  </span>
                </div>

                {/* Like Button */}
                {isMember && (
                  <button
                    onClick={() => handleLikePost(post._id)}
                    className={`w-full mb-4 py-2 px-4 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                      likedPosts.has(post._id)
                        ? 'bg-red-100 text-red-600 hover:bg-red-200'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Heart size={16} fill={likedPosts.has(post._id) ? 'currentColor' : 'none'} />
                    Like
                  </button>
                )}

                {/* Comments */}
                {post.comments && post.comments.length > 0 && (
                  <div className="space-y-3 mb-4">
                    {post.comments.map(comment => (
                      <div key={comment._id} className="p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          {comment.author?.profilePicture && (
                            <img
                              src={comment.author.profilePicture}
                              alt={comment.author.name}
                              className="w-6 h-6 rounded-full"
                            />
                          )}
                          <p className="font-semibold text-sm text-slate-900">
                            {comment.author?.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="text-sm text-slate-700">{comment.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Comment */}
                {isMember && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={newCommentText[post._id] || ''}
                      onChange={(e) => setNewCommentText(prev => ({
                        ...prev,
                        [post._id]: e.target.value,
                      }))}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm"
                    />
                    <button
                      onClick={() => handleAddComment(post._id)}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                    >
                      Comment
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-slate-600">No posts yet. Be the first to post!</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default CommunityDetail;
