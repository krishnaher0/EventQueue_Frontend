import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { eventsAPI } from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';
import EventCard from '../../components/admin/cards/EventCard';
import EditEventModal from '../../components/admin/modals/EditEventModal';

const AdminEvents = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState(null);
  const [creating, setCreating] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchEvents();
  }, [isAuthenticated, user, navigate]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await eventsAPI.getAllEventsAdmin();
      setEvents(res.data?.events || res.data || []);
    } catch (err) {
      console.error('Error fetching events:', err);
      toast.error('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const formatDateForInput = (date) => {
    if (!date) return '';
    const d = new Date(date);
    // Pad month, day, hour, minute
    const pad = (n) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const handleEdit = async (event) => {
    try {
      const res = await eventsAPI.getById(event._id);
      const evt = res.data ? res.data.event : res.event;
      setEditingEvent({
        ...evt,
        startDate: formatDateForInput(evt.startDate),
        endDate: formatDateForInput(evt.endDate),
        imageFile: null,
        imagePreview: null,
      });
      setCreating(false);
    } catch (err) {
      toast.error('Failed to fetch event details');
    }
  };

  const handleCreate = () => {
    setEditingEvent({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      location: { venue: '', city: '', address: '' },
      image: '',
      ticketTypes: [],
      category: '',
      status: 'draft',
      organizer: user,
    });
    setCreating(true);
  };

  const handleSaveEdit = async (updatedEvent) => {
    try {
      const formData = new FormData();
      formData.append('title', updatedEvent.title);
      formData.append('description', updatedEvent.description);
      formData.append('startDate', updatedEvent.startDate);
      formData.append('endDate', updatedEvent.endDate);
      formData.append('category', updatedEvent.category);
      formData.append('status', updatedEvent.status);
      formData.append('isFeatured', updatedEvent.isFeatured);
      formData.append('location[venue]', updatedEvent.location?.venue || '');
      formData.append('location[city]', updatedEvent.location?.city || '');
      formData.append('location[address]', updatedEvent.location?.address || '');
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
      formData.append('title', newEvent.title);
      formData.append('description', newEvent.description);
      formData.append('startDate', newEvent.startDate);
      formData.append('endDate', newEvent.endDate);
      formData.append('category', newEvent.category);
      formData.append('status', newEvent.status);
      formData.append('isFeatured', newEvent.isFeatured);
      formData.append('location[venue]', newEvent.location?.venue || '');
      formData.append('location[city]', newEvent.location?.city || '');
      formData.append('location[address]', newEvent.location?.address || '');
      if (newEvent.imageFile) formData.append('image', newEvent.imageFile);
      await eventsAPI.create(formData);
      toast.success('Event created successfully');
      setEditingEvent(null);
      setCreating(false);
      fetchEvents();
    } catch (err) {
      console.error('Error creating event:', err);
      toast.error('Failed to create event');
    }
  };

  const handlePublish = async (eventId) => {
    try {
      await eventsAPI.approveEvent(eventId);
      toast.success('Event published');
      fetchEvents();
    } catch (err) {
      console.error('Error publishing event:', err);
      toast.error('Failed to publish event');
    }
  };

  const handleUnpublish = async (event) => {
    try {
      await eventsAPI.updateEvent(event._id, { status: 'draft' });
      toast.success('Event unpublished');
      fetchEvents();
    } catch (err) {
      console.error('Error unpublishing event:', err);
      toast.error('Failed to unpublish event');
    }
  };

  const handleReject = async (eventId) => {
    try {
      await eventsAPI.rejectEvent(eventId);
      toast.success('Event rejected');
      fetchEvents();
    } catch (err) {
      console.error('Error rejecting event:', err);
      toast.error('Failed to reject event');
    }
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await eventsAPI.deleteEvent(eventId);
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
    <AdminLayout title="Events Management" subtitle="Manage all events on the platform">
      {/* Create Event Button */}
      <div className="flex justify-end mb-4 text-black[400]">
        <button
          onClick={handleCreate}
          className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/80 transition"
        >
          + Create Event
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
                ? 'bg-primary text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            <span className="ml-2 px-1.5 py-0.5 rounded-full text-xs bg-white/20">
              {status === 'all' ? events.length : events.filter(e => e.status === status).length}
            </span>
          </button>
        ))}
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl">
          <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-slate-500">No events found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              onEdit={handleEdit}
              onPublish={handlePublish}
              onUnpublish={handleUnpublish}
              onReject={handleReject}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Edit/Create Modal */}
      {(editingEvent && (creating || editingEvent._id)) && (
        <EditEventModal
          event={editingEvent}
          onClose={() => { setEditingEvent(null); setCreating(false); }}
          onSave={creating ? handleSaveCreate : handleSaveEdit}
        />
      )}
    </AdminLayout>
  );
};

export default AdminEvents;