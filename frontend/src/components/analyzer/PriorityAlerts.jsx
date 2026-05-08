import React from 'react';

const AlertCard = ({ type, title, description, icon, iconBg, textColor, span = false }) => (
  <div className={`bg-white rounded-[20px] p-5 border border-outline-variant/20 shadow-soft flex gap-4 items-start ${span ? 'md:col-span-2' : ''}`}>
    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}>
      <span className={`material-symbols-outlined ${textColor}`} style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
    </div>
    <div className="flex-grow">
      <div className="flex items-center gap-2 mb-1">
        <span className={`text-[10px] font-bold uppercase tracking-widest ${textColor}`}>{type}</span>
        <h3 className="text-lg font-bold text-on-surface leading-tight">{title}</h3>
      </div>
      <p className="text-sm text-on-surface-variant mb-3 font-medium">{description}</p>
      <button className="text-[13px] font-bold text-primary hover:underline flex items-center gap-1 transition-all">
        Action Required <span className="material-symbols-outlined text-sm">arrow_forward</span>
      </button>
    </div>
  </div>
);

const PriorityAlerts = () => {
  return (
    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
      <h2 className="col-span-full text-[10px] text-outline uppercase font-bold tracking-widest mb-2">ATTENTION NEEDED</h2>
      <AlertCard 
        type="Critical"
        title="Legal"
        description="Incomplete IP assignment for 2 early contributors."
        icon="gavel"
        iconBg="bg-error-container/50"
        textColor="text-error"
      />
      <AlertCard 
        type="Warning"
        title="Financial"
        description="Burn rate exceeds 18-month runway projection."
        icon="account_balance"
        iconBg="bg-amber-50"
        textColor="text-amber-600"
      />
      <AlertCard 
        type="Notice"
        title="Team"
        description="Identified a gap in technical advisory board."
        icon="groups"
        iconBg="bg-surface-container-low"
        textColor="text-on-surface-variant"
        span={true}
      />
    </div>
  );
};

export default PriorityAlerts;
