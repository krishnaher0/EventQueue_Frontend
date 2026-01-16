import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';
import { SocketProvider } from './context/SocketContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';



// Event pages
import Events from './pages/events/Events';
import EventDetail from './pages/events/EventDetail';
import CreateEvent from './pages/events/CreateEvent';
import Calendar from './pages/events/Calendar';

// Shop pages
import Shop from './pages/shop/Shop';
import ProductDetail from './pages/shop/ProductDetail';
import Cart from './pages/shop/Cart';
import Checkout from './pages/shop/Checkout';

// Venue pages
import Venues from './pages/venues/Venues';
import VenueDetail from './pages/venues/VenueDetail';

// Payment pages
import PaymentSuccess from './pages/payment/PaymentSuccess';
import PaymentFailure from './pages/payment/PaymentFailure';

// Profile pages
import Profile from './pages/profile/Profile';
import MyTickets from './pages/profile/MyTickets';

// Blog pages
import Blogs from './Pages/blogs/Blogs';
import BlogDetail from './Pages/blogs/BlogDetail';
import CreateBlog from './Pages/blogs/CreateBlog';


// Community pages
import Communities from './Pages/communities/Communities';
import CommunityDetail from './Pages/communities/CommunityDetail';
import CreateCommunity from './Pages/communities/CreateCommunity';

// Misc pages
import TestPayment from './pages/misc/TestPayment';
import TestNotifications from './pages/misc/TestNotifications';

import './App.css';
import MyVenueBookings from './Pages/venues/MyVenueBookings';
import MyOrders from './Pages/shop/MyOrders';
import AdminEvents from './pages/admin/AdminEvents';
import RequestHost from './Pages/organizer/RequestHost';
import AdminProducts from './pages/admin/AdminProducts';
import AdminVenues from './Pages/admin/AdminVenues';
import AdminEventBookings from './Pages/admin/AdminEventBookings';
import AdminVenueBookings from './Pages/admin/AdminVenueBookings';
import AdminOrders from './Pages/admin/AdminOrders';

import LoginPage from './pages/auth/Login';
import SignupPage from './Pages/auth/Signup';
import ForgotPassword from './Pages/auth/ForgotPassword';
import VerifyCode from './Pages/auth/VerifyCode';
import ResetPassword from './Pages/auth/ResetPassword';
import HomePage from './Pages/static/Home';
import AuthCallback from './Pages/auth/AuthCallback';
import AdminDashboard from './Pages/admin/AdminDashboard';
import AdminAnalytics from './Pages/admin/AdminAnalytics';
import OrganizerDashboard from './Pages/organizer/dashboard';

import FAQ from './Pages/static/FAQ';
import Terms from './Pages/static/Terms';
import Privacy from './Pages/static/Privacy';
import ContactPage from './Pages/static/Contact';
import NotFound from './Pages/static/NotFound';


function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <SocketProvider>
          <CartProvider>
            <Router>
              <NotificationProvider>
                <div className="min-h-screen flex flex-col">
                  <Header />
                  <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/verify-code" element={<VerifyCode />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route path="/request-host" element={<RequestHost />} />
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/analytics" element={<AdminAnalytics />} />
                  <Route path="/admin/products" element={<AdminProducts />} />
                  <Route path="/admin/events" element={<AdminEvents />} />
                  <Route path="/admin/venues" element={<AdminVenues />} />
                  <Route path="/admin/event-bookings" element={<AdminEventBookings />} />
                  <Route path="/admin/venue-bookings" element={<AdminVenueBookings />} />
                  <Route path="/admin/orders" element={<AdminOrders />} />
                  <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
                  <Route path="/create-event" element={<CreateEvent />} />

                  {/* Event Routes */}
                  <Route path="/events" element={<Events />} />
                  <Route path="/events/:id" element={<EventDetail />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/my-tickets" element={<MyTickets />} />
                  <Route path="/my-venue-bookings" element={<MyVenueBookings />} />
                   <Route path="/my-orders" element={<MyOrders />} />


                  {/* Shop Routes */}
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/shop/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />

                  {/* Venue Routes */}
                  <Route path="/venues" element={<Venues />} />
                  <Route path="/venues/:id" element={<VenueDetail />} />

                  {/* Blog Routes */}
                  <Route path="/blogs" element={<Blogs />} />
                  <Route path="/blogs/create" element={<CreateBlog />} />
                  <Route path="/blogs/:slug" element={<BlogDetail />} />

                  {/* Community Routes */}
                  <Route path="/communities" element={<Communities />} />
                  <Route path="/communities/create" element={<CreateCommunity />} />
                  <Route path="/communities/:slug" element={<CommunityDetail />} />

                  {/* Payment Routes */}
                  <Route path="/payment/success" element={<PaymentSuccess />} />
                  <Route path="/payment/failure" element={<PaymentFailure />} />
                  <Route path="/payment/test" element={<TestPayment />} />

                  {/* Test Routes */}
                  <Route path="/test/notifications" element={<TestNotifications />} />

                  {/* User Routes */}
                  <Route path="/profile" element={<Profile />} />
                 
                  
                  <Route path="/contacts" element={<ContactPage />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />

                  {/* 404 Catch-all Route - Must be last */}
                  <Route path="*" element={<NotFound />} />
                  </Routes>
                  <Footer />
                </div>
              </NotificationProvider>
            </Router>
          </CartProvider>
        </SocketProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;