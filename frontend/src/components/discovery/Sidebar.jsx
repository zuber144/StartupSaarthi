import React from 'react';

const Sidebar = () => {
  return (
    <aside className="w-64 flex-shrink-0 flex flex-col gap-8 hidden md:flex">
      <div>
        <h2 className="font-display text-2xl mb-4 text-on-surface font-semibold">Filters</h2>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
          <input 
            className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-transparent rounded-xl font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
            placeholder="Search schemes..." 
            type="text"
          />
        </div>
      </div>
      
      <div className="flex flex-col gap-2">
        <h3 className="text-[12px] text-outline uppercase tracking-wider mb-2 font-bold">Category</h3>
        {[
          { label: 'Govt Grants', checked: true },
          { label: 'Venture Capital', checked: false },
          { label: 'Incubation', checked: false },
          { label: 'Angel Networks', checked: false },
        ].map((cat, i) => (
          <label key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-container-low cursor-pointer transition-colors group">
            <div className={`w-5 h-5 rounded border border-outline-variant group-hover:border-primary flex items-center justify-center ${cat.checked ? 'bg-primary text-white border-primary' : ''}`}>
              {cat.checked && <span className="material-symbols-outlined text-[14px]">check</span>}
            </div>
            <span className="text-base text-on-surface font-medium">{cat.label}</span>
          </label>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-[12px] text-outline uppercase tracking-wider mb-2 font-bold">Funding Stage</h3>
        {[
          { label: 'Pre-Seed', checked: false },
          { label: 'Seed', checked: true },
          { label: 'Series A', checked: false },
        ].map((stage, i) => (
          <label key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-container-low cursor-pointer transition-colors group">
            <div className={`w-5 h-5 rounded border border-outline-variant group-hover:border-primary flex items-center justify-center ${stage.checked ? 'bg-primary text-white border-primary' : ''}`}>
              {stage.checked && <span className="material-symbols-outlined text-[14px]">check</span>}
            </div>
            <span className="text-base text-on-surface font-medium">{stage.label}</span>
          </label>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
