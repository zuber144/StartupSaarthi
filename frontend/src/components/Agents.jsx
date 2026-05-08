import React from 'react';

const Agents = () => {
  return (
    <section className="py-20">
      <div className="text-center mb-16">
        <h2 className="font-display text-4xl md:text-5xl text-on-surface mb-4 font-bold">The Multi-Agent Advantage</h2>
        <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
          A synchronized ecosystem of specialized AI agents working tirelessly to optimize your funding strategy from discovery to deployment.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-2xl p-8 border-subtle soft-shadow flex flex-col justify-between group hover:border-primary/30 transition-colors h-[250px]">
          <div>
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>travel_explore</span>
            </div>
            <h3 className="text-2xl font-semibold text-on-surface mb-2">Research Agent</h3>
            <p className="text-on-surface-variant max-w-md">Continuously scans global databases to identify the most relevant grants, VC funds, and debt options.</p>
          </div>
        </div>
        <div className="bg-surface-container-low rounded-2xl p-8 border-subtle flex flex-col justify-between group hover:border-primary/30 transition-colors h-[250px]">
          <div>
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>fact_check</span>
            </div>
            <h3 className="text-2xl font-semibold text-on-surface mb-2">Eligibility</h3>
            <p className="text-on-surface-variant">Instant qualification scoring against 100+ parameters.</p>
          </div>
        </div>
        <div className="bg-surface-container-low rounded-2xl p-8 border-subtle flex flex-col justify-between group hover:border-primary/30 transition-colors h-[250px]">
          <div>
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>strategy</span>
            </div>
            <h3 className="text-2xl font-semibold text-on-surface mb-2">Strategy</h3>
            <p className="text-on-surface-variant">Optimal sequencing of capital acquisition.</p>
          </div>
        </div>
        <div className="md:col-span-2 bg-white rounded-2xl p-8 border-subtle soft-shadow flex flex-col justify-between group hover:border-primary/30 transition-colors h-[250px]">
          <div>
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>draw</span>
            </div>
            <h3 className="text-2xl font-semibold text-on-surface mb-2">Document Agent</h3>
            <p className="text-on-surface-variant max-w-md">Automates the creation of pitch decks, financial models, and application forms tailored to specific investor profiles.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Agents;
