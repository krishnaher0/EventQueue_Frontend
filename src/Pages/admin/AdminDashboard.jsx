import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { eventsAPI, organizerAPI } from '../../services/api';

// Import components
import AdminLayout from '../../components/admin/AdminLayout';
import StatsCard from '../../components/admin/cards/StatsCard';
import UsersTable from '../../components/admin/tables/UsersTable';
import OrganizerRequestsTable from '../../components/admin/OrganizerRequests';

const AdminDashboard = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [dataLoading, setDataLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [organizerRequests, setOrganizerRequests] = useState([]);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);

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
    fetchData();
  }, [isAuthenticated, user, navigate, authLoading]);

  const fetchData = async () => {
    setDataLoading(true);
    try {
      const [statsRes, eventsRes, usersRes, requestsRes, pendingCountRes] = await Promise.all([
        eventsAPI.getAdminStats(),
        eventsAPI.getAllEventsAdmin(),
        eventsAPI.getAllUsers(),
        organizerAPI.getAllRequests(),
        organizerAPI.getPendingCount(),
      ]);
      // Debug logs
      console.log('Stats:', statsRes);
      console.log('Events:', eventsRes);
      console.log('Users:', usersRes);
      console.log('Organizer Requests:', requestsRes);
      console.log('Pending Count:', pendingCountRes);
      setStats(statsRes.data || {});
      setEvents(eventsRes.data?.events || eventsRes.data?.data?.events || []);
      setUsers(usersRes.data?.users || usersRes.data?.data?.users || []);
      setOrganizerRequests(requestsRes.data?.requests || requestsRes.data || []);
      setPendingRequestsCount(pendingCountRes.data?.count || 0);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setDataLoading(false);
    }
  };

  const handleApproveOrganizer = async (requestId) => {
    try {
      await organizerAPI.approveRequest(requestId, 'Application approved');
      toast.success('Organizer request approved!');
      fetchData();
    } catch (err) {
      console.error('Error approving organizer:', err);
      toast.error('Failed to approve organizer');
    }
  };

  const handleRejectOrganizer = async (requestId) => {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
      try {
        await organizerAPI.rejectRequest(requestId, reason);
        toast.success('Organizer request rejected');
        fetchData();
      } catch (err) {
        console.error('Error rejecting organizer:', err);
        toast.error('Failed to reject organizer');
      }
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      await eventsAPI.updateUserRole(userId, newRole);
      toast.success(`User role updated to ${newRole}`);
      fetchData();
    } catch (err) {
      console.error('Error updating user role:', err);
      toast.error('Failed to update user role');
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z' },
    { id: 'users', label: 'Users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197' },
    { id: 'requests', label: 'Organizer Requests', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', badge: pendingRequestsCount },
  ];

  if (authLoading || dataLoading) {
    return (
      <AdminLayout title="Dashboard">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Dashboard Overview" subtitle="Welcome back! Here's what's happening with your platform.">
      {/* Sub Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium whitespace-nowrap transition-colors relative ${
              activeTab === tab.id
                ? 'bg-primary text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon} />
            </svg>
            {tab.label}
            {tab.badge > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Total Events"
              value={stats?.totalEvents || 0}
              icon="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              color="blue"
            />
            <StatsCard
              title="Total Users"
              value={stats?.totalUsers || 0}
              icon="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              color="green"
            />
            <StatsCard
              title="Total Organizers"
              value={stats?.totalOrganizers || 0}
              icon="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              color="purple"
            />
            <StatsCard
              title="Pending Approvals"
              value={stats?.pendingEvents || 0}
              icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              color="orange"
            />
          </div>

          {/* Recent Events */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Recent Events</h2>
            <div className="space-y-4">
              {events.slice(0, 5).map(event => (
                <div key={event._id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden">
                      {event.image ? (
                        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{event.title}</p>
                      <p className="text-sm text-slate-500">{event.category}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    event.status === 'published' ? 'bg-green-100 text-green-700' :
                    event.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    event.status === 'draft' ? 'bg-slate-100 text-slate-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {event.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <UsersTable users={users} onUpdateRole={handleUpdateUserRole} />
      )}

      {/* Organizer Requests Tab */}
      {activeTab === 'requests' && (
        <OrganizerRequestsTable
          requests={organizerRequests}
          onApprove={handleApproveOrganizer}
          onReject={handleRejectOrganizer}
        />
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;