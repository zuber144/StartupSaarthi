import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ReadinessScore from '../components/analyzer/ReadinessScore';
import PriorityAlerts from '../components/analyzer/PriorityAlerts';
import MetricBreakdown from '../components/analyzer/MetricBreakdown';
import AIRecommendation from '../components/analyzer/AIRecommendation';

const AnalyzerPage = ({ onNavigate, currentPage }) => {
  return (
    <div className="min-h-screen flex flex-col pt-20">
      <Navbar onNavigate={onNavigate} currentPage={currentPage} />
      <main className="flex-grow w-full max-w-[1200px] mx-auto px-6 md:px-12 py-10 md:py-20 flex flex-col gap-8 md:gap-12">
        <header className="flex flex-col md:flex-row justify-between md:items-end gap-4 pb-6 border-b border-outline-variant/20">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-on-surface mb-2 tracking-tight">Funding Readiness</h1>
            <p className="text-sm md:text-base text-on-surface-variant font-medium">Last updated: Today, 09:41 AM</p>
          </div>
          <button className="flex items-center justify-center gap-2 bg-surface-container-low text-on-surface font-bold text-[13px] px-5 py-3 md:py-2.5 rounded-xl border border-outline-variant/30 hover:bg-surface-container-high transition-colors active:scale-95">
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 0" }}>download</span>
            Export Report
          </button>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ReadinessScore score={82} />
          <PriorityAlerts />
        </section>

        <MetricBreakdown />
        
        <AIRecommendation />
      </main>
      <Footer />
    </div>
  );
};

export default AnalyzerPage;
