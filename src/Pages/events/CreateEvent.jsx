import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { eventsAPI } from "../../services/api";

// ...existing code...

const CreateEvent = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    title: '',
    category: '',
    shortDescription: '',
    description: '',
    tags: '',
    image: null,

    // Step 2: Date & Time
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',

    // Step 3: Location
    venueType: 'physical',
    venueName: '',
    street: '',
    city: '',
    state: '',
    country: 'Nepal',
    zipCode: '',
    onlineLink: '',

    // Step 4: Tickets
    isFree: false,
    ticketTypes: [{ name: 'General', price: 0, quantity: 100, description: '' }],
    totalCapacity: 100,
    ageRestriction: 'all',
    refundPolicy: '',
    termsAndConditions: '',
    contactEmail: '',
    contactPhone: '',
  });

  const categories = [
    'Business Seminar',
    'Social & Networking',
    'Sports & Fitness',
    'Food & Drink',
    'Workshops',
    'Music & Entertainment',
    'Arts & Culture',
    'Technology',
    'Health & Wellness',
    'Education',
    'Charity',
    'Other',
  ];

  const steps = [
    { number: 1, title: 'Basic Info', description: 'Event details' },
    { number: 2, title: 'Date & Time', description: 'Schedule' },
    { number: 3, title: 'Location', description: 'Venue details' },
    { number: 4, title: 'Tickets', description: 'Pricing' },
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user?.role !== 'organizer' && user?.role !== 'admin') {
      navigate('/request-host');
      return;
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTicketChange = (index, field, value) => {
    const newTickets = [...formData.ticketTypes];
    newTickets[index][field] = field === 'price' || field === 'quantity' ? Number(value) : value;
    setFormData(prev => ({ ...prev, ticketTypes: newTickets }));
  };

  const addTicketType = () => {
    setFormData(prev => ({
      ...prev,
      ticketTypes: [...prev.ticketTypes, { name: '', price: 0, quantity: 50, description: '' }],
    }));
  };

  const removeTicketType = (index) => {
    if (formData.ticketTypes.length > 1) {
      setFormData(prev => ({
        ...prev,
        ticketTypes: prev.ticketTypes.filter((_, i) => i !== index),
      }));
    }
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!formData.title || !formData.category || !formData.description) {
          setError('Please fill in all required fields');
          return false;
        }
        if (formData.title.length < 3) {
          setError('Event title must be at least 3 characters');
          return false;
        }
        if (formData.description.length < 10) {
          setError('Event description must be at least 10 characters');
          return false;
        }
        break;
      case 2:
        if (!formData.startDate || !formData.startTime) {
          setError('Please set the event start date and time');
          return false;
        }
        break;
      case 3:
        if (formData.venueType === 'physical' && !formData.venueName) {
          setError('Please enter the venue name');
          return false;
        }
        if (formData.venueType === 'online' && !formData.onlineLink) {
          setError('Please enter the online meeting link');
          return false;
        }
        break;
      case 4:
        if (!formData.isFree && formData.ticketTypes.some(t => !t.name || t.price < 0)) {
          setError('Please fill in all ticket details');
          return false;
        }
        break;
      default:
        break;
    }
    setError('');
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e, status = 'pending') => {
    e.preventDefault();
    if (!validateStep(4)) return;

    setLoading(true);
    setError('');

    try {
      const submitData = new FormData();

      // Basic info
      submitData.append('title', formData.title);
      submitData.append('category', formData.category);
      submitData.append('shortDescription', formData.shortDescription);
      submitData.append('description', formData.description);
      submitData.append('tags', formData.tags);
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      // Date & Time
      submitData.append('startDate', formData.startDate);
      submitData.append('endDate', formData.endDate || formData.startDate);
      submitData.append('startTime', formData.startTime);
      submitData.append('endTime', formData.endTime || formData.startTime);

      // Location
      submitData.append('venueType', formData.venueType);
      submitData.append('venueName', formData.venueName);
      submitData.append('address[street]', formData.street);
      submitData.append('address[city]', formData.city);
      submitData.append('address[state]', formData.state);
      submitData.append('address[country]', formData.country);
      submitData.append('address[zipCode]', formData.zipCode);
      submitData.append('onlineLink', formData.onlineLink);

      // Tickets
      submitData.append('isFree', formData.isFree);
      submitData.append('ticketTypes', JSON.stringify(formData.ticketTypes));
      submitData.append('totalCapacity', formData.totalCapacity);
      submitData.append('ageRestriction', formData.ageRestriction);
      submitData.append('refundPolicy', formData.refundPolicy);
      submitData.append('termsAndConditions', formData.termsAndConditions);
      submitData.append('contactEmail', formData.contactEmail);
      submitData.append('contactPhone', formData.contactPhone);

      // Admin can directly publish, organizers need approval
      if (user?.role === 'admin' && status !== 'draft') {
        submitData.append('status', 'published');
        submitData.append('isApproved', 'true');
      } else {
        submitData.append('status', status);
      }

      await eventsAPI.create(submitData);

      if (user?.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/organizer/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Create New Event</h1>
          <p className="text-slate-600">Fill in the details to create your event</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                      currentStep >= step.number
                        ? 'bg-primary text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {currentStep > step.number ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      step.number
                    )}
                  </div>
                  <div className="text-center mt-2 hidden sm:block">
                    <p className="text-sm font-medium text-slate-800">{step.title}</p>
                    <p className="text-xs text-slate-500">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-full h-1 mx-2 rounded ${
                      currentStep > step.number ? 'bg-primary' : 'bg-slate-200'
                    }`}
                    style={{ width: '80px' }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={(e) => handleSubmit(e, 'pending')} className="bg-white rounded-2xl shadow-sm p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              {error}
            </div>
          )}

          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Basic Information</h2>

              {/* Event Image */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Event Image</label>
                <div className="flex items-center gap-4">
                  <div className="w-32 h-32 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="event-image"
                    />
                    <label
                      htmlFor="event-image"
                      className="inline-block px-4 py-2 bg-slate-100 text-slate-700 rounded-lg cursor-pointer hover:bg-slate-200 transition-colors"
                    >
                      Choose Image
                    </label>
                    <p className="text-sm text-slate-500 mt-1">Recommended: 1200x600px, max 5MB</p>
                  </div>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Event Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Enter event title"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Short Description</label>
                <input
                  type="text"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  maxLength={200}
                  placeholder="Brief summary of your event"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
                <p className="text-sm text-slate-500 mt-1">{formData.shortDescription.length}/200 characters</p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Detailed description of your event"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Tags</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="Enter tags separated by commas"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
                <p className="text-sm text-slate-500 mt-1">e.g., networking, tech, startup</p>
              </div>
            </div>
          )}

          {/* Step 2: Date & Time */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Date & Time</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Start Date *</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>

                {/* Start Time */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Start Time *</label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>

                {/* End Time */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">End Time</label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Location */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Location</h2>

              {/* Venue Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Venue Type *</label>
                <div className="flex gap-4">
                  {['physical', 'online', 'hybrid'].map(type => (
                    <label
                      key={type}
                      className={`flex-1 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        formData.venueType === type
                          ? 'border-primary bg-primary/5'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="venueType"
                        value={type}
                        checked={formData.venueType === type}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="text-center">
                        <svg className={`w-8 h-8 mx-auto mb-2 ${formData.venueType === type ? 'text-primary' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {type === 'physical' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />}
                          {type === 'online' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />}
                          {type === 'hybrid' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />}
                        </svg>
                        <span className={`font-medium capitalize ${formData.venueType === type ? 'text-primary' : 'text-slate-600'}`}>{type}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Physical Venue Fields */}
              {(formData.venueType === 'physical' || formData.venueType === 'hybrid') && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Venue Name *</label>
                    <input
                      type="text"
                      name="venueName"
                      value={formData.venueName}
                      onChange={handleChange}
                      placeholder="e.g., Convention Center"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Street Address</label>
                      <input
                        type="text"
                        name="street"
                        value={formData.street}
                        onChange={handleChange}
                        placeholder="Street address"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="City"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">State/Province</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="State"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Zip Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        placeholder="Zip code"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Online Event Field */}
              {(formData.venueType === 'online' || formData.venueType === 'hybrid') && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Meeting Link *</label>
                  <input
                    type="url"
                    name="onlineLink"
                    value={formData.onlineLink}
                    onChange={handleChange}
                    placeholder="https://zoom.us/j/..."
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>
              )}
            </div>
          )}

          {/* Step 4: Tickets */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Tickets & Pricing</h2>

              {/* Free Event Toggle */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="isFree"
                  id="isFree"
                  checked={formData.isFree}
                  onChange={handleChange}
                  className="w-5 h-5 text-primary border-slate-300 rounded focus:ring-primary"
                />
                <label htmlFor="isFree" className="text-sm font-medium text-slate-700">This is a free event</label>
              </div>

              {/* Ticket Types */}
              {!formData.isFree && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-700">Ticket Types</label>
                    <button
                      type="button"
                      onClick={addTicketType}
                      className="text-primary text-sm font-medium hover:underline flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      Add Ticket Type
                    </button>
                  </div>

                  {formData.ticketTypes.map((ticket, index) => (
                    <div key={index} className="p-4 bg-slate-50 rounded-lg space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-700">Ticket {index + 1}</span>
                        {formData.ticketTypes.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeTicketType(index)}
                            className="text-red-500 hover:text-red-600 text-sm"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm text-slate-600 mb-1">Name *</label>
                          <input
                            type="text"
                            value={ticket.name}
                            onChange={(e) => handleTicketChange(index, 'name', e.target.value)}
                            placeholder="e.g., General, VIP"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-slate-600 mb-1">Price (NPR) *</label>
                          <input
                            type="number"
                            value={ticket.price}
                            onChange={(e) => handleTicketChange(index, 'price', e.target.value)}
                            min="0"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-slate-600 mb-1">Quantity *</label>
                          <input
                            type="number"
                            value={ticket.quantity}
                            onChange={(e) => handleTicketChange(index, 'quantity', e.target.value)}
                            min="1"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-slate-600 mb-1">Description</label>
                        <input
                          type="text"
                          value={ticket.description}
                          onChange={(e) => handleTicketChange(index, 'description', e.target.value)}
                          placeholder="What's included with this ticket"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Total Capacity */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Total Capacity</label>
                <input
                  type="number"
                  name="totalCapacity"
                  value={formData.totalCapacity}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>

              {/* Age Restriction */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Age Restriction</label>
                <select
                  name="ageRestriction"
                  value={formData.ageRestriction}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                >
                  <option value="all">All Ages</option>
                  <option value="18+">18+ Only</option>
                  <option value="21+">21+ Only</option>
                  <option value="kids">Kids Only</option>
                </select>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Contact Email</label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    placeholder="contact@example.com"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Contact Phone</label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    placeholder="+977 98XXXXXXXX"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200 bg-blue-600">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-2.5 border border-slate-300 rounded-lg font-medium bg-blue-600 text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Previous
              </button>
            ) : (
              <div />
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2.5 bg-blue-400 text-black rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Next
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, 'draft')}
                  disabled={loading}
                  className="px-6 py-2.5 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  Save as Draft
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Creating...
                    </span>
                  ) : user?.role === 'admin' ? (
                    'Publish Event'
                  ) : (
                    'Submit for Approval'
                  )}
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
