import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Interview from './pages/Interview';
import Results from './pages/Results';
import History from './pages/History';
import Leaderboard from './pages/Leaderboard';
import AdminPanel from './pages/AdminPanel';
import Profile from './pages/Profile';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import Layout from './components/Layout';
import SplashScreen from './components/SplashScreen';

const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

const UserRoute = ({ children }) => {
  const { token, isAdmin } = useAuth();
  if (!token) return <Navigate to="/login" />;
  if (isAdmin) return <Navigate to="/admin" />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { token, isAdmin } = useAuth();
  if (!token) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/dashboard" />;
  return children;
};

const AppRoutes = () => {
  const { token, isAdmin } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={token ? (isAdmin ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />) : <Login />} />
      <Route path="/register" element={token ? <Navigate to="/dashboard" /> : <Register />} />
      <Route path="/" element={token ? (isAdmin ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />) : <Navigate to="/login" />} />
      
      <Route path="/dashboard" element={<UserRoute><Layout><Dashboard /></Layout></UserRoute>} />
      <Route path="/resume" element={<UserRoute><Layout><ResumeAnalyzer /></Layout></UserRoute>} />
      <Route path="/interview" element={<UserRoute><Layout><Interview /></Layout></UserRoute>} />
      <Route path="/results/:sessionId" element={<UserRoute><Layout><Results /></Layout></UserRoute>} />
      <Route path="/history" element={<UserRoute><Layout><History /></Layout></UserRoute>} />
      <Route path="/leaderboard" element={<PrivateRoute><Layout><Leaderboard /></Layout></PrivateRoute>} />
      <Route path="/profile" element={<UserRoute><Layout><Profile /></Layout></UserRoute>} />
      <Route path="/admin" element={<AdminRoute><Layout><AdminPanel /></Layout></AdminRoute>} />
    </Routes>
  );
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}
      {!showSplash && (
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      )}
    </>
  );
}