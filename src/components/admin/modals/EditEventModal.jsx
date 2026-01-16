import { useState } from 'react';

const EditEventModal = ({ event, onClose, onSave }) => {
  const [editingEvent, setEditingEvent] = useState({
    ...event,
    startDate: event.startDate ? new Date(event.startDate).toISOString().slice(0, 16) : '',
    endDate: event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : '',
    location: {
      venue: event.location?.venue || '',
      city: event.location?.city || '',
      address: event.location?.address || '',
      ...event.location
    },
    ticketTypes: event.ticketTypes || [],
    isFree: event.isFree || false,
    imageFile: null,
    imagePreview: null
  });

  const addTicketType = () => {
    setEditingEvent({
      ...editingEvent,
      ticketTypes: [
        ...editingEvent.ticketTypes,
        { name: '', price: 0, quantity: 0, description: '' }
      ]
    });
  };

  const updateTicketType = (index, field, value) => {
    const updatedTickets = [...editingEvent.ticketTypes];
    updatedTickets[index][field] = field === 'price' || field === 'quantity' ? Number(value) : value;
    setEditingEvent({ ...editingEvent, ticketTypes: updatedTickets });
  };

  const removeTicketType = (index) => {
    const updatedTickets = editingEvent.ticketTypes.filter((_, i) => i !== index);
    setEditingEvent({ ...editingEvent, ticketTypes: updatedTickets });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(editingEvent);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditingEvent({
        ...editingEvent,
        imageFile: file,
        imagePreview: URL.createObjectURL(file)
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white p-6 border-b border-slate-200 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Edit Event</h2>
            <p className="text-sm text-slate-500 mt-0.5">Update event details and image</p>
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

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Event Image</label>
            <div className="border-2 border-dashed border-slate-300 rounded-xl overflow-hidden">
              {editingEvent.image || editingEvent.imagePreview ? (
                <div className="relative">
                  <img
                    src={editingEvent.imagePreview || editingEvent.image}
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
                      onClick={() => setEditingEvent({ ...editingEvent, image: '', imagePreview: '', imageFile: null })}
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
                  <span className="text-slate-600 font-medium">Click to upload image</span>
                  <span className="text-slate-400 text-sm mt-1">PNG, JPG up to 5MB</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Event Title *</label>
            <input
              type="text"
              value={editingEvent.title || ''}
              onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
              placeholder="Enter event title"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Description *</label>
            <textarea
              value={editingEvent.description || ''}
              onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition resize-none"
              placeholder="Describe your event..."
              required
            />
          </div>

          {/* Date & Time Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Start Date & Time *</label>
              <input
                type="datetime-local"
                value={editingEvent.startDate || ''}
                onChange={(e) => setEditingEvent({ ...editingEvent, startDate: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">End Date & Time *</label>
              <input
                type="datetime-local"
                value={editingEvent.endDate || ''}
                onChange={(e) => setEditingEvent({ ...editingEvent, endDate: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                required
              />
            </div>
          </div>

          {/* Category & Status Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Category *</label>
              <select
                value={editingEvent.category || ''}
                onChange={(e) => setEditingEvent({ ...editingEvent, category: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition bg-white"
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
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Status *</label>
              <select
                value={editingEvent.status || ''}
                onChange={(e) => setEditingEvent({ ...editingEvent, status: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition bg-white"
                required
              >
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
                <option value="published">Published</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Location Section */}
          <div className="bg-slate-50 rounded-xl p-4 space-y-4">
            <h3 className="font-semibold text-slate-700 flex items-center gap-2">
              <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Location Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">Venue Name</label>
                <input
                  type="text"
                  value={editingEvent.location?.venue || ''}
                  onChange={(e) => setEditingEvent({
                    ...editingEvent,
                    location: { ...editingEvent.location, venue: e.target.value }
                  })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                  placeholder="e.g., Convention Center"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">City</label>
                <input
                  type="text"
                  value={editingEvent.location?.city || ''}
                  onChange={(e) => setEditingEvent({
                    ...editingEvent,
                    location: { ...editingEvent.location, city: e.target.value }
                  })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                  placeholder="e.g., Kathmandu"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Full Address</label>
              <input
                type="text"
                value={editingEvent.location?.address || ''}
                onChange={(e) => setEditingEvent({
                  ...editingEvent,
                  location: { ...editingEvent.location, address: e.target.value }
                })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                placeholder="Enter full address"
              />
            </div>
          </div>

          {/* Tickets & Pricing Section */}
          <div className="bg-slate-50 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
                Tickets & Pricing
              </h3>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={editingEvent.isFree}
                    onChange={(e) => setEditingEvent({ ...editingEvent, isFree: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <span className="text-slate-600 font-medium">Free Event</span>
                </label>
              </div>
            </div>

            {!editingEvent.isFree && (
              <div className="space-y-3">
                {editingEvent.ticketTypes.map((ticket, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-700">Ticket {index + 1}</span>
                      {editingEvent.ticketTypes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTicketType(index)}
                          className="text-red-500 hover:text-red-600 text-sm font-medium"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Name *</label>
                        <input
                          type="text"
                          value={ticket.name}
                          onChange={(e) => updateTicketType(index, 'name', e.target.value)}
                          placeholder="e.g., General, VIP"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                          required={!editingEvent.isFree}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Price (NPR) *</label>
                        <input
                          type="number"
                          value={ticket.price}
                          onChange={(e) => updateTicketType(index, 'price', e.target.value)}
                          min="0"
                          placeholder="0"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                          required={!editingEvent.isFree}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Quantity *</label>
                        <input
                          type="number"
                          value={ticket.quantity}
                          onChange={(e) => updateTicketType(index, 'quantity', e.target.value)}
                          min="1"
                          placeholder="100"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                          required={!editingEvent.isFree}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Description</label>
                      <input
                        type="text"
                        value={ticket.description || ''}
                        onChange={(e) => updateTicketType(index, 'description', e.target.value)}
                        placeholder="What's included with this ticket"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addTicketType}
                  className="w-full py-2.5 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-primary hover:text-primary transition font-medium text-sm flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Ticket Type
                </button>
              </div>
            )}

            {editingEvent.isFree && (
              <p className="text-sm text-slate-500 italic">This is a free event. No tickets required.</p>
            )}
          </div>

          {/* Featured Toggle */}
          <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-xl">
            <input
              type="checkbox"
              id="isFeatured"
              checked={editingEvent.isFeatured || false}
              onChange={(e) => setEditingEvent({ ...editingEvent, isFeatured: e.target.checked })}
              className="w-5 h-5 rounded border-slate-300 text-yellow-500 focus:ring-yellow-500"
            />
            <label htmlFor="isFeatured" className="flex-1">
              <span className="font-medium text-slate-700">Featured Event</span>
              <p className="text-sm text-slate-500">Featured events appear prominently on the homepage</p>
            </label>
            <span className="text-2xl">⭐</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-400 text-black rounded-xl hover:bg-primary/90 transition font-medium flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventModal;