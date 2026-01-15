import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { organizerAPI } from '../../services/api';

const RequestHost = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [existingRequest, setExistingRequest] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    organizationName: '',
    organizationType: 'individual',
    description: '',
    website: '',
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: '',
    },
    previousExperience: '',
    expectedEventsPerMonth: 1,
    eventCategories: [],
  });

  const organizationTypes = [
    { value: 'individual', label: 'Individual' },
    { value: 'company', label: 'Company' },
    { value: 'nonprofit', label: 'Non-Profit Organization' },
    { value: 'government', label: 'Government' },
    { value: 'educational', label: 'Educational Institution' },
  ];

  const eventCategoryOptions = [
    { value: 'music', label: 'Music & Entertainment' },
    { value: 'sports', label: 'Sports & Fitness' },
    { value: 'arts', label: 'Arts & Culture' },
    { value: 'food', label: 'Food & Drink' },
    { value: 'business', label: 'Business & Networking' },
    { value: 'technology', label: 'Technology' },
    { value: 'education', label: 'Education & Workshops' },
    { value: 'charity', label: 'Charity & Causes' },
    { value: 'other', label: 'Other' },
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user?.role === 'organizer' || user?.role === 'admin') {
      navigate('/');
      return;
    }

    fetchExistingRequest();
  }, [isAuthenticated, user, navigate]);

  const fetchExistingRequest = async () => {
    try {
      const response = await organizerAPI.getMyRequest();
      if (response.data) {
        setExistingRequest(response.data);
      }
    } catch (err) {
      console.error('Error fetching request:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('socialMedia.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socialMedia: { ...prev.socialMedia, [field]: value },
      }));
    } else if (name === 'expectedEventsPerMonth') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value, 10) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCategoryToggle = (category) => {
    setFormData(prev => ({
      ...prev,
      eventCategories: prev.eventCategories.includes(category)
        ? prev.eventCategories.filter(c => c !== category)
        : [...prev.eventCategories, category],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    if (formData.description.length < 50) {
      setError('Description must be at least 50 characters long');
      setSubmitting(false);
      return;
    }

    if (!formData.previousExperience.trim()) {
      setError('Please describe your previous event experience');
      setSubmitting(false);
      return;
    }

    try {
      await organizerAPI.submitRequest(formData);
      setSuccess(true);
      fetchExistingRequest();
    } catch (err) {
      setError(err.message || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show existing request status
  if (existingRequest) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="text-center">
              {existingRequest.status === 'pending' && (
                <>
                  <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">Request Pending</h2>
                  <p className="text-slate-600 mb-6">
                    Your organizer request is currently under review. We&apos;ll notify you once a decision has been made.
                  </p>
                </>
              )}

              {existingRequest.status === 'approved' && (
                <>
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">Request Approved!</h2>
                  <p className="text-slate-600 mb-6">
                    Congratulations! Your organizer request has been approved. You can now create and manage events.
                  </p>
                  <button
                    onClick={() => navigate('/organizer/dashboard')}
                    className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Go to Dashboard
                  </button>
                </>
              )}

              {existingRequest.status === 'rejected' && (
                <>
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">Request Rejected</h2>
                  <p className="text-slate-600 mb-4">
                    Unfortunately, your organizer request was not approved.
                  </p>
                  {existingRequest.adminNotes && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
                      <p className="text-sm font-medium text-red-800 mb-1">Reason:</p>
                      <p className="text-red-700">{existingRequest.adminNotes}</p>
                    </div>
                  )}
                  <p className="text-slate-500 text-sm">
                    You may submit a new request with updated information.
                  </p>
                </>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200">
              <h3 className="font-semibold text-slate-800 mb-4">Request Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Organization Name:</span>
                  <span className="text-slate-800 font-medium">{existingRequest.organizationName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Organization Type:</span>
                  <span className="text-slate-800 font-medium capitalize">{existingRequest.organizationType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Submitted:</span>
                  <span className="text-slate-800 font-medium">
                    {new Date(existingRequest.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show success message
  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Request Submitted!</h2>
            <p className="text-slate-600 mb-6">
              Your organizer request has been submitted successfully. We&apos;ll review your application and get back to you soon.
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-3">Become an Event Host</h1>
          <p className="text-slate-600 max-w-xl mx-auto">
            Start hosting amazing events on EventQueue. Fill out the form below to apply for an organizer account.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              {error}
            </div>
          )}

          {/* Organization Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Organization / Business Name *
            </label>
            <input
              type="text"
              name="organizationName"
              value={formData.organizationName}
              onChange={handleChange}
              required
              placeholder="Enter your organization name"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            />
          </div>

          {/* Organization Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Organization Type *
            </label>
            <select
              name="organizationType"
              value={formData.organizationType}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            >
              {organizationTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tell us about yourself and your events *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={5}
              placeholder="Describe your organization and the types of events you plan to host (minimum 50 characters)"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
            />
            <p className="mt-1 text-sm text-slate-500">
              {formData.description.length}/50 characters minimum
            </p>
          </div>

          {/* Event Categories */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-3">
              What types of events will you host?
            </label>
            <div className="flex flex-wrap gap-2">
              {eventCategoryOptions.map(cat => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => handleCategoryToggle(cat.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    formData.eventCategories.includes(cat.value)
                      ? 'bg-blue-200 text-black'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Previous Experience */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Previous Event Experience *
            </label>
            <textarea
              name="previousExperience"
              value={formData.previousExperience}
              onChange={handleChange}
              required
              rows={3}
              placeholder="Tell us about any previous events you've organized"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
            />
          </div>

          {/* Expected Events Per Month */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Expected Events Per Month *
            </label>
            <select
              name="expectedEventsPerMonth"
              value={formData.expectedEventsPerMonth}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            >
              <option value={1}>1 event</option>
              <option value={2}>2 events</option>
              <option value={3}>3 events</option>
              <option value={4}>4 events</option>
              <option value={5}>5+ events</option>
            </select>
          </div>

          {/* Website */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Website
            </label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://yourwebsite.com"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            />
          </div>

          {/* Social Media */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Social Media Links
            </label>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <input
                  type="url"
                  name="socialMedia.facebook"
                  value={formData.socialMedia.facebook}
                  onChange={handleChange}
                  placeholder="Facebook URL"
                  className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <input
                  type="url"
                  name="socialMedia.instagram"
                  value={formData.socialMedia.instagram}
                  onChange={handleChange}
                  placeholder="Instagram URL"
                  className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-sky-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </div>
                <input
                  type="url"
                  name="socialMedia.twitter"
                  value={formData.socialMedia.twitter}
                  onChange={handleChange}
                  placeholder="Twitter/X URL"
                  className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-400 text-black py-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Submitting...
              </span>
            ) : (
              'Submit Application'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestHost;
