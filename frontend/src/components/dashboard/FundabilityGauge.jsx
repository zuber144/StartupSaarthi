import React from 'react';

const FundabilityGauge = ({ score = 75 }) => {
  const dashArray = 282.7;
  const dashOffset = dashArray - (dashArray * score) / 100;

  return (
    <div className="bg-white border border-outline-variant/30 rounded-2xl p-6 shadow-soft flex flex-col md:flex-row gap-6 items-center">
      <div className="relative w-40 h-40 flex-shrink-0">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" fill="none" r="45" stroke="#e2e2e4" strokeWidth="8"></circle>
          <circle 
            cx="50" cy="50" fill="none" r="45" 
            stroke="#0066cc" 
            strokeDasharray={dashArray} 
            strokeDashoffset={dashOffset} 
            strokeLinecap="round" 
            strokeWidth="8"
            className="transition-all duration-1000 ease-out"
          ></circle>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-extrabold text-on-surface">{score}</span>
          <span className="text-[13px] text-on-surface-variant font-medium">/ 100</span>
        </div>
      </div>
      <div className="flex-grow">
        <h2 className="text-2xl font-bold text-on-surface mb-2">Fundability Score</h2>
        <p className="text-base text-on-surface-variant mb-4 font-medium">You are well-positioned for Seed funding. Improving your financial projections will push your score above 85.</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-on-surface font-medium">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <span className="text-sm">Strong team background</span>
          </div>
          <div className="flex items-center gap-2 text-on-surface font-medium">
            <span className="material-symbols-outlined text-outline" style={{ fontVariationSettings: "'FILL' 1" }}>pending</span>
            <span className="text-sm">Refine Go-To-Market strategy</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundabilityGauge;
