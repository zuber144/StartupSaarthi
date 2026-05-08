import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FundabilityGauge from '../components/dashboard/FundabilityGauge';
import AICopilotChat from '../components/dashboard/AICopilotChat';
import Deadlines from '../components/dashboard/Deadlines';
import DataRoomStatus from '../components/dashboard/DataRoomStatus';
import InvestorMatch from '../components/dashboard/InvestorMatch';

const DashboardPage = ({ onNavigate, currentPage }) => {
  return (
    <div className="min-h-screen flex flex-col pt-24 bg-background">
      <Navbar onNavigate={onNavigate} currentPage={currentPage} />
      
      <main className="flex-grow max-w-[1200px] mx-auto w-full px-6 md:px-12 pb-20">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 pt-8">
          <div>
            <h1 className="text-4xl font-extrabold text-on-surface mb-2 tracking-tight">Your Funding OS</h1>
            <p className="text-base text-on-surface-variant font-medium">Manage your readiness, documents, and investor interactions.</p>
          </div>
          
          <div className="flex items-center gap-4 bg-white border border-outline-variant/30 rounded-2xl p-4 shadow-soft mt-4 md:mt-0">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container border border-outline-variant/20">
              <img 
                alt="User Profile" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuApBC330vU6wL_zz5esMJt3PFNy5QHZwvTWeasKwinHOROqxLXlTdawTUQ3rV1m3lSsaYUHGB4FkU40awd9guHdyeJQIEgL8wKmkJt6GdXEnBJfu7sIfgdDiwvqminqWJid-gnYw7xTRXI2QIFrUwpaZF5JU_Ql6Nfbmn0SG_3ePvNFZsn0KZJ5Om-4t9M5fzOFbnKag_Sh0Aj-Y-mawKXW4arHcB388ZEq_DwMgttFedhwv1qONiKwdwZcuvkSI31LgEnvDQ9E-Go" 
              />
            </div>
            <div>
              <h3 className="text-lg font-bold text-on-surface leading-tight">Aditya Sharma</h3>
              <span className="text-[10px] font-bold text-primary bg-primary-fixed/30 px-2 py-0.5 rounded tracking-widest uppercase">SEED STAGE</span>
            </div>
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left Column (Wide) */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <FundabilityGauge score={75} />
            <AICopilotChat />
          </div>
          
          {/* Right Column (Narrow) */}
          <div className="flex flex-col gap-8">
            <Deadlines />
            <DataRoomStatus />
          </div>
        </div>

        {/* Bottom Card: Investor Match */}
        <InvestorMatch />
      </main>

      <Footer />
    </div>
  );
};

export default DashboardPage;
