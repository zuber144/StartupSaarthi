import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { startupsAPI } from '../services/api';

const ProfilePage = ({ onNavigate, currentPage, user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('startup');
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Onboarding state
  const [onboardingData, setOnboardingData] = useState({
    startup_name: '',
    domain: '',
    stage: 'Ideation',
    location: '',
    business_idea: ''
  });

  useEffect(() => {
    fetchStartups();
  }, []);

  const fetchStartups = async () => {
    try {
      const data = await startupsAPI.list();
      setStartups(data);
    } catch (err) {
      console.error('Failed to fetch startups', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardingSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await startupsAPI.create(onboardingData);
      await fetchStartups();
    } catch (err) {
      alert('Failed to save startup details. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'startup', label: 'Active Startup', icon: 'rocket_launch' },
    { id: 'projects', label: 'My Startups', icon: 'account_tree' },
    { id: 'personal', label: 'Personal Details', icon: 'person' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-container-lowest pt-24">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // ONBOARDING VIEW (If user has no startups yet)
  if (startups.length === 0) {
    return (
      <div className="min-h-screen flex flex-col justify-center py-12 bg-surface-container-lowest font-body-md">
        <main className="w-full max-w-[800px] mx-auto px-4 md:px-12">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-soft border border-outline-variant/20">
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-primary text-4xl">rocket_launch</span>
              </div>
              <h1 className="text-3xl font-extrabold text-on-surface mb-3 tracking-tight">Welcome to Startup Saarthi!</h1>
              <p className="text-on-surface-variant font-medium text-lg">Let's set up your first startup profile to get personalized AI funding strategies.</p>
            </div>

            <form onSubmit={handleOnboardingSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-outline uppercase tracking-wider">Startup Name</label>
                <input 
                  type="text" 
                  required
                  value={onboardingData.startup_name}
                  onChange={e => setOnboardingData({...onboardingData, startup_name: e.target.value})}
                  className="w-full bg-surface-container-low rounded-xl px-5 py-4 font-medium border border-outline-variant/20 focus:border-primary outline-none transition-all" 
                  placeholder="e.g. EcoCharge India"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-outline uppercase tracking-wider">Industry / Domain</label>
                  <input 
                    type="text" 
                    required
                    value={onboardingData.domain}
                    onChange={e => setOnboardingData({...onboardingData, domain: e.target.value})}
                    className="w-full bg-surface-container-low rounded-xl px-5 py-4 font-medium border border-outline-variant/20 focus:border-primary outline-none transition-all" 
                    placeholder="e.g. EV Infrastructure, Fintech"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-outline uppercase tracking-wider">Stage</label>
                  <select 
                    value={onboardingData.stage}
                    onChange={e => setOnboardingData({...onboardingData, stage: e.target.value})}
                    className="w-full bg-surface-container-low rounded-xl px-5 py-4 font-medium border border-outline-variant/20 focus:border-primary outline-none transition-all appearance-none"
                  >
                    <option value="Ideation">Ideation (Idea Phase)</option>
                    <option value="MVP">MVP / Prototype</option>
                    <option value="Early Traction">Early Traction / Pre-Seed</option>
                    <option value="Early Growth">Early Growth / Seed</option>
                    <option value="Scaling">Scaling / Series A+</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-bold text-outline uppercase tracking-wider">Location / HQ</label>
                <input 
                  type="text" 
                  required
                  value={onboardingData.location}
                  onChange={e => setOnboardingData({...onboardingData, location: e.target.value})}
                  className="w-full bg-surface-container-low rounded-xl px-5 py-4 font-medium border border-outline-variant/20 focus:border-primary outline-none transition-all" 
                  placeholder="e.g. Bangalore, India"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-bold text-outline uppercase tracking-wider">One-line Pitch / Idea</label>
                <textarea 
                  rows="3" 
                  required
                  value={onboardingData.business_idea}
                  onChange={e => setOnboardingData({...onboardingData, business_idea: e.target.value})}
                  className="w-full bg-surface-container-low rounded-xl px-5 py-4 font-medium border border-outline-variant/20 focus:border-primary outline-none transition-all resize-none"
                  placeholder="Describe your startup in 1-2 sentences..."
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={saving}
                className="w-full btn-primary py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 transition-all active:scale-[0.98] mt-4 disabled:opacity-50"
              >
                {saving ? 'Creating Profile...' : 'Complete Setup & Launch AI'}
              </button>
            </form>
          </div>
        </main>
      </div>
    );
  }

  const currentStartup = startups[0];

  return (
    <div className="min-h-screen flex flex-col pt-24 bg-surface-container-lowest font-body-md">
      <Navbar onNavigate={onNavigate} currentPage={currentPage} user={user} onLogout={onLogout} isLoggedIn={true} />

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
              <div className="w-full h-full rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center border border-outline-variant/10">
                 <span className="text-3xl md:text-5xl font-extrabold text-primary">{currentStartup.startup_name.charAt(0)}</span>
              </div>
            </div>
            <div className="mb-2 md:mb-4">
              <h1 className="text-xl md:text-3xl font-extrabold text-on-surface tracking-tight leading-none mb-1">{user?.full_name || 'Founder'}</h1>
              <p className="text-xs md:text-base text-on-surface-variant font-medium">Founder at {currentStartup.startup_name}</p>
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
                <div className="h-full bg-primary w-[100%] rounded-full"></div>
              </div>
              <p className="text-[13px] text-on-surface-variant font-medium">Your profile is completely set up! AI is analyzing your eligibility.</p>
            </div>
          </aside>

          {/* Content Area */}
          <section className="lg:col-span-3 bg-white rounded-2xl md:rounded-3xl p-6 md:p-10 shadow-soft border border-outline-variant/20">
            
            {activeTab === 'startup' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-extrabold text-on-surface mb-8 tracking-tight">Startup Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-outline uppercase tracking-wider">Startup Name</label>
                    <input type="text" readOnly defaultValue={currentStartup.startup_name} className="w-full bg-surface-container-lowest rounded-xl px-4 py-3 font-medium border border-outline-variant/20 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-outline uppercase tracking-wider">Domain / Industry</label>
                    <input type="text" readOnly defaultValue={currentStartup.domain} className="w-full bg-surface-container-lowest rounded-xl px-4 py-3 font-medium border border-outline-variant/20 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-outline uppercase tracking-wider">Operating Stage</label>
                    <input type="text" readOnly defaultValue={currentStartup.stage} className="w-full bg-surface-container-lowest rounded-xl px-4 py-3 font-medium border border-outline-variant/20 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-outline uppercase tracking-wider">Location</label>
                    <input type="text" readOnly defaultValue={currentStartup.location} className="w-full bg-surface-container-lowest rounded-xl px-4 py-3 font-medium border border-outline-variant/20 outline-none" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[13px] font-bold text-outline uppercase tracking-wider">One-line Pitch</label>
                    <textarea rows="3" readOnly defaultValue={currentStartup.business_idea} className="w-full bg-surface-container-lowest rounded-xl px-4 py-3 font-medium border border-outline-variant/20 outline-none resize-none"></textarea>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-2xl font-extrabold text-on-surface mb-1 tracking-tight">Your Startup Portfolio</h2>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {startups.map(startup => (
                    <div key={startup.id} className="group border-2 border-primary bg-primary/[0.02] rounded-3xl p-6 transition-all relative overflow-hidden">
                      <div className="absolute top-4 right-4 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest">Active</div>
                      <div className="flex items-start gap-4 mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-white shadow-soft flex items-center justify-center border border-outline-variant/20 text-2xl font-extrabold text-primary">
                          {startup.startup_name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-on-surface">{startup.startup_name}</h3>
                          <p className="text-[13px] text-on-surface-variant font-medium">{startup.domain} • {startup.stage}</p>
                        </div>
                      </div>
                      <p className="text-sm text-on-surface-variant mb-6 line-clamp-2 font-medium">{startup.business_idea}</p>
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
                    <input type="text" readOnly defaultValue={user?.full_name} className="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl px-5 py-4 outline-none font-medium" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-on-surface-variant uppercase tracking-wider">Email Address</label>
                    <input type="email" readOnly defaultValue={user?.email} className="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl px-5 py-4 outline-none font-medium" />
                  </div>
                </div>
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
