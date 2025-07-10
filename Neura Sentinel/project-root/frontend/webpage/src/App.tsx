import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import CustomCursor from './components/cursor/CustomCursor';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Hero from './components/hero/Hero';
import Dashboard from './components/dashboard/Dashboard';
import Login from './components/auth/Login';
import HowItWorks from './components/pages/HowItWorks';
import UsageGuide from './components/pages/UsageGuide';


const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-blue flex items-center justify-center">
        <div className="text-light-blue">Initializing secure connection...</div>
      </div>
    );
  }

  return user ? <>{children}</> : null;
};

function AppContent() {


  useEffect(() => {
    document.title = "Neura Sentinel - AI Network Analysis";
    document.body.classList.add('cursor-none');
    
    return () => {
      document.body.classList.remove('cursor-none');
    };
  }, []);

  return (
    <div className="min-h-screen bg-dark-blue text-white font-sans">
      <CustomCursor />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/login" element={<Login />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/usage-guide" element={<UsageGuide />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;