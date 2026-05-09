import React, { useState, useEffect } from 'react';
import { authAPI } from './services/api';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Metrics from './components/Metrics';
import Agents from './components/Agents';
import CTA from './components/CTA';
import Footer from './components/Footer';
import DiscoveryHubPage from './pages/DiscoveryHubPage';
import AnalyzerPage from './pages/AnalyzerPage';
import DashboardPage from './pages/DashboardPage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import useAnalysisStore from './services/analysisStore';

const App = () => {
  const [currentPage, setCurrentPage] = useState(authAPI.isLoggedIn() ? 'landing' : 'auth');
  const [isLoggedIn, setIsLoggedIn] = useState(authAPI.isLoggedIn());
  const [user, setUser] = useState(authAPI.getCurrentUser());

  // Sync analysis store on mount if logged in
  useEffect(() => {
    if (isLoggedIn) {
      useAnalysisStore.hydrate();
    }
  }, [isLoggedIn]);

  // Listen for auth logout events (triggered by 401 responses)
  useEffect(() => {
    const handleLogout = () => {
      setIsLoggedIn(false);
      setUser(null);
      setCurrentPage('auth');
    };
    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  const navigate = (page) => {
    // Protect routes that need auth
    const protectedPages = ['profile', 'analyzer', 'funding_os'];
    if (protectedPages.includes(page) && !authAPI.isLoggedIn()) {
      setCurrentPage('auth');
      return;
    }
    setCurrentPage(page);
  };

  const handleAuthSuccess = () => {
    setIsLoggedIn(true);
    setUser(authAPI.getCurrentUser());
  };

  const handleLogout = () => {
    authAPI.logout();
    setIsLoggedIn(false);
    setUser(null);
    setCurrentPage('auth');
  };

  if (currentPage === 'discovery') {
    return <DiscoveryHubPage onNavigate={navigate} currentPage={currentPage} />;
  }

  if (currentPage === 'analyzer') {
    return <AnalyzerPage onNavigate={navigate} currentPage={currentPage} user={user} onLogout={handleLogout} />;
  }

  if (currentPage === 'funding_os') {
    return <DashboardPage onNavigate={navigate} currentPage={currentPage} user={user} onLogout={handleLogout} />;
  }

  if (currentPage === 'auth') {
    return (
      <AuthPage 
        onNavigate={(page) => {
          handleAuthSuccess();
          navigate(page);
        }} 
      />
    );
  }

  if (currentPage === 'profile') {
    return (
      <ProfilePage 
        onNavigate={navigate} 
        currentPage={currentPage} 
        user={user} 
        onLogout={handleLogout} 
      />
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <Navbar 
        onNavigate={navigate} 
        currentPage={currentPage} 
        isLoggedIn={isLoggedIn} 
        user={user} 
        onLogout={handleLogout} 
      />
      <main className="max-w-[1200px] mx-auto px-6 md:px-12 pb-20 overflow-x-hidden">
        <Hero onNavigate={navigate} />
        <Metrics />
        <Agents />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default App;
