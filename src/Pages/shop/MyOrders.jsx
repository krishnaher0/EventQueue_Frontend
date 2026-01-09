import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ordersAPI } from '../../services/api';
import { 
  ShoppingBag, Package, Calendar, MapPin, Phone, 
  ChevronLeft, Search, Filter, CheckCircle, XCircle, 
  AlertCircle, RefreshCw, Truck, Clock, CreditCard,
  ChevronDown, ChevronUp, Eye
} from 'lucide-react';

const MyOrders = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/my-orders' } });
      return;
    }
    fetchOrders();
  }, [isAuthenticated, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await ordersAPI.getMyOrders();
      setOrders(response.data?.orders || response.orders || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'shipped':
      case 'out_for_delivery':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'processing':
      case 'confirmed':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'pending':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'cancelled':
      case 'refunded':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'failed':
      case 'refunded':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
      case 'completed':
        return <CheckCircle size={14} />;
      case 'shipped':
      case 'out_for_delivery':
        return <Truck size={14} />;
      case 'processing':
      case 'confirmed':
        return <Package size={14} />;
      case 'pending':
        return <Clock size={14} />;
      case 'cancelled':
        return <XCircle size={14} />;
      default:
        return <AlertCircle size={14} />;
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatShortDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items?.some(item => 
        item.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const totalSpent = orders.reduce((sum, order) => {
    if (order.paymentStatus === 'paid' || order.status !== 'cancelled') {
      return sum + (order.totalAmount || 0);
    }
    return sum;
  }, 0);

  const totalItems = orders.reduce((sum, order) => {
    return sum + (order.items?.reduce((itemSum, item) => itemSum + (item.quantity || 0), 0) || 0);
  }, 0);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
          >
            <ChevronLeft size={20} />
            Back to Profile
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
              <p className="text-gray-500 mt-1">Track and manage your orders</p>
            </div>
            <Link
              to="/shop"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
            >
              <ShoppingBag size={18} />
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <ShoppingBag className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                <p className="text-sm text-gray-500">Total Orders</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-green-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(o => o.status === 'delivered').length}
                </p>
                <p className="text-sm text-gray-500">Delivered</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Package className="text-yellow-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
                <p className="text-sm text-gray-500">Total Items</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <CreditCard className="text-purple-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  NPR {totalSpent.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">Total Spent</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by order ID or product name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button
                onClick={fetchOrders}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                title="Refresh"
              >
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm p-12 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-500">Loading your orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <ShoppingBag className="mx-auto text-gray-300 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your filters'
                : "You haven't placed any orders yet. Start shopping!"}
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              <ShoppingBag size={18} />
              Browse Shop
            </Link>
          </div>
        ) : (
          /* Orders List */
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <OrderCard 
                key={order._id} 
                order={order}
                isExpanded={expandedOrderId === order._id}
                onToggle={() => setExpandedOrderId(
                  expandedOrderId === order._id ? null : order._id
                )}
                getStatusColor={getStatusColor}
                getPaymentStatusColor={getPaymentStatusColor}
                getStatusIcon={getStatusIcon}
                formatDate={formatDate}
                formatShortDate={formatShortDate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Order Card Component
const OrderCard = ({ 
  order, 
  isExpanded,
  onToggle,
  getStatusColor,
  getPaymentStatusColor,
  getStatusIcon,
  formatDate,
  formatShortDate,
}) => {
  const navigate = useNavigate();
  const itemCount = order.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
      {/* Order Header */}
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50 transition"
        onClick={onToggle}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            {/* First Product Image */}
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              <img
                src={order.items?.[0]?.product?.images?.[0] || order.items?.[0]?.product?.image || order.items?.[0]?.image || '/placeholder-product.jpg'}
                alt="Order"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-gray-900">Order #{order._id?.slice(-8)}</p>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {order.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {formatShortDate(order.createdAt)} • {itemCount} item{itemCount !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">
                NPR {order.totalAmount?.toLocaleString() || 0}
              </p>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                {order.paymentStatus || 'pending'}
              </span>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition">
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t">
          {/* Order Items */}
          <div className="p-4 space-y-3">
            <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
            {order.items?.map((item, index) => (
              <div 
                key={index} 
                className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
              >
                <img
                  src={item.product?.images?.[0] || item.product?.image || item.image || '/placeholder-product.jpg'}
                  alt={item.product?.name || item.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <Link 
                    to={`/shop/${item.product?._id || item.productId}`}
                    className="font-medium text-gray-900 hover:text-indigo-600 transition"
                  >
                    {item.product?.name || item.name || 'Product'}
                  </Link>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                    <span>Qty: {item.quantity}</span>
                    {item.size && <span>Size: {item.size}</span>}
                    {item.color && <span>Color: {item.color}</span>}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    NPR {((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    NPR {item.price?.toLocaleString()} each
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Shipping & Payment Info */}
          <div className="grid md:grid-cols-2 gap-4 p-4 border-t bg-gray-50">
            {/* Shipping Address */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <MapPin size={16} />
                Shipping Address
              </h4>
              {order.shippingAddress ? (
                <div className="text-sm text-gray-600">
                  <p>{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.street}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                  <p>{order.shippingAddress.country} - {order.shippingAddress.zipCode}</p>
                  {order.shippingAddress.phone && (
                    <p className="flex items-center gap-1 mt-1">
                      <Phone size={12} />
                      {order.shippingAddress.phone}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No shipping address provided</p>
              )}
            </div>

            {/* Order Summary */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <CreditCard size={16} />
                Order Summary
              </h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span>NPR {(order.subtotal || order.totalAmount || 0).toLocaleString()}</span>
                </div>
                {order.shippingCost > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Shipping</span>
                    <span>NPR {order.shippingCost?.toLocaleString()}</span>
                  </div>
                )}
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-NPR {order.discount?.toLocaleString()}</span>
                  </div>
                )}
                {order.tax > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tax</span>
                    <span>NPR {order.tax?.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold pt-2 border-t">
                  <span>Total</span>
                  <span>NPR {order.totalAmount?.toLocaleString()}</span>
                </div>
                {order.paymentMethod && (
                  <p className="text-gray-500 pt-1">
                    Paid via {order.paymentMethod}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Order Timeline / Tracking */}
          {order.trackingNumber && (
            <div className="p-4 border-t">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Truck size={16} />
                Tracking Information
              </h4>
              <p className="text-sm text-gray-600">
                Tracking Number: <span className="font-medium">{order.trackingNumber}</span>
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="p-4 border-t bg-gray-50 flex flex-wrap gap-3">
            <button 
              onClick={() => navigate(`/order/${order._id}`)}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
            >
              <Eye size={16} />
              View Details
            </button>
            {order.status === 'delivered' && (
              <button className="px-4 py-2 border border-indigo-300 text-indigo-600 text-sm font-medium rounded-lg hover:bg-indigo-50 transition">
                Write Review
              </button>
            )}
            {['pending', 'processing'].includes(order.status) && (
              <button className="px-4 py-2 border border-red-300 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition">
                Cancel Order
              </button>
            )}
            <button className="px-4 py-2 border border-gray-300 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-100 transition">
              Download Invoice
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;