import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { Toaster } from 'sonner';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import HomeownerDashboard from './pages/HomeownerDashboard';
import ContractorDashboard from './pages/ContractorDashboard';
import PostJob from './pages/PostJob';
import JobDetails from './pages/JobDetails';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import Contact from './pages/Contact';
import BrowseJobs from './pages/BrowseJobs';
import PaymentSuccess from './pages/PaymentSuccess';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

// Context
const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export { API };

// Auth Provider
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await axios.get(`${API}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(res.data);
        } catch (err) {
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (email, password) => {
    const res = await axios.post(`${API}/auth/login`, { email, password });
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const register = async (userData) => {
    const res = await axios.post(`${API}/auth/register`, userData);
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Protected Route
const ProtectedRoute = ({ children, userType }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={userType === 'admin' ? '/admin-login' : '/login'} replace />;
  }

  if (userType && user.user_type !== userType) {
    if (user.user_type === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to={user.user_type === 'homeowner' ? '/dashboard' : '/contractor-dashboard'} replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/browse-jobs" element={<BrowseJobs />} />
            <Route path="/jobs/:jobId" element={<JobDetails />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            
            {/* Homeowner Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute userType="homeowner">
                <HomeownerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/post-job" element={
              <ProtectedRoute userType="homeowner">
                <PostJob />
              </ProtectedRoute>
            } />
            
            {/* Contractor Routes */}
            <Route path="/contractor-dashboard" element={
              <ProtectedRoute userType="contractor">
                <ContractorDashboard />
              </ProtectedRoute>
            } />
            
            {/* Shared Protected Routes */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/messages" element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            } />
            <Route path="/messages/:userId" element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin" element={
              <ProtectedRoute userType="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
          </Routes>
          <Toaster position="top-right" richColors />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
