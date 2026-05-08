import React from 'react';

const InvestorMatch = () => {
  return (
    <div className="bg-white border border-outline-variant/30 rounded-2xl p-0 shadow-soft overflow-hidden flex flex-col md:flex-row group">
      <div className="md:w-1/3 bg-surface-container-high relative h-48 md:h-auto overflow-hidden">
        <img 
          alt="Office Collaboration" 
          className="w-full h-full object-cover opacity-80 mix-blend-multiply group-hover:scale-105 transition-transform duration-700" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0jT9S6Fs9lS2z8-ZibQERKOWJfx4AxK1QrRIA_mrDA1oI1NviKR6fc8fSmipEqLQn-SgLuiQjMkIBx3D2h4s9Q6uQhb5RrexPufSKPzkpz9Zmx7p7p4H3khhuc3nM9H4iOoYb5elO0-y7c47QMLhfO4htXTgNcLMDFFuPcxkKTMf7a9Jgqmx0EJCP9RkhTdwraSAFUxi-HftUQEq7SbZHU4dkc3UoxToXedhjHSjCI_vrx01M9bVVYUSUQIvZoXh8NfZ1FAp1Op8" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white md:hidden"></div>
        <div className="absolute inset-0 bg-gradient-to-l from-white to-transparent hidden md:block"></div>
      </div>
      
      <div className="p-8 md:w-2/3 flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>radar</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">AI RECOMMENDATION</span>
        </div>
        <h2 className="text-2xl font-extrabold text-on-surface mb-3 tracking-tight">New High-Confidence Investor Match</h2>
        <p className="text-base text-on-surface-variant mb-6 max-w-xl font-medium leading-relaxed">
          Based on your recent milestone updates and sector focus, <strong className="text-on-surface">Apex Ventures</strong> is currently actively deploying capital in Seed-stage AI productivity tools.
        </p>
        <div className="flex items-center gap-4">
          <button className="btn-primary px-6 py-3 rounded-xl text-[13px] font-bold shadow-md shadow-primary/20">
            Analyze Match
          </button>
          <button className="bg-surface-container-low text-on-surface font-bold text-[13px] px-6 py-3 rounded-xl border border-outline-variant/30 hover:bg-surface-container-high transition-colors">
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvestorMatch;
