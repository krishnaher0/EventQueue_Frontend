import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { blogAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user, isAuthenticated } = useAuth();

  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [likingPost, setLikingPost] = useState(false);

  useEffect(() => {
    fetchBlog();
  }, [slug]);

  const fetchBlog = async () => {
    setLoading(true);
    try {
      const response = await blogAPI.getBlog(slug);
      setBlog(response.data.blog);

      // Fetch related blogs (same category)
      if (response.data.blog.category) {
        const relatedResponse = await blogAPI.getBlogs({
          category: response.data.blog.category,
          limit: 3,
        });
        setRelatedBlogs(
          relatedResponse.data.blogs.filter(b => b.slug !== slug).slice(0, 3)
        );
      }
    } catch (error) {
      console.error('Fetch blog error:', error);
      toast.error('Failed to load blog');
      navigate('/blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to like this blog');
      navigate('/login');
      return;
    }

    setLikingPost(true);
    try {
      const response = await blogAPI.toggleLike(blog._id);
      setBlog(response.data.blog);
      toast.success(response.message || 'Success');
    } catch (error) {
      console.error('Like error:', error);
      toast.error(error.message || 'Failed to like blog');
    } finally {
      setLikingPost(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to comment');
      navigate('/login');
      return;
    }

    if (!commentContent.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    setSubmittingComment(true);
    try {
      const response = await blogAPI.addComment(blog._id, commentContent);
      // Update blog with new comments
      setBlog({ ...blog, comments: response.data.comments });
      setCommentContent('');
      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Comment error:', error);
      toast.error(error.message || 'Failed to add comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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

  if (!blog) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Blog not found</h2>
          <Link to="/blogs" className="text-primary hover:underline">
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  const isLiked = blog.likes?.some((like) => like._id === user?._id || like === user?._id);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section with Cover Image */}
      {blog.coverImage && (
        <div className="w-full h-96 bg-slate-900 overflow-hidden">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-full object-cover opacity-90"
          />
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          to="/blogs"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-primary mb-6 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Blogs
        </Link>

        {/* Article Header */}
        <article className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="mb-6">
            <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
              {blog.category}
            </span>
          </div>

          <h1 className="text-4xl font-bold text-slate-900 mb-4">{blog.title}</h1>

          {/* Author Info */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-6 mb-8">
            <div className="flex items-center gap-3">
              {blog.author?.avatar ? (
                <img
                  src={blog.author.avatar}
                  alt={blog.author.fullName}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary font-semibold text-lg">
                  {blog.author?.fullName?.charAt(0)}
                </div>
              )}
              <div>
                <p className="font-semibold text-slate-900">{blog.author?.fullName}</p>
                <p className="text-sm text-slate-500">
                  {formatDate(blog.publishedAt || blog.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-slate-600">
              <span className="flex items-center gap-1 text-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {blog.views} views
              </span>
              <span className="flex items-center gap-1 text-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                {blog.comments?.length || 0} comments
              </span>
            </div>
          </div>

          {/* Blog Content */}
          <div className="prose prose-slate max-w-none mb-8">
            <div className="text-lg text-slate-700 leading-relaxed whitespace-pre-wrap">
              {blog.content}
            </div>
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-6 border-t border-slate-200 mb-6">
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Like Button */}
          <div className="flex items-center gap-4 pt-6 border-t border-slate-200">
            <button
              onClick={handleLike}
              disabled={likingPost || !isAuthenticated}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                isLiked
                  ? 'bg-primary text-white hover:bg-primary-dark'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <svg
                className="w-5 h-5"
                fill={isLiked ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                />
              </svg>
              {isLiked ? 'Liked' : 'Like'} ({blog.likes?.length || 0})
            </button>
            {!isAuthenticated && (
              <p className="text-sm text-slate-500">Login to like and comment</p>
            )}
          </div>
        </article>

        {/* Comments Section */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Comments ({blog.comments?.length || 0})
          </h2>

          {/* Add Comment Form */}
          {isAuthenticated ? (
            <form onSubmit={handleCommentSubmit} className="mb-8">
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
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    rows="3"
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      type="submit"
                      disabled={submittingComment || !commentContent.trim()}
                      className="px-6 py-2 bg-blue-200 text-black rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submittingComment ? 'Posting...' : 'Post Comment'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="text-center py-8 bg-slate-50 rounded-lg mb-8">
              <p className="text-slate-600 mb-4">Please login to comment</p>
              <Link
                to="/login"
                className="inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                Login
              </Link>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-6">
            {blog.comments && blog.comments.length > 0 ? (
              blog.comments.map((comment) => (
                <div key={comment._id} className="flex gap-3">
                  {comment.user?.avatar ? (
                    <img
                      src={comment.user.avatar}
                      alt={comment.user.fullName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-semibold">
                      {comment.user?.fullName?.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="bg-slate-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-slate-900">
                          {comment.user?.fullName}
                        </span>
                        <span className="text-sm text-slate-500">
                          {formatTimeAgo(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-slate-700">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500">
                <svg
                  className="mx-auto h-12 w-12 text-slate-400 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
                <p>No comments yet. Be the first to comment!</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Blogs */}
        {relatedBlogs.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Related Blogs</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBlogs.map((relatedBlog) => (
                <Link
                  key={relatedBlog._id}
                  to={`/blogs/${relatedBlog.slug}`}
                  className="group"
                >
                  {relatedBlog.coverImage && (
                    <div className="aspect-video overflow-hidden rounded-lg mb-3">
                      <img
                        src={relatedBlog.coverImage}
                        alt={relatedBlog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-2 mb-2">
                    {relatedBlog.title}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-2">
                    {relatedBlog.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogDetail;
