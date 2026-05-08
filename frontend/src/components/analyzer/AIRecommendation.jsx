import React from 'react';

const AIRecommendation = () => {
  return (
    <section className="mt-8">
      <div className="bg-[#1D1D1F] rounded-[24px] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden group">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none group-hover:bg-primary/30 transition-all duration-700"></div>
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-[#00ffff]/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-[#00ffff]/20 transition-all duration-700"></div>
        
        <div className="z-10 flex-grow">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-[#00ffff] animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#00ffff]">AI STRATEGY</span>
          </div>
          <h3 className="text-3xl font-extrabold text-white mb-3 tracking-tight">Accelerate your data room prep.</h3>
          <p className="text-base text-gray-300 max-w-2xl leading-relaxed font-medium">
            FundAI detected missing IP assignment documents and incomplete cap table formatting. We can auto-generate standard NDAs, IP assignments, and format your cap table to VC standards in minutes.
          </p>
        </div>
        
        <div className="z-10 shrink-0 w-full md:w-auto">
          <button className="w-full md:w-auto bg-white text-black font-bold text-[13px] px-8 py-4 rounded-xl hover:bg-gray-100 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
            Start Document Workflow
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default AIRecommendation;
