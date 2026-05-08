import React from 'react';

const Deadlines = () => {
  const deadlines = [
    { month: 'OCT', day: '15', title: 'Y Combinator Application', desc: 'Winter 2025 Batch', critical: true },
    { month: 'NOV', day: '02', title: 'Sequoia Pitch Meeting', desc: 'Prepare financial model', critical: false },
  ];

  return (
    <div className="bg-white border border-outline-variant/30 rounded-2xl p-6 shadow-soft">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-on-surface">Upcoming Deadlines</h3>
        <span className="material-symbols-outlined text-outline">event</span>
      </div>
      <ul className="space-y-4">
        {deadlines.map((item, i) => (
          <li key={i} className="flex items-start gap-4 pb-4 border-b border-outline-variant/10 last:border-0 last:pb-0">
            <div className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center flex-shrink-0 ${item.critical ? 'bg-error-container/30 text-error' : 'bg-surface-container-high text-on-surface-variant'}`}>
              <span className="text-[10px] font-bold uppercase tracking-widest">{item.month}</span>
              <span className="text-lg font-extrabold leading-none">{item.day}</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-on-surface mb-1">{item.title}</h4>
              <p className="text-[13px] text-on-surface-variant font-medium">{item.desc}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Deadlines;
