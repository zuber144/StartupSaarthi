import React from 'react';

const Metrics = () => {
  const metrics = [
    { icon: 'account_tree', val: '1,500+', label: 'Schemes Matched' },
    { icon: 'payments', val: '$500M+', label: 'Capital Identified' },
    { icon: 'groups', val: '10k+', label: 'Founders Supported' },
    { icon: 'description', val: '50k+', label: 'Documents Generated' },
  ];

  return (
    <section className="py-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <div key={i} className="bg-surface-container-low rounded-2xl p-8 border-subtle">
            <span className="material-symbols-outlined text-primary mb-4 text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>{m.icon}</span>
            <h3 className="text-4xl font-bold text-on-surface mb-2">{m.val}</h3>
            <p className="text-[13px] text-on-surface-variant uppercase tracking-wider font-medium">{m.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Metrics;
