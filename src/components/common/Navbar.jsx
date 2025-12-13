import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore'; // Import Zustand store

const Navbar = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navigate = useNavigate();

    // **ZUSTAND INTEGRATION**: Select necessary state and actions
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    
    // Check roles (can be a selector in the store for cleanliness)
    const isAdmin = user?.role === 'admin';
    const isOrganizer = user?.role === 'organizer';

    const handleLogout = () => {
        logout(); // Call Zustand action
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                   <a href="/" className="flex items-center space-x-2">
                <img
                    // Replace the path with the actual location of your logo file
                    src="../../../public/images/logo.png" 
                    alt="EventQ Logo"
                    // Adjust width and height as needed. Tailwind's w-24 is a good starting size.
                    className="h-8 w-auto" 
                />
                {/* // Optional: You can add the brand name next to the logo icon
                <span className="text-xl font-bold text-gray-800">
                    EventQ
                </span>
                */}
            </a>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {/* ... Existing Nav Links ... */}
                        {user && ( // Show Dashboard link only if logged in
                            <>
                                {isAdmin && (
                                    <Link to="/admin-dashboard" className="text-gray-600 hover:text-indigo-600 transition">Admin Dashboard</Link>
                                )}
                                {isOrganizer && (
                                    <Link to="/organizer-dashboard" className="text-gray-600 hover:text-indigo-600 transition">Organizer Dashboard</Link>
                                )}
                            </>
                        )}
                        <Link to="/discover" className="text-gray-600 hover:text-indigo-600 transition">Discover</Link>
                        {/* ... other public links ... */}
                    </div>

                    {/* Right Side Icons */}
                    <div className="flex items-center space-x-4">
                        {/* Conditional Rendering based on user state */}
                        {!user ? (
                            <>
                                <Link 
                                    to="/login"
                                    className="text-sm font-medium text-gray-700 hover:text-indigo-600 hidden sm:block"
                                >
                                    Sign in
                                </Link>
                                <Link 
                                    to="/signup"
                                    className="bg-indigo-600 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition"
                                >
                                    Register
                                </Link>
                            </>
                        ) : (
                            <>
                                {/* Notifications, Cart (only visible when logged in) */}
                                {/* ... Existing Notifications/Cart JSX ... */}

                                {/* Profile Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition"
                                    >
                                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                                            <span className="text-indigo-600 font-semibold text-sm">
                                                {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                                            </span>
                                        </div>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {isProfileOpen && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border py-2 z-50">
                                            {/* User Info */}
                                            <div className="px-4 py-3 border-b">
                                                <p className="text-sm font-semibold text-gray-900">{user?.fullName}</p>
                                                <p className="text-xs text-gray-500">{user?.email}</p>
                                            </div>

                                            {/* ... My Profile, My Tickets Links ... */}
                                            
                                            <hr className="my-2" />
                                            <button
                                                onClick={handleLogout} // Calls Zustand logout
                                                className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                                            >
                                                {/* ... Logout SVG ... */}
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                        

                        {/* Mobile Menu Button */}
                        {/* ... */}
                    </div>
                </div>

                {/* Mobile Menu */}
                {/* ... */}
            </div>
        </nav>
    );
};

export default Navbar;