import React from 'react';

const SchemeCard = ({ title, type, match, amount, deadline, reasoning, color = "emerald" }) => {
  const colorMap = {
    emerald: "from-emerald-400 to-emerald-500",
    blue: "from-blue-400 to-blue-500",
    amber: "from-amber-400 to-amber-500"
  };

  const iconColorMap = {
    emerald: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600"
  };

  const matchColorMap = {
    emerald: "text-emerald-600",
    blue: "text-primary-container",
    amber: "text-amber-600"
  };

  return (
    <div className="bg-white border border-outline-variant/30 rounded-2xl p-6 shadow-soft hover:shadow-lg transition-all duration-300 flex flex-col h-full group relative overflow-hidden">
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${colorMap[color]}`}></div>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconColorMap[color]}`}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              {type === 'Government Grant' ? 'account_balance' : 'rocket_launch'}
            </span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-on-surface">{title}</h3>
            <p className="text-[13px] text-on-surface-variant font-medium">{type}</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className={`text-2xl font-bold tracking-tight ${matchColorMap[color]}`}>{match}%</span>
          <span className="text-[10px] text-outline uppercase font-bold tracking-widest">Match</span>
        </div>
      </div>
      
      <div className="flex gap-4 mb-6">
        <div className="flex-1 bg-surface-container-low p-3 rounded-xl border border-outline-variant/20">
          <span className="block text-[10px] text-outline uppercase font-bold mb-1">Funding Up To</span>
          <span className="text-base text-on-surface font-bold">{amount}</span>
        </div>
        <div className="flex-1 bg-surface-container-low p-3 rounded-xl border border-outline-variant/20">
          <span className="block text-[10px] text-outline uppercase font-bold mb-1">Deadline</span>
          <span className="text-base text-on-surface font-bold">{deadline}</span>
        </div>
      </div>
      
      <div className="mb-6 flex-1">
        <h4 className="text-[13px] text-on-surface font-bold mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-base text-primary">auto_awesome</span>
          AI Reasoning
        </h4>
        <p className="text-sm text-on-surface-variant leading-relaxed bg-surface-container-low/50 p-4 rounded-xl border border-outline-variant/10 italic">
          "{reasoning}"
        </p>
      </div>
      
      <div className="flex gap-3 mt-auto">
        <button className="flex-1 bg-surface-container-low text-on-surface font-bold text-[13px] px-4 py-2.5 rounded-xl border border-outline-variant/30 hover:bg-surface-container-high transition-colors">
          Save
        </button>
        <button className="flex-1 btn-primary text-[13px] px-4 py-2.5 rounded-xl font-bold">
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default SchemeCard;
