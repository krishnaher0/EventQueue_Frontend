// src/components/Navbar.jsx

import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <a href="/" className="text-2xl font-bold text-indigo-600">
              EventQueue
            </a>
          </div>

          {/* Navigation Links (Hidden on login page often, but included for completeness) */}
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            <a 
              href="/" 
              className="text-gray-500 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Home
            </a>
            <a 
              href="/events" 
              className="text-gray-500 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Events
            </a>
          </div>

          {/* Action Button (e.g., Sign Up) */}
          <div className="flex items-center">
            <a 
              href="/signup" 
              className="ml-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;