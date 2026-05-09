import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import useAnalysisStore from '../services/analysisStore';

/* ─── UI Sub-components (Deterministic) ────────────────────────── */

const ScoreGauge = ({ score }) => {
  const dashArray = 283;
  const safe = score || 0;
  const dashOffset = dashArray - (dashArray * safe) / 100;
  const color = safe >= 70 ? '#22c55e' : safe >= 45 ? '#f59e0b' : '#ef4444';
  return (
    <div className="relative w-40 h-40 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" fill="none" r="45" stroke="#eef0f2" strokeWidth="8" />
        <circle className="transition-all duration-1000 ease-out" cx="50" cy="50" fill="none" r="45"
          stroke={color} strokeDasharray={dashArray} strokeDashoffset={dashOffset}
          strokeLinecap="round" strokeWidth="8" />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-extrabold text-on-surface">{safe > 0 ? safe : '—'}</span>
        <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Readiness</span>
      </div>
    </div>
  );
};

const IntelligenceCard = ({ title, children, icon, color = "primary" }) => (
  <div className="bg-white rounded-2xl border border-outline-variant/20 shadow-soft overflow-hidden">
    <div className="px-6 py-4 border-b border-outline-variant/10 bg-surface-container-low/30 flex items-center gap-2">
      <span className={`material-symbols-outlined text-${color} text-[20px]`}>{icon}</span>
      <h3 className="text-[11px] font-bold text-outline uppercase tracking-[0.1em]">{title}</h3>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const SchemeMatch = ({ scheme }) => {
  const prob = Math.round((scheme.approval_probability || 0) * 100);
  const color = prob >= 70 ? 'text-green-600' : prob >= 40 ? 'text-amber-600' : 'text-red-600';
  
  return (
    <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/10 hover:border-primary/30 transition-all group">
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-bold text-on-surface group-hover:text-primary transition-colors">{scheme.scheme_name}</h4>
        <div className={`text-right ${color}`}>
          <div className="text-xl font-black">{prob}%</div>
          <div className="text-[9px] font-bold uppercase tracking-tighter">Prob.</div>
        </div>
      </div>
      
      <div className="space-y-3">
        <div>
          <p className="text-[10px] font-bold text-outline uppercase mb-1">Why it matches</p>
          <p className="text-sm text-on-surface-variant leading-relaxed">{scheme.why_matched}</p>
        </div>
        
        {scheme.missing_requirements?.length > 0 && (
          <div>
            <p className="text-[10px] font-bold text-amber-600 uppercase mb-1">Gaps to bridge</p>
            <ul className="space-y-1">
              {scheme.missing_requirements.map((gap, i) => (
                <li key={i} className="text-xs text-amber-700 flex items-center gap-1.5 font-medium">
                  <span className="w-1 h-1 rounded-full bg-amber-400" /> {gap}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="pt-2 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-primary text-[14px]">verified</span>
            <span className="text-[10px] font-bold text-primary uppercase">Confidence: {Math.round(scheme.eligibility_confidence * 100)}%</span>
          </div>
          <button className="text-[11px] font-bold text-primary hover:underline">View Guidelines</button>
        </div>
      </div>
    </div>
  );
};

const OrchestrationTimeline = ({ logs, isRunning }) => (
  <div className="bg-[#0f172a] rounded-2xl p-6 font-mono border border-white/5 shadow-2xl">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Orchestration Timeline</span>
      </div>
      <span className="text-[9px] text-slate-500 font-bold uppercase">v1.0 Protocol</span>
    </div>
    <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
      {logs.map((log, i) => (
        <div key={i} className="flex gap-4 text-[12px] animate-in fade-in slide-in-from-left-2 duration-300">
          <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
          <span className={log.message.includes('✗') ? 'text-red-400' : log.message.includes('✓') ? 'text-green-400' : 'text-slate-300'}>
            {log.message}
          </span>
        </div>
      ))}
      {isRunning && (
        <div className="flex gap-4 text-[12px]">
          <span className="text-slate-500 shrink-0">[{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
          <span className="text-primary animate-pulse italic">Thinking...</span>
        </div>
      )}
      {logs.length === 0 && !isRunning && (
        <div className="text-slate-500 text-[12px] italic">Waiting for orchestration trigger...</div>
      )}
    </div>
  </div>
);

/* ─── Main Page ─────────────────────────────────────────────────── */

const AnalyzerPage = ({ onNavigate, currentPage, user, onLogout }) => {
  const { 
    analysis, 
    isRunning, 
    logs, 
    runAnalysis, 
    hydrate, 
    isHydrated, 
    meta,
    error,
    startup
  } = useAnalysisStore();

  useEffect(() => {
    if (!isHydrated) hydrate();
  }, [isHydrated, hydrate]);

  if (!isHydrated) return (
    <div className="min-h-screen flex items-center justify-center bg-surface-bright">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
        <p className="text-sm font-bold text-outline uppercase tracking-widest">Hydrating Intelligence...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col pt-20 bg-surface-bright font-body-md">
      <Navbar onNavigate={onNavigate} currentPage={currentPage} user={user} isLoggedIn={true} onLogout={onLogout} />
      
      <main className="flex-grow w-full max-w-[1200px] mx-auto px-6 md:px-12 py-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10 pb-8 border-b border-outline-variant/20">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">Console v1.0</span>
              {meta && (
                <span className="text-[11px] text-on-surface-variant font-bold">
                  Last Sync: {meta.age}
                </span>
              )}
            </div>
            <h1 className="text-4xl font-black text-on-surface mb-2 tracking-tighter">Funding Intelligence Console</h1>
            <p className="text-base text-on-surface-variant font-medium">
              {startup ? `${startup.startup_name} • ${startup.stage}` : 'Initialize your startup profile to begin analysis.'}
            </p>
          </div>
          
          <div className="flex flex-col items-end gap-3">
            <div className="flex gap-3">
              <button 
                onClick={() => runAnalysis(true)} 
                disabled={isRunning || !startup}
                className={`btn-primary px-8 py-3.5 rounded-xl font-bold shadow-xl flex items-center gap-2 transition-all ${isRunning ? 'scale-95 opacity-80' : 'hover:scale-105'}`}
              >
                <span className="material-symbols-outlined">{isRunning ? 'sync' : 'auto_awesome'}</span>
                {isRunning ? 'Orchestrating Agents...' : analysis ? 'Refresh Intelligence' : 'Run Full Analysis'}
              </button>
            </div>
            {meta?.profile_changed && (
              <p className="text-[11px] font-bold text-amber-600 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">warning</span>
                Profile mismatch detected. Re-analysis recommended.
              </p>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700">
            <span className="material-symbols-outlined">error</span>
            <p className="font-bold text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Logic & Flow */}
          <div className="lg:col-span-1 flex flex-col gap-8">
            <OrchestrationTimeline logs={logs} isRunning={isRunning} />
            
            {analysis && (
              <IntelligenceCard title="Funding Readiness" icon="analytics" color="primary">
                <div className="flex flex-col items-center">
                  <ScoreGauge score={analysis.readiness_score} />
                  <div className="mt-6 w-full p-4 rounded-xl bg-surface-container-low border border-outline-variant/10">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                      <span className="text-xs font-bold text-on-surface">AI Validation Audit</span>
                    </div>
                    <p className="text-sm text-on-surface-variant leading-relaxed italic">
                      "{analysis.validation_note || 'Analysis validated by multi-agent consensus.'}"
                    </p>
                    <div className="mt-3 pt-3 border-t border-outline-variant/10 flex justify-between items-center">
                      <span className="text-[10px] font-bold text-outline uppercase">Confidence Score</span>
                      <span className="text-sm font-black text-primary">{Math.round(analysis.confidence_score * 100)}%</span>
                    </div>
                  </div>
                </div>
              </IntelligenceCard>
            )}
          </div>

          {/* Right Column: Intelligence Results */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            
            {!analysis && !isRunning && (
              <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border-2 border-dashed border-outline-variant/30 text-center">
                <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-outline text-3xl">terminal</span>
                </div>
                <h3 className="text-xl font-bold text-on-surface mb-2">System Idle</h3>
                <p className="text-on-surface-variant max-w-xs mx-auto">
                  Click the button above to initialize the multi-agent funding intelligence pipeline.
                </p>
              </div>
            )}

            {analysis && (
              <>
                <IntelligenceCard title="Matched Government Schemes" icon="account_balance" color="green-600">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analysis.schemes?.map((s, i) => (
                      <SchemeMatch key={i} scheme={s} />
                    ))}
                    {(!analysis.schemes || analysis.schemes.length === 0) && (
                      <p className="col-span-2 text-on-surface-variant text-sm italic py-4">No direct matches found in current scheme database.</p>
                    )}
                  </div>
                </IntelligenceCard>

                <IntelligenceCard title="Personalized Funding Roadmap" icon="map" color="amber-600">
                  <div className="space-y-4">
                    {analysis.roadmap?.map((step, i) => (
                      <div key={i} className="flex gap-4 group">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-sm group-hover:bg-primary group-hover:text-white transition-all duration-300">
                            {i + 1}
                          </div>
                          {i < analysis.roadmap.length - 1 && <div className="w-px h-full bg-outline-variant/20 my-1" />}
                        </div>
                        <div className="pb-6">
                          <p className="text-sm font-bold text-on-surface mb-1">{step.action || step.step || step}</p>
                          <p className="text-xs text-on-surface-variant leading-relaxed">
                            Recommended action item generated by StrategyAgent based on current readiness gaps.
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </IntelligenceCard>

                {analysis.gaps?.length > 0 && (
                  <IntelligenceCard title="Critical Intelligence Gaps" icon="warning" color="red-600">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {analysis.gaps.map((gap, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-red-50 border border-red-100">
                          <span className="material-symbols-outlined text-red-500 text-[18px]">error</span>
                          <p className="text-xs font-bold text-red-800">{gap.requirement || gap.gap || gap}</p>
                        </div>
                      ))}
                    </div>
                  </IntelligenceCard>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AnalyzerPage;
