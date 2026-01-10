import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

export const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  // const fetchUser = async () => {
  //   try {
  //     const response = await authAPI.getMe();
  //     setUser(response.data.user);
  //   } catch (err) {
  //     localStorage.removeItem('token');
  //     setUser(null);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const fetchUser = async () => {
  try {
    const response = await authAPI.getMe();
    const apiUser = response.data.user;

    setUser({
      ...apiUser,
      _id: apiUser._id || apiUser.id, // normalize here
    });
  } catch (err) {
    localStorage.removeItem('token');
    setUser(null);
  } finally {
    setLoading(false);
  }
};


  const login = async (credentials) => {
    setError(null);
    try {
      const response = await authAPI.login(credentials);
      localStorage.setItem('token', response.data.token);
      // setUser(response.data.user);
      setUser({
  ...response.data.user,
  _id: response.data.user._id || response.data.user.id,
});

      return response;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    }
  };

  const signup = async (userData) => {
    setError(null);
    try {
      const response = await authAPI.signup(userData);
      localStorage.setItem('token', response.data.token);
      // setUser(response.data.user);
      setUser({
  ...response.data.user,
  _id: response.data.user._id || response.data.user.id,
});
      return response;
    } catch (err) {
      setError(err.message || 'Signup failed');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const handleGoogleCallback = async (token) => {
    setError(null);
    try {
      localStorage.setItem('token', token);
      await fetchUser();
    } catch (err) {
      localStorage.removeItem('token');
      setError(err.message || 'Google authentication failed');
      throw err;
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    handleGoogleCallback,
    updateUser,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
