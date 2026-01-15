import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { communityAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

const CreateCommunity = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Technology',
    privacy: 'public',
  });

  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [rules, setRules] = useState([{ title: '', description: '' }]);
  const [loading, setLoading] = useState(false);

  const categories = ['Technology', 'Gaming', 'Sports', 'Music', 'Art', 'Education', 'Business', 'Lifestyle', 'Other'];

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to create a community');
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
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

      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverImageChange = (e) => {
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

      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatar(null);
    setAvatarPreview(null);
  };

  const handleRemoveCoverImage = () => {
    setCoverImage(null);
    setCoverImagePreview(null);
  };

  const handleRuleChange = (index, field, value) => {
    const newRules = [...rules];
    newRules[index][field] = value;
    setRules(newRules);
  };

  const handleAddRule = () => {
    setRules([...rules, { title: '', description: '' }]);
  };

  const handleRemoveRule = (index) => {
    if (rules.length === 1) {
      toast.error('At least one rule is required');
      return;
    }
    const newRules = rules.filter((_, i) => i !== index);
    setRules(newRules);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Community name is required');
      return false;
    }
    if (formData.name.length < 3) {
      toast.error('Community name should be at least 3 characters');
      return false;
    }
    if (!formData.description.trim()) {
      toast.error('Description is required');
      return false;
    }
    if (formData.description.length < 20) {
      toast.error('Description should be at least 20 characters');
      return false;
    }

    // Validate rules
    const validRules = rules.filter(rule => rule.title.trim() || rule.description.trim());
    if (validRules.length > 0) {
      for (const rule of validRules) {
        if (!rule.title.trim() || !rule.description.trim()) {
          toast.error('All rule fields must be filled or removed');
          return false;
        }
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const submitData = new FormData();
      submitData.append('name', formData.name.trim());
      submitData.append('description', formData.description.trim());
      submitData.append('category', formData.category);
      submitData.append('privacy', formData.privacy);

      // Add avatar if selected
      if (avatar) {
        submitData.append('avatar', avatar);
      }

      // Add cover image if selected
      if (coverImage) {
        submitData.append('coverImage', coverImage);
      }

      // Add rules if they have content
      const validRules = rules.filter(rule => rule.title.trim() && rule.description.trim());
      if (validRules.length > 0) {
        submitData.append('rules', JSON.stringify(validRules));
      }

      const response = await communityAPI.createCommunity(submitData);

      toast.success('Community created successfully!');
      navigate(`/communities/${response.data.community.slug}`);
    } catch (error) {
      console.error('Create community error:', error);
      toast.error(error.message || 'Failed to create community');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Create Community</h1>
          <p className="text-slate-600 mt-2">Build a space for people to connect and share</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <form onSubmit={handleSubmit}>
            {/* Community Name */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Community Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter community name..."
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                maxLength={100}
              />
              <p className="text-sm text-slate-500 mt-1">
                {formData.name.length}/100 characters
              </p>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe what your community is about..."
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                rows="5"
                maxLength={500}
              />
              <p className="text-sm text-slate-500 mt-1">
                {formData.description.length}/500 characters (minimum 20)
              </p>
            </div>

            {/* Category and Privacy */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Privacy */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Privacy <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4 mt-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="privacy"
                      value="public"
                      checked={formData.privacy === 'public'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-primary focus:ring-primary"
                    />
                    <span className="text-slate-700">Public</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="privacy"
                      value="private"
                      checked={formData.privacy === 'private'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-primary focus:ring-primary"
                    />
                    <span className="text-slate-700">Private</span>
                  </label>
                </div>
                <p className="text-sm text-slate-500 mt-2">
                  {formData.privacy === 'public'
                    ? 'Anyone can join and see posts'
                    : 'Members must be approved to join'}
                </p>
              </div>
            </div>

            {/* Avatar */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Community Avatar
              </label>

              {avatarPreview ? (
                <div className="relative inline-block">
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="w-32 h-32 object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="w-32 h-32 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center hover:border-primary transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                    id="avatar"
                  />
                  <label htmlFor="avatar" className="cursor-pointer text-center p-4">
                    <svg
                      className="mx-auto h-8 w-8 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="mt-1 text-xs text-slate-500">Upload avatar</p>
                  </label>
                </div>
              )}
              <p className="text-sm text-slate-500 mt-2">
                Square image recommended. Max 5MB
              </p>
            </div>

            {/* Cover Image */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Cover Image
              </label>

              {coverImagePreview ? (
                <div className="relative">
                  <img
                    src={coverImagePreview}
                    alt="Cover preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveCoverImage}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageChange}
                    className="hidden"
                    id="coverImage"
                  />
                  <label htmlFor="coverImage" className="cursor-pointer">
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
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="mt-2 text-sm text-slate-600">
                      Click to upload cover image
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      PNG, JPG up to 5MB. Recommended 1920x400
                    </p>
                  </label>
                </div>
              )}
            </div>

            {/* Rules Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-slate-700">
                  Community Rules
                </label>
                <button
                  type="button"
                  onClick={handleAddRule}
                  className="text-sm text-primary hover:text-primary-dark flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Rule
                </button>
              </div>

              <div className="space-y-4">
                {rules.map((rule, index) => (
                  <div key={index} className="p-4 border border-slate-200 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-sm font-medium text-slate-700">
                        Rule {index + 1}
                      </span>
                      {rules.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveRule(index)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={rule.title}
                      onChange={(e) => handleRuleChange(index, 'title', e.target.value)}
                      placeholder="Rule title..."
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent mb-2"
                    />
                    <textarea
                      value={rule.description}
                      onChange={(e) => handleRuleChange(index, 'description', e.target.value)}
                      placeholder="Rule description..."
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      rows="2"
                    />
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-500 mt-2">
                Set guidelines for your community members to follow
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-slate-800 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? 'Creating Community...' : 'Create Community'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/communities')}
                disabled={loading}
                className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Community Building Tips
          </h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Choose a clear, descriptive name that reflects your community's purpose
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Write a detailed description to help people understand what your community is about
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Set clear rules to maintain a positive and respectful environment
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Add an attractive avatar and cover image to make your community stand out
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateCommunity;
