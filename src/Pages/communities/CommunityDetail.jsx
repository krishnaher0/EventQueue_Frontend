import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { communityAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';

const CommunityDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const { socket, connected } = useSocket();
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');
  const [isMember, setIsMember] = useState(false);
  const [joiningCommunity, setJoiningCommunity] = useState(false);

  // Post creation state
  const [postContent, setPostContent] = useState('');
  const [postImage, setPostImage] = useState(null);
  const [postImagePreview, setPostImagePreview] = useState(null);
  const [submittingPost, setSubmittingPost] = useState(false);

  // Comment state
  const [commentInputs, setCommentInputs] = useState({});
  const [submittingComments, setSubmittingComments] = useState({});

  // Chat state
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  if (authLoading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
}

  useEffect(() => {
    fetchCommunity();
  }, [slug]);

  // Socket.io chat functionality
  useEffect(() => {
    if (socket && community?._id && activeTab === 'chat' && isMember) {
      // Join community chat room
      socket.emit('join-community', community._id);

      // Load existing messages
      fetchChatMessages();

      // Listen for new messages
      socket.on('new-message', (data) => {
        setMessages(prev => [...prev, data.message]);
        scrollToBottom();
      });

      // Listen for user joined
      socket.on('user-joined', (data) => {
        console.log(`${data.user.fullName} joined the chat`);
      });

      // Listen for errors
      socket.on('error', (error) => {
        toast.error(error.message);
      });

      return () => {
        socket.emit('leave-community', community._id);
        socket.off('new-message');
        socket.off('user-joined');
        socket.off('error');
      };
    }
  }, [socket, community?._id, activeTab, isMember]);

  const fetchCommunity = async () => {
    setLoading(true);
    try {
      const response = await communityAPI.getCommunity(slug);
      const communityData = response.data.community;
      setCommunity(communityData);

      // Use the isMember flag from the backend
      if (isAuthenticated) {
        setIsMember(communityData.isMember || false);
      } else {
        setIsMember(false);
      }
    } catch (error) {
      console.error('Fetch community error:', error);
      toast.error('Failed to load community');
      navigate('/communities');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinLeave = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to join this community');
      navigate('/login');
      return;
    }

    setJoiningCommunity(true);
    try {
      if (isMember) {
        await communityAPI.leaveCommunity(community._id);
        toast.success('Left community successfully');
        setIsMember(false);
      } else {
        await communityAPI.joinCommunity(community._id);
        toast.success('Joined community successfully');
        setIsMember(true);
      }
      fetchCommunity();
    } catch (error) {
      console.error('Join/Leave error:', error);
      toast.error(error.message || 'Failed to update membership');
    } finally {
      setJoiningCommunity(false);
    }
  };

  const handlePostImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      setPostImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPostImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePostImage = () => {
    setPostImage(null);
    setPostImagePreview(null);
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to post');
      navigate('/login');
      return;
    }

    if (!isMember) {
      toast.error('You must be a member to post');
      return;
    }

    if (!postContent.trim()) {
      toast.error('Post content cannot be empty');
      return;
    }

    setSubmittingPost(true);
    try {
      const formData = new FormData();
      formData.append('content', postContent.trim());
      if (postImage) {
        formData.append('image', postImage);
      }

      await communityAPI.createPost(community._id, formData);
      toast.success('Post created successfully');
      setPostContent('');
      setPostImage(null);
      setPostImagePreview(null);
      fetchCommunity();
    } catch (error) {
      console.error('Create post error:', error);
      toast.error(error.message || 'Failed to create post');
    } finally {
      setSubmittingPost(false);
    }
  };

  const handleToggleLike = async (postId) => {
    if (!isAuthenticated) {
      toast.error('Please login to like posts');
      navigate('/login');
      return;
    }

    try {
      await communityAPI.togglePostLike(community._id, postId);
      fetchCommunity();
    } catch (error) {
      console.error('Like error:', error);
      toast.error(error.message || 'Failed to like post');
    }
  };

  const handleAddComment = async (postId) => {
    if (!isAuthenticated) {
      toast.error('Please login to comment');
      navigate('/login');
      return;
    }

    const content = commentInputs[postId];
    if (!content?.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    setSubmittingComments(prev => ({ ...prev, [postId]: true }));
    try {
      await communityAPI.addPostComment(community._id, postId, content);
      toast.success('Comment added successfully');
      setCommentInputs(prev => ({ ...prev, [postId]: '' }));
      fetchCommunity();
    } catch (error) {
      console.error('Comment error:', error);
      toast.error(error.message || 'Failed to add comment');
    } finally {
      setSubmittingComments(prev => ({ ...prev, [postId]: false }));
    }
  };

  const fetchChatMessages = async () => {
    setLoadingMessages(true);
    try {
      const response = await communityAPI.getChatMessages(community._id);
      // Reverse the messages so oldest is first (top), newest is last (bottom)
      const sortedMessages = (response.data.messages || []).reverse();
      setMessages(sortedMessages);
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error('Fetch messages error:', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !socket) return;

    socket.emit('send-message', {
      communityId: community._id,
      content: messageInput.trim()
    });

    setMessageInput('');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (const [name, count] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / count);
      if (interval >= 1) {
        return `${interval} ${name}${interval !== 1 ? 's' : ''} ago`;
      }
    }
    return 'Just now';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Community not found</h2>
          <Link to="/communities" className="text-primary hover:underline">
            Back to Communities
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Cover Image Banner */}
      <div className="w-full h-64 bg-gradient-to-r from-primary to-purple-600 relative">
        {community.coverImage && (
          <img
            src={community.coverImage}
            alt={community.name}
            className="w-full h-full object-cover"
          />
        )}

        {/* Community Avatar Overlay */}
        <div className="absolute -bottom-16 left-0 right-0">
          <div className="max-w-7xl mx-auto px-4 flex items-end gap-6">
            {community.avatar ? (
              <img
                src={community.avatar}
                alt={community.name}
                className="w-32 h-32 rounded-xl object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-32 h-32 bg-white rounded-xl border-4 border-white shadow-lg flex items-center justify-center">
                <span className="text-5xl font-bold text-primary">
                  {community.name?.charAt(0)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Community Info */}
      <div className="max-w-7xl mx-auto px-4 pt-20 pb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-slate-900">{community.name}</h1>
              <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                {community.category}
              </span>
              {community.privacy === 'private' && (
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              )}
            </div>
            <p className="text-slate-600 mb-4">{community.description}</p>
            <div className="flex items-center gap-6 text-sm text-slate-600">
              <span className="flex items-center gap-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                {community.members?.length || 0} members
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {community.posts?.length || 0} posts
              </span>
            </div>
          </div>

          {/* Join/Leave Button */}
          {isAuthenticated && (
            <button
              onClick={handleJoinLeave}
              disabled={joiningCommunity}
              className={`px-8 py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                isMember
                  ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  : 'bg-gradient-to-r from-primary to-purple-600 text-white hover:shadow-lg'
              }`}
            >
              {joiningCommunity ? 'Loading...' : isMember ? 'Leave Community' : 'Join Community'}
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 mb-8">
          <div className="flex gap-8">
            {['posts', 'chat', 'members', 'about'].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  if (tab === 'chat' && !isMember) {
                    toast.error('You must be a member to access the chat');
                    return;
                  }
                  setActiveTab(tab);
                }}
                className={`pb-4 font-medium capitalize transition-colors relative ${
                  activeTab === tab
                    ? 'text-primary'
                    : 'text-slate-600 hover:text-slate-900'
                } ${tab === 'chat' && !isMember ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={tab === 'chat' && !isMember}
              >
                {tab === 'chat' ? 'Group Chat' : tab}
                {tab === 'chat' && !isMember && (
                  <svg className="w-4 h-4 inline-block ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'posts' && (
          <div className="space-y-6">
            {/* Create Post Form */}
            {isMember && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <form onSubmit={handleCreatePost}>
                  <div className="flex gap-3">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.fullName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-semibold">
                        {user?.fullName?.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1">
                      <textarea
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        placeholder="Share something with the community..."
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                        rows="3"
                      />

                      {postImagePreview && (
                        <div className="mt-3 relative">
                          <img
                            src={postImagePreview}
                            alt="Post preview"
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={handleRemovePostImage}
                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      )}

                      <div className="flex justify-between items-center mt-3">
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePostImageChange}
                            className="hidden"
                            id="postImage"
                          />
                          <label
                            htmlFor="postImage"
                            className="cursor-pointer flex items-center gap-2 text-slate-600 hover:text-primary transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Add Image
                          </label>
                        </div>
                        <button
                          type="submit"
                          disabled={submittingPost || !postContent.trim()}
                          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {submittingPost ? 'Posting...' : 'Post'}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* Posts Feed */}
            {community.posts && community.posts.length > 0 ? (
              community.posts.map((post) => (
                <div key={post._id} className="bg-white rounded-xl shadow-sm p-6">
                  {/* Post Header */}
                  <div className="flex items-center gap-3 mb-4">
                    {post.author?.avatar ? (
                      <img
                        src={post.author.avatar}
                        alt={post.author.fullName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-semibold">
                        {post.author?.fullName?.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-slate-900">{post.author?.fullName}</p>
                      <p className="text-sm text-slate-500">{formatTimeAgo(post.createdAt)}</p>
                    </div>
                  </div>

                  {/* Post Content */}
                  <p className="text-slate-700 mb-4 whitespace-pre-wrap">{post.content}</p>

                  {/* Post Image */}
                  {post.image && (
                    <img
                      src={post.image}
                      alt="Post"
                      className="w-full rounded-lg mb-4"
                    />
                  )}

                  {/* Post Actions */}
                  <div className="flex items-center gap-4 pt-4 border-t border-slate-200">
                    <button
                      onClick={() => handleToggleLike(post._id)}
                      className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill={post.likes?.some(like =>
                          (typeof like === 'object' ? like._id : like) === user?._id
                        ) ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {post.likes?.length || 0} likes
                    </button>
                    <span className="flex items-center gap-2 text-slate-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                      {post.comments?.length || 0} comments
                    </span>
                  </div>

                  {/* Comments */}
                  {post.comments && post.comments.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-200 space-y-3">
                      {post.comments.map((comment) => (
                        <div key={comment._id} className="flex gap-3">
                          {comment.user?.avatar ? (
                            <img
                              src={comment.user.avatar}
                              alt={comment.user.fullName}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-semibold text-sm">
                              {comment.user?.fullName?.charAt(0)}
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="bg-slate-50 rounded-lg p-3">
                              <p className="font-semibold text-sm text-slate-900">
                                {comment.user?.fullName}
                              </p>
                              <p className="text-slate-700 text-sm">{comment.content}</p>
                            </div>
                            <p className="text-xs text-slate-500 mt-1 ml-3">
                              {formatTimeAgo(comment.createdAt)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Comment */}
                  {isAuthenticated && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <div className="flex gap-3">
                        {user?.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.fullName}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-semibold text-sm">
                            {user?.fullName?.charAt(0)}
                          </div>
                        )}
                        <div className="flex-1 flex gap-2">
                          <input
                            type="text"
                            value={commentInputs[post._id] || ''}
                            onChange={(e) => setCommentInputs(prev => ({
                              ...prev,
                              [post._id]: e.target.value
                            }))}
                            placeholder="Write a comment..."
                            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                          <button
                            onClick={() => handleAddComment(post._id)}
                            disabled={submittingComments[post._id] || !commentInputs[post._id]?.trim()}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {submittingComments[post._id] ? 'Sending...' : 'Send'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-xl shadow-sm">
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-slate-900">No posts yet</h3>
                <p className="mt-1 text-sm text-slate-500">
                  {isMember ? 'Be the first to share something!' : 'Join the community to see posts'}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <h3 className="font-semibold text-slate-900">Group Chat</h3>
                  <span className="text-sm text-slate-500">
                    {connected ? 'Connected' : 'Connecting...'}
                  </span>
                </div>
                <span className="text-sm text-slate-500">
                  {community.members?.length || 0} members
                </span>
              </div>
            </div>

            {/* Messages Container */}
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50"
              style={{ maxHeight: 'calc(600px - 140px)' }}
            >
              {loadingMessages ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <svg
                    className="w-16 h-16 text-slate-300 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <p className="text-slate-500 font-medium">No messages yet</p>
                  <p className="text-sm text-slate-400 mt-1">Be the first to start the conversation!</p>
                </div>
              ) : (
                <>
                  {messages.map((message, index) => {
                    //const isOwnMessage = message.sender?._id === user?._id;

                    console.log("Sender ID:", message.sender?._id);
  console.log("User ID:", user?._id);

  const senderId =
    typeof message.sender === "string"
      ? message.sender
      : message.sender?._id;

  const isOwnMessage = senderId === user?._id;
                    

                    if (isOwnMessage) {
                      // Your messages - Right side
                      return (
                        <div key={message._id || index} className="flex justify-end">
                          <div className="flex flex-col items-end max-w-[70%]">
                            <div className="bg-gradient-to-r from-primary to-purple-600 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 shadow-sm">
                              <p className="text-sm whitespace-pre-wrap break-words">
                                {message.content}
                              </p>
                            </div>
                            <p className="text-xs text-slate-400 mt-1 mr-1">
                              {formatTimeAgo(message.createdAt)}
                            </p>
                          </div>
                        </div>
                      );
                    } else {
                      // Other people's messages - Left side
                      return (
                        <div key={message._id || index} className="flex justify-start">
                          <div className="flex gap-2.5 max-w-[70%]">
                            {/* Avatar */}
                            {message.sender?.avatar ? (
                              <img
                                src={message.sender.avatar}
                                alt={message.sender?.fullName}
                                className="w-9 h-9 rounded-full object-cover flex-shrink-0 mt-0.5"
                              />
                            ) : (
                              <div className="w-9 h-9 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-sm font-semibold text-primary">
                                  {message.sender?.fullName?.charAt(0) || '?'}
                                </span>
                              </div>
                            )}

                            {/* Message Content */}
                            <div className="flex flex-col">
                              <p className="text-xs font-semibold text-slate-700 mb-1">
                                {message.sender?.fullName || 'Unknown'}
                              </p>
                              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-2.5 shadow-sm">
                                <p className="text-sm text-slate-900 whitespace-pre-wrap break-words">
                                  {message.content}
                                </p>
                              </div>
                              <p className="text-xs text-slate-400 mt-1 ml-1">
                                {formatTimeAgo(message.createdAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  })}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Message Input */}
            <div className="px-6 py-4 border-t border-slate-200 bg-white">
              <form onSubmit={handleSendMessage} className="flex gap-3 items-center">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-5 py-3 bg-slate-100 border-0 rounded-full focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                  disabled={!connected || sendingMessage}
                  autoComplete="off"
                />
                <button
                  type="submit"
                  disabled={!messageInput.trim() || !connected || sendingMessage}
                  className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-primary to-purple-600 text-white rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                  title="Send message"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              Members ({community.members?.length || 0})
            </h2>
            {community.members && community.members.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {community.members.map((member) => (
                  <div key={member._id} className="text-center">
                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt={member.fullName}
                        className="w-20 h-20 rounded-full object-cover mx-auto mb-2"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-2xl font-bold text-primary">
                          {member.fullName?.charAt(0)}
                        </span>
                      </div>
                    )}
                    <p className="font-medium text-slate-900 text-sm truncate">
                      {member.fullName}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <p>No members yet</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'about' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">About</h2>
            <p className="text-slate-700 mb-6 whitespace-pre-wrap">{community.description}</p>

            {community.rules && community.rules.length > 0 && (
              <>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Community Rules</h3>
                <div className="space-y-4">
                  {community.rules.map((rule, index) => (
                    <div key={index} className="border-l-4 border-primary pl-4">
                      <h4 className="font-semibold text-slate-900 mb-1">
                        {index + 1}. {rule.title}
                      </h4>
                      <p className="text-slate-600 text-sm">{rule.description}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="mt-6 pt-6 border-t border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-3">Creator</h3>
              <div className="flex items-center gap-3">
                {community.creator?.avatar ? (
                  <img
                    src={community.creator.avatar}
                    alt={community.creator.fullName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold text-primary">
                      {community.creator?.fullName?.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-semibold text-slate-900">{community.creator?.fullName}</p>
                  <p className="text-sm text-slate-600">{community.creator?.email}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityDetail;
