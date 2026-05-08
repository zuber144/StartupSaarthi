import React, { useState, useEffect } from 'react';
import SchemeCard from './SchemeCard';
import { schemesAPI } from '../../services/api';

const DiscoveryFeed = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Color rotation for cards
  const colors = ['emerald', 'blue', 'violet', 'amber', 'rose', 'cyan'];

  useEffect(() => {
    loadSchemes();
  }, []);

  const loadSchemes = async (query = '') => {
    setLoading(true);
    try {
      const data = await schemesAPI.list(query);
      const mapped = data.map((scheme, idx) => ({
        id: scheme.id,
        title: scheme.scheme_name,
        type: scheme.ministry || 'Government Scheme',
        match: Math.floor(Math.random() * 30) + 70, // Placeholder until AI scores
        amount: scheme.funding_amount 
          ? `₹${(scheme.funding_amount / 100000).toFixed(0)} Lakhs` 
          : 'Variable',
        deadline: scheme.deadline || 'Rolling',
        color: colors[idx % colors.length],
        reasoning: scheme.description || 'AI analysis pending...',
        link: scheme.application_link,
      }));
      setSchemes(mapped);
    } catch (err) {
      console.error('Failed to load schemes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadSchemes(searchQuery);
  };

  return (
    <div className="flex-1 flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-4 border-b border-outline-variant/20 pb-4 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-on-surface mb-2 tracking-tight">Discovery Hub</h1>
          <p className="text-base text-on-surface-variant font-medium">
            {loading ? 'Loading schemes...' : `${schemes.length} AI-curated funding schemes matching your startup profile.`}
          </p>
        </div>
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search schemes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:border-primary transition-all w-48"
          />
          <button type="submit" className="px-4 py-2 rounded-xl bg-primary text-white text-[13px] font-bold hover:bg-primary/90 transition-colors">
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-on-surface-variant">Discovering schemes...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {schemes.map((scheme, i) => (
            <SchemeCard key={scheme.id || i} {...scheme} />
          ))}

          {schemes.length === 0 && (
            <div className="lg:col-span-2 text-center py-16">
              <span className="material-symbols-outlined text-5xl text-outline mb-4">search_off</span>
              <h3 className="text-xl font-bold text-on-surface mb-2">No schemes found</h3>
              <p className="text-sm text-on-surface-variant">Try a different search query or clear your filters.</p>
            </div>
          )}

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
                <span className="text-[10px] font-bold uppercase tracking-widest">Startup Saarthi Pro</span>
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
      )}
    </div>
  );
};

export default DiscoveryFeed;
