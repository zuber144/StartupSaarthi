import React from 'react';
import SchemeCard from './SchemeCard';

const DiscoveryFeed = () => {
  const schemes = [
    {
      title: "Startup India Seed Fund",
      type: "Government Grant",
      match: 98,
      amount: "₹50 Lakhs",
      deadline: "Rolling",
      color: "emerald",
      reasoning: "Your DPIIT recognition and focus on deep-tech align perfectly with the core mandate of this fund. Your current runway and traction metrics place you in the optimal percentile for approval."
    },
    {
      title: "Sequoia Surge",
      type: "Venture Capital",
      match: 92,
      amount: "$3M",
      deadline: "Cohort 10 Open",
      color: "blue",
      reasoning: "Surge has a strong track record of backing SaaS founders in your region. Your recent MoM growth rate of 15% matches their thesis for early-stage scalable businesses."
    }
  ];

  return (
    <div className="flex-1 flex flex-col gap-6">
      <div className="flex justify-between items-end mb-4 border-b border-outline-variant/20 pb-4">
        <div>
          <h1 className="text-4xl font-extrabold text-on-surface mb-2 tracking-tight">Discovery Hub</h1>
          <p className="text-base text-on-surface-variant font-medium">AI-curated funding schemes matching your startup profile.</p>
        </div>
        <div className="flex items-center gap-2 bg-surface-container-low p-1 rounded-full">
          <button className="px-4 py-1.5 rounded-full bg-white shadow-sm text-[13px] font-bold text-on-surface">All Matches</button>
          <button className="px-4 py-1.5 rounded-full hover:bg-white/50 text-[13px] font-medium text-on-surface-variant transition-colors">Saved</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {schemes.map((scheme, i) => (
          <SchemeCard key={i} {...scheme} />
        ))}

        {/* Premium CTA Card */}
        <div className="lg:col-span-2 relative rounded-2xl overflow-hidden bg-surface-container-lowest border border-outline-variant/30 shadow-soft min-h-[300px] flex items-center">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20" 
            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBEJAqh6bNscKQGGC2FHErIEJ6KDotbEs62x7xAT9nj4UvecFpDmp0rhKXfEeIvzM2xV_eCqO_xRm1u2kaw1XomzI47XgmzUbDXuFJIPuDxKFqe8-pEuZU7HQwhnX2Hpdou4BNL1wFpp5v0mPynQzmEriICH9IdH2fj81AuNL1QEr2t-vh2Zis6nvPEBSvpioN5HP_SuRqQJY24cxLLxp_qCKaNcbl4FrxWbokF1GWukHXsLThwbWmlwtTR-0PD45jKFSOuyk_2KSY')" }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent z-0"></div>
          <div className="relative z-10 p-8 md:w-2/3 flex flex-col gap-4">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-amber-50 text-amber-800 px-3 py-1 rounded-full w-fit border border-amber-200">
              <span className="material-symbols-outlined text-[14px]">stars</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">FundAI Pro</span>
            </div>
            <h2 className="text-3xl font-extrabold text-on-surface tracking-tight leading-tight">Unlock Premium Deal Flow Intelligence</h2>
            <p className="text-base text-on-surface-variant max-w-lg leading-relaxed">
              Get access to hidden RFPs, historical success rates of VCs, and direct warm intro pathways. Our predictive models increase your funding likelihood by 3x.
            </p>
            <div className="mt-4 flex items-center gap-4">
              <button className="bg-on-surface text-white font-bold text-[13px] px-6 py-3 rounded-xl shadow-sm hover:bg-black transition-colors">
                Upgrade to Pro
              </button>
              <a className="text-[13px] font-bold text-primary hover:underline underline-offset-4" href="#">Compare Plans</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoveryFeed;
