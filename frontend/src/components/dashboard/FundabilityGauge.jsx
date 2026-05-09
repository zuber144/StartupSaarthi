import React, { useState } from 'react';

const FundabilityGauge = ({ score = 0, reasoning = null }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const dashArray = 282.7;
  const safeScore = score || 0;
  const dashOffset = dashArray - (dashArray * safeScore) / 100;
  const color = safeScore >= 70 ? '#22c55e' : safeScore >= 45 ? '#f59e0b' : '#ef4444';

  return (
    <div className="bg-white border border-outline-variant/30 rounded-2xl p-6 shadow-soft flex flex-col md:flex-row gap-6 items-center">
      <div className="relative w-40 h-40 flex-shrink-0">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" fill="none" r="45" stroke="#e2e2e4" strokeWidth="8" />
          <circle
            cx="50" cy="50" fill="none" r="45"
            stroke={color}
            strokeDasharray={dashArray}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            strokeWidth="8"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-extrabold text-on-surface">{safeScore > 0 ? safeScore : '—'}</span>
          <span className="text-[13px] text-on-surface-variant font-medium">{safeScore > 0 ? '/ 100' : 'Not run'}</span>
        </div>
      </div>
      <div className="flex-grow">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-2xl font-bold text-on-surface">Fundability Score</h2>
          {reasoning && (
            <span
              className="relative"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <span className="material-symbols-outlined text-primary cursor-help text-[20px]">auto_awesome</span>
              {showTooltip && (
                <div className="absolute z-50 left-6 bottom-0 bg-[#1D1D1F] text-white text-xs rounded-xl p-3 w-72 shadow-2xl">
                  <strong className="text-primary">AI Reasoning:</strong> {reasoning}
                </div>
              )}
            </span>
          )}
        </div>
        <p className="text-base text-on-surface-variant mb-4 font-medium">
          {safeScore > 0
            ? reasoning || 'AI analysis complete. Review the Analyzer for detailed scheme breakdown.'
            : 'Click "Run Full AI Analysis" above to compute your live fundability score.'}
        </p>
        {safeScore > 0 && (
          <div className="flex items-center gap-2 text-on-surface font-medium">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <span className="text-sm">Score based on eligibility + strategy analysis</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FundabilityGauge;
