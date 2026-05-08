import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Metrics from './components/Metrics';
import Agents from './components/Agents';
import CTA from './components/CTA';
import Footer from './components/Footer';
import DiscoveryHubPage from './pages/DiscoveryHubPage';
import AnalyzerPage from './pages/AnalyzerPage';
import DashboardPage from './pages/DashboardPage';

const App = () => {
  const [currentPage, setCurrentPage] = React.useState('landing');

  const navigate = (page) => setCurrentPage(page);

  if (currentPage === 'discovery') {
    return <DiscoveryHubPage onNavigate={navigate} currentPage={currentPage} />;
  }

  if (currentPage === 'analyzer') {
    return <AnalyzerPage onNavigate={navigate} currentPage={currentPage} />;
  }

  if (currentPage === 'funding_os') {
    return <DashboardPage onNavigate={navigate} currentPage={currentPage} />;
  }

  return (
    <div className="min-h-screen pt-20">
      <Navbar onNavigate={navigate} currentPage={currentPage} />
      <main className="max-w-[1200px] mx-auto px-12 pb-20">
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
