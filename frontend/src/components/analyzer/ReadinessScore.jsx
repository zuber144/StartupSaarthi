import React from 'react';

const ReadinessScore = ({ score = 82 }) => {
  const dashArray = 283;
  const dashOffset = dashArray - (dashArray * score) / 100;

  return (
    <div className="lg:col-span-1 bg-white rounded-[24px] p-8 border border-outline-variant/20 shadow-soft flex flex-col items-center justify-center relative overflow-hidden">
      <h2 className="text-[10px] text-outline uppercase font-bold tracking-widest absolute top-6 left-6">OVERALL SCORE</h2>
      <div className="relative w-48 h-48 mt-8 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" fill="none" r="45" stroke="#F5F5F7" strokeWidth="8"></circle>
          <circle 
            className="transition-all duration-1000 ease-out" 
            cx="50" cy="50" fill="none" r="45" 
            stroke="#0066CC" 
            strokeDasharray={dashArray} 
            strokeDashoffset={dashOffset} 
            strokeLinecap="round" 
            strokeWidth="8"
          ></circle>
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-6xl font-extrabold text-on-surface leading-none">{score}</span>
          <span className="text-[13px] text-on-surface-variant font-medium mt-1">/100</span>
        </div>
      </div>
      <div className="mt-8 text-center">
        <p className="text-base text-on-surface font-medium"><strong>Top 15%</strong> of similar stage startups</p>
        <p className="text-[13px] text-emerald-600 font-bold mt-1">+4 points since last week</p>
      </div>
    </div>
  );
};

export default ReadinessScore;
