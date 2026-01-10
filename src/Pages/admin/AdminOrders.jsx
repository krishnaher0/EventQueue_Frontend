import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ordersAPI } from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminOrders = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
  });
  const [statusFilter, setStatusFilter] = useState('');

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
    fetchOrders();
  }, [isAuthenticated, user, navigate, authLoading, pagination.currentPage, statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.currentPage,
        limit: 20,
      };
      if (statusFilter) params.status = statusFilter;

      const response = await ordersAPI.getAllAdmin(params);
      setOrders(response.data?.orders || []);
      setPagination({
        currentPage: response.data?.pagination?.currentPage || 1,
        totalPages: response.data?.pagination?.totalPages || 1,
        totalOrders: response.data?.pagination?.total || 0,
      });
    } catch (err) {
      console.error('Error fetching orders:', err);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await ordersAPI.updateStatus(orderId, newStatus);
      toast.success('Order status updated successfully');
      fetchOrders();
    } catch (err) {
      console.error('Error updating order status:', err);
      toast.error('Failed to update order status');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  if (authLoading || loading) {
    return (
      <AdminLayout title="Product Orders">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Product Orders"
      subtitle={`Manage all product orders (${pagination.totalOrders} total)`}
    >
      {/* Filter Buttons */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => handleStatusFilter('')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
            statusFilter === '' ? 'bg-primary text-white' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => handleStatusFilter('pending')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
            statusFilter === 'pending' ? 'bg-primary text-white' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => handleStatusFilter('processing')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
            statusFilter === 'processing' ? 'bg-primary text-white' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          Processing
        </button>
        <button
          onClick={() => handleStatusFilter('shipped')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
            statusFilter === 'shipped' ? 'bg-primary text-white' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          Shipped
        </button>
        <button
          onClick={() => handleStatusFilter('delivered')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
            statusFilter === 'delivered' ? 'bg-primary text-white' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          Delivered
        </button>
        <button
          onClick={() => handleStatusFilter('cancelled')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
            statusFilter === 'cancelled' ? 'bg-primary text-white' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          Cancelled
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        {orders.length === 0 ? (
          <div className="text-center py-12">
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
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-slate-900">No orders found</h3>
            <p className="mt-1 text-sm text-slate-500">
              {statusFilter ? `No ${statusFilter} orders found.` : 'No product orders have been placed yet.'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Order #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Shipping Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Total Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Payment Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Order Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-900">
                          {order.orderNumber || order._id?.slice(-8) || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900">{order.user?.fullName || 'N/A'}</div>
                        <div className="text-sm text-slate-500">{order.user?.email || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900">
                          {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                        </div>
                        {order.items?.slice(0, 2).map((item, idx) => (
                          <div key={idx} className="text-xs text-slate-500">
                            {item.name} x{item.quantity}
                          </div>
                        ))}
                        {order.items?.length > 2 && (
                          <div className="text-xs text-slate-500">+{order.items.length - 2} more</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900">{order.shippingAddress?.fullName || 'N/A'}</div>
                        <div className="text-xs text-slate-500">
                          {order.shippingAddress?.street}, {order.shippingAddress?.city}
                        </div>
                        <div className="text-xs text-slate-500">{order.shippingAddress?.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-900">
                          NPR {order.totalAmount?.toLocaleString() || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            order.paymentStatus === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : order.paymentStatus === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {order.paymentStatus || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {order.createdAt ? formatDate(order.createdAt) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                          className="text-xs border border-slate-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="px-6 py-4 flex items-center justify-between border-t border-slate-200">
                <div className="text-sm text-slate-700">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
