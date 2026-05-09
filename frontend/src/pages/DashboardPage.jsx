import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FundabilityGauge from '../components/dashboard/FundabilityGauge';
import AICopilotChat from '../components/dashboard/AICopilotChat';
import Deadlines from '../components/dashboard/Deadlines';
import useAnalysisStore from '../services/analysisStore';

const DashboardPage = ({ onNavigate, currentPage, user, onLogout }) => {
  const { 
    analysis, 
    isRunning, 
    runAnalysis, 
    hydrate, 
    isHydrated, 
    meta,
    startup 
  } = useAnalysisStore();

  useEffect(() => {
    if (!isHydrated) hydrate();
  }, [isHydrated, hydrate]);

  if (!isHydrated) return (
    <div className="min-h-screen flex items-center justify-center pt-24 bg-background">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col pt-24 bg-background">
      <Navbar onNavigate={onNavigate} currentPage={currentPage} user={user} isLoggedIn={true} onLogout={onLogout} />

      <main className="flex-grow max-w-[1200px] mx-auto w-full px-6 md:px-12 pb-20">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 pt-8 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-on-surface mb-2 tracking-tight italic">Funding OS</h1>
            <p className="text-base text-on-surface-variant font-medium">
              {meta
                ? `System healthy · Intelligence synced ${meta.age}`
                : 'Run your first AI analysis to initialize your Funding OS.'}
            </p>
          </div>

          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-4 bg-white border border-outline-variant/30 rounded-2xl p-4 shadow-soft">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary border border-outline-variant/20">
                {startup ? startup.startup_name.charAt(0) : 'U'}
              </div>
              <div>
                <h3 className="text-lg font-bold text-on-surface leading-tight">{user?.full_name || 'Founder'}</h3>
                <span className="text-[10px] font-bold text-primary bg-primary-fixed/30 px-2 py-0.5 rounded tracking-widest uppercase">
                  {startup?.stage || 'SEED STAGE'}
                </span>
              </div>
            </div>

            {meta?.profile_changed && (
              <p className="text-[11px] font-bold text-amber-600 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">warning</span>
                Profile mismatch. Refresh recommended.
              </p>
            )}
            
            <button
              onClick={() => runAnalysis(true)}
              disabled={isRunning || !startup}
              className="btn-primary px-6 py-3 rounded-xl font-bold shadow-lg disabled:opacity-50 flex items-center gap-2 transition-transform active:scale-95"
            >
              <span className="material-symbols-outlined">{isRunning ? 'sync' : 'analytics'}</span>
              {isRunning ? 'Agents Running...' : analysis ? 'Refresh Analysis' : 'Run Full AI Analysis'}
            </button>
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left Column */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <FundabilityGauge 
              score={analysis?.readiness_score || 0} 
              reasoning={analysis?.validation_note || 'Run analysis to compute readiness.'} 
            />
            
            <div className="flex gap-4">
              <button
                onClick={() => onNavigate('analyzer')}
                className="flex items-center gap-2 bg-primary/10 text-primary px-5 py-3 rounded-xl font-bold text-sm hover:bg-primary/20 transition-all border border-primary/20 shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">terminal</span>
                Open Intelligence Console
              </button>
            </div>
            <AICopilotChat />
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-8">
            <Deadlines />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DashboardPage;
