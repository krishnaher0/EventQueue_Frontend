import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { venuesAPI } from '../../services/venueApi';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../../components/admin/AdminLayout';



const VENUE_TYPES = [
  'Conference Hall',
  'Banquet Hall',
  'Outdoor Venue',
  'Hotel',
  'Restaurant',
  'Stadium',
  'Auditorium',
  'Meeting Room',
  'Rooftop',
  'Garden',
  'Beach',
  'Other',
];

const AMENITIES = [
  'WiFi',
  'Parking',
  'Air Conditioning',
  'Sound System',
  'Projector',
  'Stage',
  'Catering',
  'Security',
  'Wheelchair Access',
  'Power Backup',
  'Green Room',
  'Kitchen',
  'Bar',
];

const AdminVenues = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVenue, setEditingVenue] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    city: '',
    street: '',
    basePrice: '',
    maxCapacity: '',
    minCapacity: '10',
    amenities: [],
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchVenues();
  }, [isAuthenticated, user, navigate, authLoading]);

  const fetchVenues = async () => {
    try {
      setLoading(true);
      const response = await venuesAPI.getAllAdmin();
      setVenues(response.data.venues || []);
    } catch (error) {
      console.error('Error fetching venues:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAmenityToggle = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: '',
      city: '',
      street: '',
      basePrice: '',
      maxCapacity: '',
      minCapacity: '10',
      amenities: [],
    });
    setImageFile(null);
    setImagePreview('');
    setEditingVenue(null);
    setShowForm(false);
  };

  const handleEdit = (venue) => {
    setEditingVenue(venue);
    setFormData({
      name: venue.name,
      description: venue.description,
      type: venue.type,
      city: venue.address?.city || '',
      street: venue.address?.street || '',
      basePrice: venue.pricing?.basePrice?.toString() || '',
      maxCapacity: venue.capacity?.maximum?.toString() || '',
      minCapacity: venue.capacity?.minimum?.toString() || '10',
      amenities: venue.amenities || [],
    });
    setImagePreview(venue.image || '');
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('type', formData.type);
      data.append('address[city]', formData.city);
      data.append('address[street]', formData.street);
      data.append('address[country]', 'Nepal');
      data.append('pricing[basePrice]', formData.basePrice);
      data.append('capacity[maximum]', formData.maxCapacity);
      data.append('capacity[minimum]', formData.minCapacity);
      // Fix amenities: send as array, not comma string
      formData.amenities.forEach(a => data.append('amenities[]', a));
      if (imageFile) data.append('image', imageFile);

      if (editingVenue) {
        await venuesAPI.update(editingVenue._id, data);
      } else {
        await venuesAPI.create(data);
      }

      resetForm();
      fetchVenues();
    } catch (error) {
      console.error('Error saving venue:', error);
      alert('Failed to save venue');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this venue?')) return;
    try {
      await venuesAPI.delete(id);
      fetchVenues();
    } catch (error) {
      console.error('Error deleting venue:', error);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await venuesAPI.toggleStatus(id);
      fetchVenues();
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      await venuesAPI.toggleFeatured(id);
      fetchVenues();
    } catch (error) {
      console.error('Error toggling featured:', error);
    }
  };

  const handleApprove = async (id) => {
    try {
      await venuesAPI.approve(id);
      fetchVenues();
    } catch (error) {
      console.error('Error approving venue:', error);
    }
  };

  if (authLoading || loading) {
    return (
      <AdminLayout title="Venues Management" subtitle="Add and manage venue listings">
        <div className="min-h-screen flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Venues Management" subtitle="Add and manage venue listings">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-blue-200 text-black rounded-lg font-medium hover:bg-blue-600 transition"
          >
            {showForm ? 'Cancel' : 'Add Venue'}
          </button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6">
              {editingVenue ? 'Edit Venue' : 'Add New Venue'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Venue Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Venue Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select Type</option>
                    {VENUE_TYPES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Kathmandu"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Base Price per Day (NPR) *
                  </label>
                  <input
                    type="number"
                    name="basePrice"
                    value={formData.basePrice}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Min Capacity
                    </label>
                    <input
                      type="number"
                      name="minCapacity"
                      value={formData.minCapacity}
                      onChange={handleChange}
                      min="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Capacity *
                    </label>
                    <input
                      type="number"
                      name="maxCapacity"
                      value={formData.maxCapacity}
                      onChange={handleChange}
                      required
                      min="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Amenities
                </label>
                <div className="flex flex-wrap gap-2">
                  {AMENITIES.map((amenity) => (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => handleAmenityToggle(amenity)}
                      className={`px-4 py-2 rounded-full text-sm transition ${
                        formData.amenities.includes(amenity)
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Venue Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full"
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mt-2 w-48 h-32 object-cover rounded-lg"
                  />
                )}
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingVenue ? 'Update Venue' : 'Add Venue'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Venues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map((venue) => (
            <div key={venue._id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="aspect-video relative">
                <img
                  src={venue.image || 'https://via.placeholder.com/400x300'}
                  alt={venue.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  {venue.isFeatured && (
                    <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded">
                      Featured
                    </span>
                  )}
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      venue.isActive
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                    }`}
                  >
                    {venue.isActive ? 'Active' : 'Inactive'}
                  </span>
                  {!venue.isApproved && (
                    <span className="px-2 py-1 bg-orange-500 text-white text-xs rounded">
                      Pending
                    </span>
                  )}
                </div>
              </div>
              <div className="p-4">
                <span className="text-xs text-indigo-600 font-medium">{venue.type}</span>
                <h3 className="font-semibold text-gray-900 mt-1">{venue.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {venue.address?.city}, {venue.address?.country || 'Nepal'}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <span className="font-bold text-gray-900">
                    NPR {venue.pricing?.basePrice?.toLocaleString()}/day
                  </span>
                  <span className="text-sm text-gray-500">
                    Up to {venue.capacity?.maximum} guests
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                  <button
                    onClick={() => handleEdit(venue)}
                    className="px-3 py-1 text-sm bg-indigo-100 text-indigo-600 rounded hover:bg-indigo-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleToggleStatus(venue._id)}
                    className="px-3 py-1 text-sm bg-yellow-100 text-yellow-600 rounded hover:bg-yellow-200"
                  >
                    {venue.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleToggleFeatured(venue._id)}
                    className="px-3 py-1 text-sm bg-purple-100 text-purple-600 rounded hover:bg-purple-200"
                  >
                    {venue.isFeatured ? 'Unfeature' : 'Feature'}
                  </button>
                  {!venue.isApproved && (
                    <button
                      onClick={() => handleApprove(venue._id)}
                      className="px-3 py-1 text-sm bg-green-100 text-green-600 rounded hover:bg-green-200"
                    >
                      Approve
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(venue._id)}
                    className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {venues.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <p className="text-gray-500">No venues found. Add your first venue!</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminVenues;
