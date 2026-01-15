import { useState } from 'react';

const CreateEventModal = ({ onClose, onSave }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const [eventData, setEventData] = useState({
    // Basic Information
    title: '',
    category: '',
    shortDescription: '',
    description: '',
    image: '',
    imageFile: null,
    imagePreview: null,

    // Date & Location
    startDate: '',
    endDate: '',
    venueType: 'physical',
    venueName: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
    },
    onlineLink: '',

    // Tickets & Pricing
    ticketTypes: [],
    isFree: false,
    totalCapacity: 0,

    // Additional Details
    ageRestriction: 'all',
    refundPolicy: '',
    termsAndConditions: '',
    contactEmail: '',
    contactPhone: '',

    // Status
    status: 'draft',
    isFeatured: false,
  });

  const steps = [
    { number: 1, label: 'Basic Info', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { number: 2, label: 'Date & Location', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' },
    { number: 3, label: 'Tickets', icon: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z' },
    { number: 4, label: 'Additional', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { number: 5, label: 'Preview', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' },
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEventData({
        ...eventData,
        imageFile: file,
        imagePreview: URL.createObjectURL(file)
      });
    }
  };

  const addTicketType = () => {
    setEventData({
      ...eventData,
      ticketTypes: [
        ...eventData.ticketTypes,
        { name: '', price: 0, quantity: 0, description: '' }
      ]
    });
  };

  const updateTicketType = (index, field, value) => {
    const updatedTickets = [...eventData.ticketTypes];
    updatedTickets[index][field] = value;
    setEventData({ ...eventData, ticketTypes: updatedTickets });
  };

  const removeTicketType = (index) => {
    const updatedTickets = eventData.ticketTypes.filter((_, i) => i !== index);
    setEventData({ ...eventData, ticketTypes: updatedTickets });
  };

  const calculateTotalCapacity = () => {
    return eventData.ticketTypes.reduce((sum, ticket) => sum + (parseInt(ticket.quantity) || 0), 0);
  };

  const calculatePotentialRevenue = () => {
    return eventData.ticketTypes.reduce((sum, ticket) =>
      sum + ((parseFloat(ticket.price) || 0) * (parseInt(ticket.quantity) || 0)), 0
    );
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    await onSave({
      ...eventData,
      location: {
        venue: eventData.venueName,
        city: eventData.address.city,
        address: eventData.address.street,
      }
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-800">Basic Information</h3>

            {/* Event Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Event Name *
              </label>
              <input
                type="text"
                value={eventData.title}
                onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                placeholder="e.g., Tech Summit Nepal 2026"
                required
              />
            </div>

            {/* Event Category */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Event Category *
              </label>
              <select
                value={eventData.category}
                onChange={(e) => setEventData({ ...eventData, category: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white"
                required
              >
                <option value="">Select Category</option>
                <option value="Music">Music</option>
                <option value="Sports">Sports</option>
                <option value="Arts">Arts</option>
                <option value="Technology">Technology</option>
                <option value="Food & Drink">Food & Drink</option>
                <option value="Business">Business</option>
                <option value="Health">Health</option>
                <option value="Education">Education</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Short Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Short Description
              </label>
              <input
                type="text"
                value={eventData.shortDescription}
                onChange={(e) => setEventData({ ...eventData, shortDescription: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                placeholder="A brief one-line description of your event"
                maxLength="200"
              />
              <p className="text-xs text-slate-500 mt-1">{eventData.shortDescription.length}/200 characters</p>
            </div>

            {/* Event Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Event Description *
              </label>
              <textarea
                value={eventData.description}
                onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                rows={6}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                placeholder="Provide a detailed description of your event, including what attendees can expect, schedule, speakers, activities, etc."
                required
              />
            </div>

            {/* Event Banner Image */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Event Banner Image
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg overflow-hidden">
                {eventData.imagePreview || eventData.image ? (
                  <div className="relative">
                    <img
                      src={eventData.imagePreview || eventData.image}
                      alt="Event preview"
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition flex items-center justify-center gap-3">
                      <label className="px-4 py-2 bg-white text-slate-700 rounded-lg cursor-pointer hover:bg-slate-100 transition font-medium text-sm">
                        Change Image
                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                      </label>
                      <button
                        type="button"
                        onClick={() => setEventData({ ...eventData, image: '', imagePreview: '', imageFile: null })}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center py-12 cursor-pointer hover:bg-slate-50 transition">
                    <svg className="w-12 h-12 text-slate-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-slate-600 font-medium">Click to upload banner</span>
                    <span className="text-slate-400 text-sm mt-1">PNG, JPG up to 5MB</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-800">Date & Location</h3>

            {/* Event Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Event Start Date & Time *
                </label>
                <input
                  type="datetime-local"
                  value={eventData.startDate}
                  onChange={(e) => setEventData({ ...eventData, startDate: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Event End Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={eventData.endDate}
                  onChange={(e) => setEventData({ ...eventData, endDate: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>
            </div>

            {/* Venue Type */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Venue Type *
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'physical', label: 'Physical Venue', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
                  { value: 'online', label: 'Online Event', icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9' },
                  { value: 'hybrid', label: 'Hybrid', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
                ].map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setEventData({ ...eventData, venueType: type.value })}
                    className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition ${
                      eventData.venueType === type.value
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-slate-300 hover:border-slate-400 text-slate-600'
                    }`}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={type.icon} />
                    </svg>
                    <span className="text-sm font-medium">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Physical Venue Details */}
            {(eventData.venueType === 'physical' || eventData.venueType === 'hybrid') && (
              <div className="space-y-4 p-4 bg-slate-50 rounded-lg">
                <h4 className="font-medium text-slate-700">Venue Details</h4>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Venue Name
                  </label>
                  <input
                    type="text"
                    value={eventData.venueName}
                    onChange={(e) => setEventData({ ...eventData, venueName: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    placeholder="e.g., Hotel Yak & Yeti"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={eventData.address.street}
                    onChange={(e) => setEventData({
                      ...eventData,
                      address: { ...eventData.address, street: e.target.value }
                    })}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    placeholder="Street address"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={eventData.address.city}
                      onChange={(e) => setEventData({
                        ...eventData,
                        address: { ...eventData.address, city: e.target.value }
                      })}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      State/Province
                    </label>
                    <input
                      type="text"
                      value={eventData.address.state}
                      onChange={(e) => setEventData({
                        ...eventData,
                        address: { ...eventData.address, state: e.target.value }
                      })}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                      placeholder="State"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      value={eventData.address.country}
                      onChange={(e) => setEventData({
                        ...eventData,
                        address: { ...eventData.address, country: e.target.value }
                      })}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                      placeholder="Country"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Zip Code
                    </label>
                    <input
                      type="text"
                      value={eventData.address.zipCode}
                      onChange={(e) => setEventData({
                        ...eventData,
                        address: { ...eventData.address, zipCode: e.target.value }
                      })}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                      placeholder="Zip code"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Online Event Details */}
            {(eventData.venueType === 'online' || eventData.venueType === 'hybrid') && (
              <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-slate-700">Online Event Details</h4>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Meeting/Stream Link
                  </label>
                  <input
                    type="url"
                    value={eventData.onlineLink}
                    onChange={(e) => setEventData({ ...eventData, onlineLink: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    placeholder="https://zoom.us/j/..."
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Provide access link close to event date. This will be shared with attendees.
                  </p>
                </div>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">Tickets & Pricing</h3>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={eventData.isFree}
                  onChange={(e) => setEventData({ ...eventData, isFree: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium text-slate-700">Free Event</span>
              </label>
            </div>

            {!eventData.isFree && (
              <>
                {/* Ticket Types */}
                <div className="space-y-4">
                  {eventData.ticketTypes.map((ticket, index) => (
                    <div key={index} className="p-4 border border-slate-300 rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-slate-700">Ticket Type {index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removeTicketType(index)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">
                            Ticket Name *
                          </label>
                          <input
                            type="text"
                            value={ticket.name}
                            onChange={(e) => updateTicketType(index, 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                            placeholder="e.g., General, VIP"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">
                            Price (NPR) *
                          </label>
                          <input
                            type="number"
                            value={ticket.price}
                            onChange={(e) => updateTicketType(index, 'price', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                            placeholder="0"
                            min="0"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">
                            Quantity *
                          </label>
                          <input
                            type="number"
                            value={ticket.quantity}
                            onChange={(e) => updateTicketType(index, 'quantity', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                            placeholder="0"
                            min="1"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          Description
                        </label>
                        <input
                          type="text"
                          value={ticket.description}
                          onChange={(e) => updateTicketType(index, 'description', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                          placeholder="What's included in this ticket?"
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addTicketType}
                    className="w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-primary hover:text-primary hover:bg-primary/5 transition font-medium"
                  >
                    + Add Ticket Type
                  </button>
                </div>

                {/* Ticket Summary */}
                {eventData.ticketTypes.length > 0 && (
                  <div className="p-4 bg-gradient-to-br from-primary/5 to-blue-50 rounded-lg border border-primary/20">
                    <h4 className="font-semibold text-slate-800 mb-3">Ticket Summary</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-slate-600 mb-1">Total Capacity</p>
                        <p className="text-2xl font-bold text-primary">{calculateTotalCapacity()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 mb-1">Potential Revenue</p>
                        <p className="text-2xl font-bold text-green-600">NPR {calculatePotentialRevenue().toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-800">Additional Details</h3>

            {/* Age Restriction */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Age Restriction
              </label>
              <select
                value={eventData.ageRestriction}
                onChange={(e) => setEventData({ ...eventData, ageRestriction: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white"
              >
                <option value="all">All Ages</option>
                <option value="18+">18+</option>
                <option value="21+">21+</option>
                <option value="kids">Kids Only</option>
              </select>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={eventData.contactEmail}
                  onChange={(e) => setEventData({ ...eventData, contactEmail: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  placeholder="contact@event.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={eventData.contactPhone}
                  onChange={(e) => setEventData({ ...eventData, contactPhone: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  placeholder="+977 9800000000"
                />
              </div>
            </div>

            {/* Refund Policy */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Refund Policy
              </label>
              <textarea
                value={eventData.refundPolicy}
                onChange={(e) => setEventData({ ...eventData, refundPolicy: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                placeholder="Describe your refund policy..."
              />
            </div>

            {/* Terms and Conditions */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Terms and Conditions
              </label>
              <textarea
                value={eventData.termsAndConditions}
                onChange={(e) => setEventData({ ...eventData, termsAndConditions: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                placeholder="List any terms and conditions for attendees..."
              />
            </div>

            {/* Featured Event Toggle */}
            <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <input
                type="checkbox"
                id="isFeatured"
                checked={eventData.isFeatured}
                onChange={(e) => setEventData({ ...eventData, isFeatured: e.target.checked })}
                className="w-5 h-5 rounded border-slate-300 text-yellow-500 focus:ring-yellow-500"
              />
              <label htmlFor="isFeatured" className="flex-1">
                <span className="font-medium text-slate-700">Mark as Featured Event</span>
                <p className="text-sm text-slate-500">Featured events appear prominently on the homepage</p>
              </label>
              <span className="text-2xl">⭐</span>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-800">Preview Event</h3>

            {/* Event Preview Card */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              {/* Image */}
              {(eventData.imagePreview || eventData.image) && (
                <img
                  src={eventData.imagePreview || eventData.image}
                  alt={eventData.title}
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="p-6 space-y-4">
                {/* Category Badge */}
                {eventData.category && (
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                    {eventData.category}
                  </span>
                )}

                {/* Title */}
                <h2 className="text-2xl font-bold text-slate-800">{eventData.title || 'Event Title'}</h2>

                {/* Short Description */}
                {eventData.shortDescription && (
                  <p className="text-slate-600">{eventData.shortDescription}</p>
                )}

                {/* Date & Location */}
                <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                  {eventData.startDate && (
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{new Date(eventData.startDate).toLocaleString()}</span>
                    </div>
                  )}
                  {(eventData.venueName || eventData.address.city) && (
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      <span>{eventData.venueName || eventData.address.city}</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                {eventData.description && (
                  <div className="pt-4 border-t border-slate-200">
                    <h4 className="font-semibold text-slate-800 mb-2">About This Event</h4>
                    <p className="text-slate-600 whitespace-pre-wrap">{eventData.description}</p>
                  </div>
                )}

                {/* Tickets */}
                {!eventData.isFree && eventData.ticketTypes.length > 0 && (
                  <div className="pt-4 border-t border-slate-200">
                    <h4 className="font-semibold text-slate-800 mb-3">Tickets</h4>
                    <div className="space-y-2">
                      {eventData.ticketTypes.map((ticket, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div>
                            <p className="font-medium text-slate-800">{ticket.name}</p>
                            {ticket.description && (
                              <p className="text-sm text-slate-500">{ticket.description}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-primary">NPR {ticket.price}</p>
                            <p className="text-xs text-slate-500">{ticket.quantity} available</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {eventData.isFree && (
                  <div className="pt-4 border-t border-slate-200">
                    <span className="inline-block px-4 py-2 bg-green-100 text-green-700 font-semibold rounded-lg">
                      FREE EVENT
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Confirmation Message */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-slate-700">
                Please review all the information carefully. Once you create the event, it will be saved as a draft and can be edited later.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Create New Event</h2>
            <p className="text-sm text-slate-500 mt-1">Fill in the details to create your event</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Stepper */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition ${
                      currentStep === step.number
                        ? 'bg-primary text-white'
                        : currentStep > step.number
                        ? 'bg-green-500 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {currentStep > step.number ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      step.number
                    )}
                  </div>
                  <span className={`text-xs mt-2 font-medium hidden md:block ${
                    currentStep === step.number ? 'text-primary' : 'text-slate-500'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 md:w-20 h-0.5 mx-2 ${
                    currentStep > step.number ? 'bg-green-500' : 'bg-slate-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 flex items-center justify-between bg-slate-50">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-white transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="text-sm text-slate-500">
            Step {currentStep} of {totalSteps}
          </div>

          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-medium flex items-center gap-2"
            >
              Next
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Create Event
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateEventModal;
