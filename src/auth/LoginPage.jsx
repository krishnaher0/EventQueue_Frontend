import React, { useState } from 'react';
import axios from 'axios';

// Define the API endpoint (Good practice to move this to an env file, but keeping it here for simplicity)
const LOGIN_API_URL = 'http://localhost:3000/api/auth/login'; 

const LoginPage = () => {
  // 1. STATE MANAGEMENT: Combine related states for cleaner updates
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  // 2. UX STATES: Loading and Error messages
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Destructure for easy access in the form
  const { email, password } = formData;

  // 3. HANDLERS: Unified change handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error message when user starts typing again
    if (error) setError(''); 
  };

  // 4. SUBMIT LOGIC: Enhanced async function
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Set loading state to true and clear any previous errors
    setIsLoading(true);
    setError(''); 

    try {
        const { data } = await axios.post(
            LOGIN_API_URL, 
            { email, password }, // The data payload (no need to specify Content-Type header explicitly for simple JSON posts with Axios)
        );

        console.log('Login Successful!', data);
        
        // SUCCESS ACTION: Store user token/info securely
        // Note: Using localStorage for non-sensitive public tokens is okay, 
        // but for sensitive tokens, consider secure cookies (HttpOnly, Secure) set by the backend.
        localStorage.setItem('userInfo', JSON.stringify(data)); 
        
        // Example: Redirect user 
        // window.location.href = '/dashboard'; 

    } catch (err) {
        // Handle network errors, 4xx/5xx status codes
        // Fallback message for complex errors
        const message = err.response?.data?.message || 'A network error occurred or the server is unavailable.';
        setError(message);
        console.error('Login Error:', err);

    } finally {
        // This runs regardless of success or failure
        setIsLoading(false);
    }
  };
  
  // UX Optimization: Displaying the loading and error states within the form

  return (
    
    <div className="min-h-screen flex">
      {/* 1. Image Column */}
      <div className="hidden lg:flex w-1/2 bg-gray-100 items-center justify-center relative p-8">
      <img src='../../public/images/woman.png' alt='Event Queue' className="w-full h-full object-cover rounded-lg shadow-xl" />
        {/* <div className="w-full h-full bg-cover bg-center rounded-lg shadow-xl" style={{ backgroundImage: "../../../public/images/woman.png"}}> */}
          <div className="absolute bottom-1 left-10 right-10 bg-white rounded-lg shadow-2xl text-center">
            <h3 className="text-xl font-semibold text-gray-900">Welcome to EventQueue</h3>
          </div>
        </div>
      {/* </div> */}

      {/* 2. Form Column */}
      <div className="flex-1 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Welcome Back</h2>
            <p className="mt-2 text-sm text-gray-600">Sign in to your account to continue</p>
          </div>

          {/* *** ERROR MESSAGE DISPLAY *** */}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email" // Key for combined handler
                type="email"
                required
                value={email}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Email address"
                disabled={isLoading} // Disable input while loading
              />
            </div>

            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password" // Key for combined handler
                type="password"
                required
                value={password}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Password"
                disabled={isLoading} // Disable input while loading
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" disabled={isLoading} />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Remember me</label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Forgot password?</a>
              </div>
            </div>

            <div>
              <button 
                type="submit" 
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${
                  isLoading 
                    ? 'bg-indigo-400 cursor-not-allowed' // Dimmed when loading
                    : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                }`}
                disabled={isLoading} // Disable button while loading
              >
                {/* *** LOADING STATE DISPLAY *** */}
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm">
            Don't have an account?
            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Sign up free</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;