import React, { useState } from 'react';
import axios from 'axios'; // Import Axios

const SignupPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    terms: false,
  });
  const [error, setError] = useState(''); // State to handle errors

  // ... (handleChange function remains the same)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    // Only send necessary fields to the backend
    const userData = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        // The backend User model doesn't strictly require 'phone' yet, 
        // but you can include it if your backend is updated to accept it.
    };

    try {
        const { data } = await axios.post(
            'http://localhost:3000/api/auth/signup', // TARGET BACKEND ROUTE
            userData,
            { headers: { 'Content-Type': 'application/json' } }
        );

        console.log('Signup Successful!', data);
        // Store user token/info in local storage for persistence
        localStorage.setItem('userInfo', JSON.stringify(data));
        
        // **SUCCESS ACTION:** Redirect user (e.g., to dashboard)
        // window.location.href = '/dashboard'; 

    } catch (err) {
        // Handle error from the backend (e.g., 'User already exists')
        const message = err.response?.data?.message || 'Signup failed. Please try again.';
        setError(message);
        console.error('Signup Error:', message);
    }
  };
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div className="min-h-screen flex">
      {/* 1. Form Column */}
      <div className="flex-1 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        
        {/* Navigation Placeholder */}
        <nav className="w-full max-w-md mb-8">
            {/* ... Navigation items (Login, Signup, etc.) ... */}
        </nav>

        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="mt-6 text-2xl font-bold text-gray-900">Create Account</h2>
            <p className="mt-2 text-sm text-gray-600">Join EventQueue and start accessing amazing events</p>
          </div>

          {/* Signup Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="sr-only">Full Name</label>
              <input id="fullName" name="fullName" type="text" required onChange={handleChange} value={formData.fullName} className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Full Name" />
            </div>

            {/* Email Address */}
            <div>
              <label htmlFor="email" className="sr-only">Email Address</label>
              <input id="email" name="email" type="email" required onChange={handleChange} value={formData.email} className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Email Address" />
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phone" className="sr-only">Phone Number</label>
              <input id="phone" name="phone" type="tel" required onChange={handleChange} value={formData.phone} className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Phone Number" />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input id="password" name="password" type="password" required onChange={handleChange} value={formData.password} className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Password" />
              <p className="mt-2 text-xs text-gray-500">Strong and secure password</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
              <input id="confirmPassword" name="confirmPassword" type="password" required onChange={handleChange} value={formData.confirmPassword} className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Confirm Password" />
            </div>

            {/* Terms & Privacy Checkbox */}
            <div className="flex items-center">
              <input id="terms" name="terms" type="checkbox" checked={formData.terms} onChange={handleChange} required className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                I agree to the <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Terms of service</a> and <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Privacy Policy</a>
              </label>
            </div>

            {/* Create Account Button */}
            <div>
              <button type="submit" className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Create Account
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm">
            Already have an account?
            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Sign in</a>
          </div>
        </div>
      </div>

      {/* 2. Image Column (Hidden on small screens) */}
      <div className="hidden lg:flex w-1/2 bg-gray-100 items-center justify-center relative p-8">
            <img src='../../public/images/woman.png' alt='Event Queue' className="w-full h-full object-cover rounded-lg shadow-xl" />

        {/* <div className="w-full h-full bg-cover bg-center rounded-lg shadow-xl" style={{ backgroundImage: "ur" }}> */}
          <div className="absolute bottom-40 left-18 p-10 right-8 bg-white rounded-lg shadow-2xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Why Join EventQueue?</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center">✅ Access to 100+ exclusive events</li>
              <li className="flex items-center">✅ Discounts and special offers</li>
              <li className="flex items-center">✅ Connect with a vibrant community</li>
            </ul>
          </div>
        </div>
      </div>
    // </div>
  );
};

export default SignupPage;