import React from 'react';

const MetricItem = ({ label, status, progress, color = "primary" }) => {
  const colorMap = {
    primary: "bg-primary",
    amber: "bg-amber-400",
    error: "bg-error"
  };

  const textColorMap = {
    primary: "text-primary",
    amber: "text-amber-600",
    error: "text-error"
  };

  return (
    <div>
      <div className="flex justify-between text-[11px] font-bold mb-1.5 uppercase tracking-wider">
        <span className="text-on-surface">{label}</span>
        <span className={textColorMap[color]}>{status}</span>
      </div>
      <div className="h-1.5 w-full bg-surface-container-low rounded-full overflow-hidden border border-outline-variant/10">
        <div className={`h-full ${colorMap[color]} rounded-full transition-all duration-700`} style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
};

const MetricColumn = ({ icon, title, score, children }) => (
  <div className="flex flex-col gap-6">
    <div className="flex items-center gap-3 border-b border-outline-variant/10 pb-3">
      <span className="material-symbols-outlined text-primary text-[28px]">{icon}</span>
      <h3 className="text-xl font-bold text-on-surface">{title}</h3>
      <span className="ml-auto text-[11px] font-bold bg-surface-container-low px-2 py-1 rounded-md text-on-surface-variant">{score}/100</span>
    </div>
    <div className="space-y-6">
      {children}
    </div>
  </div>
);

const MetricBreakdown = () => {
  return (
    <section>
      <h2 className="text-[10px] text-outline uppercase font-bold tracking-widest mb-6 border-b border-outline-variant/20 pb-2">METRIC BREAKDOWN</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <MetricColumn icon="query_stats" title="Financial" score={88}>
          <MetricItem label="Revenue Quality" status="Excellent" progress={95} />
          <MetricItem label="Unit Economics" status="Good" progress={80} />
          <MetricItem label="Cap Table" status="Review" progress={60} color="amber" />
        </MetricColumn>
        
        <MetricColumn icon="engineering" title="Team" score={76}>
          <MetricItem label="Founder Exp" status="Excellent" progress={90} />
          <MetricItem label="Key Roles" status="Good" progress={75} />
          <MetricItem label="Advisory Board" status="Required" progress={40} color="error" />
        </MetricColumn>
        
        <MetricColumn icon="description" title="Legal" score={65}>
          <MetricItem label="Incorporation" status="Complete" progress={100} />
          <MetricItem label="Data Room" status="In Progress" progress={55} />
          <MetricItem label="IP Assignments" status="Required" progress={30} color="error" />
        </MetricColumn>
      </div>
    </section>
  );
};

export default MetricBreakdown;
