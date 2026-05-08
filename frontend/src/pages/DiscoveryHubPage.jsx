import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/discovery/Sidebar';
import DiscoveryFeed from '../components/discovery/DiscoveryFeed';

const DiscoveryHubPage = ({ onNavigate, currentPage }) => {
  return (
    <div className="min-h-screen flex flex-col pt-20">
      <Navbar onNavigate={onNavigate} currentPage={currentPage} />
      <main className="flex-1 max-w-[1200px] mx-auto w-full px-6 md:px-12 py-10 md:py-20 flex flex-col lg:flex-row gap-8 lg:gap-12">
        <Sidebar />
        <DiscoveryFeed />
      </main>
      <Footer />
    </div>
  );
};

export default DiscoveryHubPage;
