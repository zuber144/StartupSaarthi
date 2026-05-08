import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ProfilePage = ({ onNavigate, currentPage }) => {
  const [activeTab, setActiveTab] = React.useState('startup');

  const tabs = [
    { id: 'startup', label: 'Active Startup', icon: 'rocket_launch' },
    { id: 'projects', label: 'My Startups', icon: 'account_tree' },
    { id: 'integrations', label: 'Integrations', icon: 'hub' },
    { id: 'personal', label: 'Personal Details', icon: 'person' },
    { id: 'funding', label: 'Funding History', icon: 'payments' },
    { id: 'settings', label: 'Security', icon: 'shield_lock' },
  ];

  return (
    <div className="min-h-screen flex flex-col pt-24 bg-surface-container-lowest font-body-md">
      <Navbar onNavigate={onNavigate} currentPage={currentPage} />

      <main className="flex-grow max-w-[1200px] mx-auto w-full px-4 md:px-12 pb-20">
        {/* Profile Header */}
        <div className="relative mb-8 md:mb-12">
          <div className="h-32 md:h-48 w-full bg-gradient-to-r from-primary to-primary-container rounded-2xl md:rounded-3xl overflow-hidden shadow-lg">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute -right-20 -top-20 w-[400px] h-[400px] bg-white rounded-full blur-[100px]"></div>
            </div>
          </div>
          
          <div className="absolute -bottom-6 md:-bottom-10 left-6 md:left-10 flex items-end gap-4 md:gap-6">
            <div className="w-20 h-20 md:w-32 md:h-32 rounded-2xl md:rounded-3xl bg-white p-1 md:p-1.5 shadow-xl border border-outline-variant/30">
              <div className="w-full h-full rounded-xl md:rounded-2xl bg-surface-container overflow-hidden border border-outline-variant/10">
                <img 
                  alt="Profile" 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuApBC330vU6wL_zz5esMJt3PFNy5QHZwvTWeasKwinHOROqxLXlTdawTUQ3rV1m3lSsaYUHGB4FkU40awd9guHdyeJQIEgL8wKmkJt6GdXEnBJfu7sIfgdDiwvqminqWJid-gnYw7xTRXI2QIFrUwpaZF5JU_Ql6Nfbmn0SG_3ePvNFZsn0KZJ5Om-4t9M5fzOFbnKag_Sh0Aj-Y-mawKXW4arHcB388ZEq_DwMgttFedhwv1qONiKwdwZcuvkSI31LgEnvDQ9E-Go" 
                />
              </div>
            </div>
            <div className="mb-2 md:mb-4">
              <h1 className="text-xl md:text-3xl font-extrabold text-on-surface tracking-tight leading-none mb-1">Aditya Sharma</h1>
              <p className="text-xs md:text-base text-on-surface-variant font-medium">Founder at EcoCharge India</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 md:gap-12 mt-12 md:mt-16">
          {/* Sidebar Tabs */}
          <aside className="lg:col-span-1">
            <nav className="flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 md:gap-4 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl transition-all font-bold text-xs md:text-sm whitespace-nowrap lg:whitespace-normal ${
                    activeTab === tab.id 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]' 
                    : 'text-on-surface-variant hover:bg-surface-container-low'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px] md:text-[24px]">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
            
            <div className="hidden lg:block mt-12 p-6 bg-surface-container-low rounded-3xl border border-outline-variant/20">
              <h4 className="text-[11px] font-bold text-outline uppercase tracking-widest mb-4">Profile Strength</h4>
              <div className="w-full h-2 bg-white rounded-full overflow-hidden mb-3">
                <div className="h-full bg-primary w-[85%] rounded-full"></div>
              </div>
              <p className="text-[13px] text-on-surface-variant font-medium">Your profile is 85% complete. Add your funding history to reach 100%.</p>
            </div>
          </aside>

          {/* Content Area */}
          <section className="lg:col-span-3 bg-white rounded-2xl md:rounded-3xl p-6 md:p-10 shadow-soft border border-outline-variant/20">
            {activeTab === 'projects' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-2xl font-extrabold text-on-surface mb-1 tracking-tight">Your Startup Portfolio</h2>
                    <p className="text-sm text-on-surface-variant font-medium">Manage and switch between your different ventures.</p>
                  </div>
                  <button className="flex items-center gap-2 bg-primary/10 text-primary px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-primary/20 transition-all border border-primary/20">
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    New Idea
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Project Card 1 */}
                  <div className="group border-2 border-primary bg-primary/[0.02] rounded-3xl p-6 transition-all hover:shadow-lg relative overflow-hidden">
                    <div className="absolute top-4 right-4 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest">Active</div>
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-white shadow-soft flex items-center justify-center border border-outline-variant/20 text-2xl font-extrabold text-primary">
                        E
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-on-surface group-hover:text-primary transition-colors">EcoCharge India</h3>
                        <p className="text-[13px] text-on-surface-variant font-medium">EV Infrastructure • Seed Stage</p>
                      </div>
                    </div>
                    <p className="text-sm text-on-surface-variant mb-6 line-clamp-2 font-medium">Building India's largest autonomous EV charging network powered by AI optimization.</p>
                    <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10">
                      <span className="text-[11px] font-bold text-outline uppercase tracking-wider">Fundability: 75%</span>
                      <button className="text-[13px] font-bold text-primary hover:underline">Manage OS</button>
                    </div>
                  </div>

                  {/* Project Card 2 */}
                  <div className="group border-2 border-transparent bg-surface-container-low/50 rounded-3xl p-6 transition-all hover:border-outline-variant/30 hover:bg-white relative overflow-hidden">
                    <div className="flex items-start gap-4 mb-6 text-outline group-hover:text-on-surface transition-colors">
                      <div className="w-14 h-14 rounded-2xl bg-white shadow-soft flex items-center justify-center border border-outline-variant/20 text-2xl font-extrabold opacity-60">
                        A
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">AgriFlow AI</h3>
                        <p className="text-[13px] font-medium opacity-80">Agritech • Ideation Phase</p>
                      </div>
                    </div>
                    <p className="text-sm text-on-surface-variant mb-6 line-clamp-2 font-medium">Next-gen irrigation management using satellite data and predictive LLMs.</p>
                    <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10">
                      <span className="text-[11px] font-bold text-outline uppercase tracking-wider">Readiness: 40%</span>
                      <button className="text-[13px] font-bold text-on-surface-variant hover:text-primary transition-colors">Switch Project</button>
                    </div>
                  </div>

                  {/* Project Card 3 */}
                  <div className="group border-2 border-transparent bg-surface-container-low/50 rounded-3xl p-6 transition-all hover:border-outline-variant/30 hover:bg-white relative overflow-hidden">
                    <div className="flex items-start gap-4 mb-6 text-outline group-hover:text-on-surface transition-colors">
                      <div className="w-14 h-14 rounded-2xl bg-white shadow-soft flex items-center justify-center border border-outline-variant/20 text-2xl font-extrabold opacity-60">
                        S
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">SafeRoute</h3>
                        <p className="text-[13px] font-medium opacity-80">Logistics • MVP Stage</p>
                      </div>
                    </div>
                    <p className="text-sm text-on-surface-variant mb-6 line-clamp-2 font-medium">Dynamic route optimization for high-value logistics in tier-2 Indian cities.</p>
                    <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10">
                      <span className="text-[11px] font-bold text-outline uppercase tracking-wider">Readiness: 62%</span>
                      <button className="text-[13px] font-bold text-on-surface-variant hover:text-primary transition-colors">Switch Project</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'startup' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-extrabold text-on-surface mb-8 tracking-tight">Startup Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-outline uppercase tracking-wider">Startup Name</label>
                    <input type="text" defaultValue="EcoCharge India" className="w-full bg-surface-container-low rounded-xl px-4 py-3 font-medium border border-outline-variant/20 focus:border-primary outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-outline uppercase tracking-wider">Legal Entity Type</label>
                    <input type="text" defaultValue="Private Limited" className="w-full bg-surface-container-low rounded-xl px-4 py-3 font-medium border border-outline-variant/20 focus:border-primary outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-outline uppercase tracking-wider">Industry / Sector</label>
                    <input type="text" defaultValue="EV Infrastructure" className="w-full bg-surface-container-low rounded-xl px-4 py-3 font-medium border border-outline-variant/20 focus:border-primary outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-outline uppercase tracking-wider">Operating Stage</label>
                    <input type="text" defaultValue="Early Growth (Series A Prep)" className="w-full bg-surface-container-low rounded-xl px-4 py-3 font-medium border border-outline-variant/20 focus:border-primary outline-none transition-all" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[13px] font-bold text-outline uppercase tracking-wider">One-line Pitch</label>
                    <textarea rows="3" defaultValue="Building India's largest autonomous EV charging network powered by AI optimization." className="w-full bg-surface-container-low rounded-xl px-4 py-3 font-medium border border-outline-variant/20 focus:border-primary outline-none transition-all resize-none"></textarea>
                  </div>
                </div>
                <div className="mt-10 flex justify-end">
                  <button className="btn-primary px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all active:scale-95">Save Changes</button>
                </div>
              </div>
            )}

            {activeTab === 'integrations' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-extrabold text-on-surface mb-1 tracking-tight">External Integrations</h2>
                <p className="text-sm text-on-surface-variant mb-8 font-medium">Connect your platforms to power Startup Saarthi's AI agents with real-time data.</p>
                
                <div className="space-y-4">
                  {[
                    { name: 'GitHub', icon: 'code', desc: 'Sync your repositories for technical readiness analysis.', connected: true, color: 'bg-black' },
                    { name: 'Stripe', icon: 'payments', desc: 'Import revenue data for investor-ready financial reports.', connected: false, color: 'bg-[#635BFF]' },
                    { name: 'LinkedIn', icon: 'group', desc: 'Pull team data and market presence metrics.', connected: false, color: 'bg-[#0077B5]' },
                    { name: 'Crunchbase', icon: 'business_center', desc: 'Benchmark against competitors in your industry.', connected: false, color: 'bg-[#0284C7]' }
                  ].map((platform) => (
                    <div key={platform.name} className="flex items-center justify-between p-6 border border-outline-variant/30 rounded-2xl hover:bg-surface-container-low transition-colors">
                      <div className="flex items-center gap-5">
                        <div className={`w-12 h-12 rounded-xl ${platform.color} text-white flex items-center justify-center`}>
                          <span className="material-symbols-outlined">{platform.icon}</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-on-surface">{platform.name}</h3>
                          <p className="text-[13px] text-on-surface-variant font-medium">{platform.desc}</p>
                        </div>
                      </div>
                      <button className={`px-5 py-2 rounded-xl font-bold text-xs transition-all ${
                        platform.connected 
                        ? 'bg-success/10 text-success border border-success/20' 
                        : 'bg-primary text-white shadow-md shadow-primary/20'
                      }`}>
                        {platform.connected ? 'Connected' : 'Connect'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'personal' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-extrabold text-on-surface mb-8 tracking-tight">Personal Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-on-surface-variant uppercase tracking-wider">Full Name</label>
                    <input 
                      type="text" 
                      defaultValue="Adnan Zuber"
                      className="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary/50 transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-on-surface-variant uppercase tracking-wider">Email Address</label>
                    <input 
                      type="email" 
                      defaultValue="adnan@startupsaarthi.ai"
                      className="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary/50 transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-on-surface-variant uppercase tracking-wider">Professional Bio</label>
                    <textarea 
                      rows="4"
                      defaultValue="Serial entrepreneur with a passion for sustainable tech and AI-driven infrastructure. Building the future of EV in India."
                      className="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary/50 transition-all font-medium resize-none"
                    />
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[13px] font-bold text-on-surface-variant uppercase tracking-wider">LinkedIn Profile</label>
                      <div className="flex items-center gap-3 bg-surface-container-low border border-outline-variant/30 rounded-2xl px-5 py-4">
                        <span className="material-symbols-outlined text-outline">link</span>
                        <input type="text" defaultValue="linkedin.com/in/adnanzuber" className="bg-transparent w-full focus:outline-none font-medium" />
                      </div>
                    </div>
                    <button className="w-full btn-primary py-4 rounded-2xl font-bold">Save Changes</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'funding' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-extrabold text-on-surface tracking-tight">Funding History</h2>
                  <button className="text-primary font-bold text-sm hover:underline">+ Add Round</button>
                </div>
                <div className="space-y-4">
                  {[
                    { round: 'Seed Round', amount: '$500,000', date: 'Oct 2025', status: 'Closed', investors: 3 },
                    { round: 'Pre-Seed', amount: '$150,000', date: 'May 2025', status: 'Closed', investors: 1 },
                  ].map((round, idx) => (
                    <div key={idx} className="p-6 border border-outline-variant/30 rounded-3xl flex items-center justify-between hover:bg-surface-container-low transition-all">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-success/10 text-success flex items-center justify-center">
                          <span className="material-symbols-outlined">payments</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-on-surface">{round.round}</h3>
                          <p className="text-[13px] text-on-surface-variant font-medium">{round.date} • {round.investors} Investors</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg text-on-surface">{round.amount}</div>
                        <div className="text-[11px] font-bold text-success uppercase tracking-widest">{round.status}</div>
                      </div>
                    </div>
                  ))}
                  <div className="p-10 border-2 border-dashed border-outline-variant/30 rounded-3xl flex flex-col items-center justify-center text-center">
                    <span className="material-symbols-outlined text-outline text-4xl mb-3">add_circle</span>
                    <p className="text-sm font-bold text-on-surface-variant">Planning a new round?<br/><span className="text-primary cursor-pointer">Start fundraising workflow</span></p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-center py-20">
                <span className="material-symbols-outlined text-primary text-6xl mb-4 opacity-20">shield_lock</span>
                <h3 className="text-xl font-bold text-on-surface">Security settings coming soon</h3>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;
