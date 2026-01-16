import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { eventsAPI } from '../../services/api';
import EventCard from '../../components/admin/cards/EventCard';
import EditEventModal from '../../components/admin/modals/EditEventModal';
import CreateEventModal from '../../components/admin/modals/CreateEventModal';

const OrganizerEvents = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState(null);
  const [creating, setCreating] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user?.role !== 'organizer' && user?.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchEvents();
  }, [isAuthenticated, user, navigate]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await eventsAPI.getMyEvents();
      setEvents(res.data?.events || res.data || []);
    } catch (err) {
      console.error('Error fetching events:', err);
      toast.error('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const extractDateOnly = (datetime) => {
    if (!datetime) return '';
    return datetime.split('T')[0];
  };

  const extractTimeOnly = (datetime) => {
    if (!datetime) return '';
    const parts = datetime.split('T');
    return parts[1] ? parts[1].substring(0, 5) : '';
  };

  const handleEdit = async (event) => {
    try {
      const res = await eventsAPI.getById(event._id);
      const evt = res.data ? res.data.event : res.event;

      // Combine date and time for datetime-local input
      const combineDateAndTime = (date, time) => {
        if (!date) return '';
        const dateStr = new Date(date).toISOString().split('T')[0];
        const timeStr = time || '00:00';
        return `${dateStr}T${timeStr}`;
      };

      setEditingEvent({
        ...evt,
        startDate: combineDateAndTime(evt.startDate, evt.startTime),
        endDate: combineDateAndTime(evt.endDate, evt.endTime),
        location: {
          venue: evt.venueName || evt.location?.venue || '',
          city: evt.address?.city || evt.location?.city || '',
          address: evt.address?.street || evt.location?.address || '',
        },
        address: evt.address || {},
        venueName: evt.venueName || '',
        ticketTypes: evt.ticketTypes || [],
        isFree: evt.isFree || false,
        imageFile: null,
        imagePreview: null,
      });
      setCreating(false);
    } catch (err) {
      console.error('Failed to fetch event details:', err);
      toast.error('Failed to fetch event details');
    }
  };

  const handleCreate = () => {
    setCreating(true);
    setEditingEvent(null);
  };

  const handleSaveEdit = async (updatedEvent) => {
    try {
      const formData = new FormData();
      formData.append('title', updatedEvent.title);
      formData.append('description', updatedEvent.description);

      // Handle date and time properly
      const startDateOnly = extractDateOnly(updatedEvent.startDate);
      const startTimeOnly = extractTimeOnly(updatedEvent.startDate);
      const endDateOnly = extractDateOnly(updatedEvent.endDate);
      const endTimeOnly = extractTimeOnly(updatedEvent.endDate);

      formData.append('startDate', startDateOnly);
      formData.append('endDate', endDateOnly || startDateOnly);
      formData.append('startTime', startTimeOnly);
      formData.append('endTime', endTimeOnly || startTimeOnly);

      formData.append('category', updatedEvent.category);
      formData.append('status', updatedEvent.status);
      formData.append('isFeatured', updatedEvent.isFeatured || false);
      formData.append('isFree', updatedEvent.isFree || false);

      // Location fields
      formData.append('venueName', updatedEvent.location?.venue || updatedEvent.venueName || '');
      formData.append('address[street]', updatedEvent.location?.address || updatedEvent.address?.street || '');
      formData.append('address[city]', updatedEvent.location?.city || updatedEvent.address?.city || '');
      formData.append('address[state]', updatedEvent.address?.state || '');
      formData.append('address[country]', updatedEvent.address?.country || 'Nepal');
      formData.append('address[zipCode]', updatedEvent.address?.zipCode || '');

      if (updatedEvent.ticketTypes) {
        formData.append('ticketTypes', JSON.stringify(updatedEvent.ticketTypes));
      }
      if (updatedEvent.imageFile) formData.append('image', updatedEvent.imageFile);

      await eventsAPI.update(updatedEvent._id, formData);
      toast.success('Event updated successfully');
      setEditingEvent(null);
      fetchEvents();
    } catch (err) {
      console.error('Error updating event:', err);
      toast.error('Failed to update event');
    }
  };

  const handleSaveCreate = async (newEvent) => {
    try {
      const formData = new FormData();

      // Basic Information
      formData.append('title', newEvent.title);
      formData.append('description', newEvent.description);
      formData.append('category', newEvent.category);
      formData.append('status', newEvent.status || 'pending');
      formData.append('isFeatured', newEvent.isFeatured || false);

      if (newEvent.shortDescription) {
        formData.append('shortDescription', newEvent.shortDescription);
      }

      // Date & Time - extract date and time separately
      if (newEvent.startDate) {
        const startDateOnly = extractDateOnly(newEvent.startDate);
        const startTimeOnly = extractTimeOnly(newEvent.startDate);
        formData.append('startDate', startDateOnly);
        formData.append('startTime', startTimeOnly);
      }
      if (newEvent.endDate) {
        const endDateOnly = extractDateOnly(newEvent.endDate);
        const endTimeOnly = extractTimeOnly(newEvent.endDate);
        formData.append('endDate', endDateOnly);
        formData.append('endTime', endTimeOnly);
      }

      // Location
      formData.append('venueType', newEvent.venueType || 'physical');
      if (newEvent.venueName) {
        formData.append('venueName', newEvent.venueName);
      }
      if (newEvent.onlineLink) {
        formData.append('onlineLink', newEvent.onlineLink);
      }

      // Address
      if (newEvent.address) {
        if (newEvent.address.street) formData.append('address[street]', newEvent.address.street);
        if (newEvent.address.city) formData.append('address[city]', newEvent.address.city);
        if (newEvent.address.state) formData.append('address[state]', newEvent.address.state);
        if (newEvent.address.country) formData.append('address[country]', newEvent.address.country);
        if (newEvent.address.zipCode) formData.append('address[zipCode]', newEvent.address.zipCode);
      }

      // For backward compatibility with location field
      formData.append('location[venue]', newEvent.venueName || newEvent.location?.venue || '');
      formData.append('location[city]', newEvent.address?.city || newEvent.location?.city || '');
      formData.append('location[address]', newEvent.address?.street || newEvent.location?.address || '');

      // Tickets & Pricing
      formData.append('isFree', newEvent.isFree || false);
      if (newEvent.ticketTypes && newEvent.ticketTypes.length > 0) {
        formData.append('ticketTypes', JSON.stringify(newEvent.ticketTypes));
      }
      if (newEvent.totalCapacity) {
        formData.append('totalCapacity', newEvent.totalCapacity);
      }

      // Additional Details
      if (newEvent.ageRestriction) {
        formData.append('ageRestriction', newEvent.ageRestriction);
      }
      if (newEvent.refundPolicy) {
        formData.append('refundPolicy', newEvent.refundPolicy);
      }
      if (newEvent.termsAndConditions) {
        formData.append('termsAndConditions', newEvent.termsAndConditions);
      }
      if (newEvent.contactEmail) {
        formData.append('contactEmail', newEvent.contactEmail);
      }
      if (newEvent.contactPhone) {
        formData.append('contactPhone', newEvent.contactPhone);
      }

      // Image
      if (newEvent.imageFile) {
        formData.append('image', newEvent.imageFile);
      }

      await eventsAPI.create(formData);
      toast.success('Event created successfully');
      setCreating(false);
      fetchEvents();
    } catch (err) {
      console.error('Error creating event:', err);
      const errorMessage = err.response?.data?.message || 'Failed to create event';
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await eventsAPI.delete(eventId);
      toast.success('Event deleted');
      fetchEvents();
    } catch (err) {
      console.error('Error deleting event:', err);
      toast.error('Failed to delete event');
    }
  };

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    return event.status === filter;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">My Events</h1>
          <p className="text-slate-600">Create and manage your events</p>
        </div>

        {/* Create Event Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={handleCreate}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Create Event
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {['all', 'published', 'pending', 'draft', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
                filter === status ? 'bg-white/20' : 'bg-slate-100'
              }`}>
                {status === 'all' ? events.length : events.filter(e => e.status === status).length}
              </span>
            </button>
          ))}
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-slate-500 mb-4">No events found</p>
            <button
              onClick={handleCreate}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Create Your First Event
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isOrganizer={true}
              />
            ))}
          </div>
        )}

        {/* Create Modal */}
        {creating && (
          <CreateEventModal
            onClose={() => setCreating(false)}
            onSave={handleSaveCreate}
          />
        )}

        {/* Edit Modal */}
        {editingEvent && !creating && (
          <EditEventModal
            event={editingEvent}
            onClose={() => setEditingEvent(null)}
            onSave={handleSaveEdit}
          />
        )}
      </div>
    </div>
  );
};

export default OrganizerEvents;
