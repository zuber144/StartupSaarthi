import React, { useState, useRef, useEffect } from 'react';
import { startupsAPI, request } from '../../services/api';

/* ── Response parser ─────────────────────────────────────────────────────────
   The master agent returns a JSONB blob that can vary in structure.
   We try every known key path to extract meaningful content.
   ────────────────────────────────────────────────────────────────────────── */
function parseAIResponse(data, userMessage) {
  if (!data || typeof data !== 'object') {
    return "I ran the analysis but the response was empty. Please try again.";
  }

  const msg = userMessage.toLowerCase();

  // ── Scheme discovery intent ───────────────────────────────────────────────
  const isSchemeQuery = msg.includes('scheme') || msg.includes('fund') || msg.includes('grant')
    || msg.includes('eligib') || msg.includes('discover');

  if (isSchemeQuery) {
    // Try all known paths where schemes could live
    const schemes =
      data?.research?.schemes ||
      data?.research_eligibility?.eligible_schemes ||
      data?.eligible_schemes ||
      data?.schemes ||
      null;

    if (Array.isArray(schemes) && schemes.length > 0) {
      const top = schemes.slice(0, 3);
      const lines = top.map((s, i) =>
        `${i + 1}. ${s.name || s.scheme_name || s} — ${s.reason || s.eligibility_reason || 'Eligible based on your profile.'}`
      );
      return `✅ Found ${schemes.length} eligible government scheme(s) for your startup:\n\n${lines.join('\n\n')}`;
    }

    // Try missing requirements if no schemes found
    const missing =
      data?.research?.missing_requirements ||
      data?.missing_requirements ||
      data?.gaps ||
      null;

    if (Array.isArray(missing) && missing.length > 0) {
      const lines = missing.slice(0, 3).map((m, i) =>
        `${i + 1}. ${m.requirement || m.gap || m}`
      );
      return `No direct scheme matches found yet. Here's what's missing to qualify:\n\n${lines.join('\n')}`;
    }

    return "No matching schemes found for your current profile. Try adding more details (location, domain, registration) to your profile for better matches.";
  }

  // ── Strategy / roadmap intent ─────────────────────────────────────────────
  const isStrategyQuery = msg.includes('strategy') || msg.includes('roadmap') || msg.includes('next step')
    || msg.includes('plan') || msg.includes('improve');

  if (isStrategyQuery) {
    const score = data?.strategy?.readiness_score ?? data?.readiness_score ?? null;
    const roadmap =
      data?.strategy?.roadmap_steps ||
      data?.roadmap ||
      data?.next_steps ||
      null;

    if (Array.isArray(roadmap) && roadmap.length > 0) {
      const steps = roadmap.slice(0, 4).map((s, i) =>
        `${i + 1}. ${s.action || s.step || s}`
      );
      const scoreText = score ? `Your current readiness score is **${score}/100**.\n\n` : '';
      return `${scoreText}📋 Your Personalized Funding Roadmap:\n\n${steps.join('\n')}`;
    }

    if (score) {
      const reason = data?.strategy?.score_reasoning || '';
      return `Your funding readiness score is **${score}/100**. ${reason}`;
    }
  }

  // ── Score / readiness intent ──────────────────────────────────────────────
  const isScoreQuery = msg.includes('score') || msg.includes('readiness') || msg.includes('ready');
  if (isScoreQuery) {
    const score = data?.strategy?.readiness_score ?? data?.readiness_score ?? null;
    const reason = data?.strategy?.score_reasoning ?? data?.score_reasoning ?? '';
    if (score !== null) {
      return `Your funding readiness score is **${score}/100**.\n\n${reason}`;
    }
  }

  // ── Validation note ────────────────────────────────────────────────────────
  const validationNote = data?.validation?.note || data?.validation_note || null;

  // ── Generic fallback — show whatever AI returned ───────────────────────────
  const score = data?.strategy?.readiness_score ?? data?.readiness_score ?? null;
  const schemes = data?.research?.schemes || data?.eligible_schemes || data?.schemes || [];
  const roadmap = data?.strategy?.roadmap_steps || data?.roadmap || [];

  let parts = [];
  if (score !== null) parts.push(`📊 Readiness Score: **${score}/100**`);
  if (Array.isArray(schemes) && schemes.length > 0)
    parts.push(`✅ Matched ${schemes.length} scheme(s): ${schemes.slice(0, 2).map(s => s.name || s.scheme_name || s).join(', ')}`);
  if (Array.isArray(roadmap) && roadmap.length > 0)
    parts.push(`📋 Top next step: ${roadmap[0].action || roadmap[0].step || roadmap[0]}`);
  if (validationNote) parts.push(`🔍 Validation: ${validationNote}`);

  if (parts.length > 0) return parts.join('\n\n');

  return "I completed the analysis but couldn't extract specific results. Please run a full analysis from the Analyzer page first, then ask me about schemes or strategy.";
}


/* ── Component ──────────────────────────────────────────────────────────────── */
const AICopilotChat = () => {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: "Hello! I'm your Funding AI Copilot powered by Gemini. Ask me about eligible government schemes, your funding readiness, or next steps for your startup.",
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [startup, setStartup] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    startupsAPI.list().then(list => { if (list.length > 0) setStartup(list[0]); }).catch(() => {});
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');
    setLoading(true);

    try {
      if (!startup) {
        setMessages(prev => [...prev, {
          role: 'ai',
          text: "Please create a startup profile first so I can personalise my analysis. Go to Profile → My Startups to get started!"
        }]);
        return;
      }

      // Always force=true so Copilot always calls Gemini fresh with the user's question
      const result = await request('/ai/analyze', {
        method: 'POST',
        body: JSON.stringify({ startup_id: startup.id, user_input: text, force: true }),
      });

      const responseText = parseAIResponse(result?.data, text);
      setMessages(prev => [...prev, { role: 'ai', text: responseText }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'ai',
        text: `Error: ${err.message}. Make sure the backend is running and you have a startup profile set up.`
      }]);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    "Discover funding schemes",
    "What is my readiness score?",
    "Give me a funding roadmap",
    "What am I missing to qualify?",
  ];

  return (
    <div className="bg-white border border-outline-variant/30 rounded-2xl shadow-soft flex flex-col h-[460px] overflow-hidden">
      {/* Header */}
      <div className="border-b border-outline-variant/30 p-4 flex items-center justify-between bg-surface-container-low/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-[18px]">smart_toy</span>
          </div>
          <div>
            <span className="text-base font-bold text-on-surface">Funding AI Copilot</span>
            {startup && (
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="text-[11px] text-green-600 font-medium">Ready · {startup.startup_name}</span>
              </div>
            )}
          </div>
        </div>
        <span className="text-[11px] font-bold text-outline uppercase tracking-widest bg-primary/10 text-primary px-2 py-0.5 rounded">
          Gemini Pro
        </span>
      </div>

      {/* Messages */}
      <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-surface-bright">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'max-w-[85%] ml-auto flex-row-reverse' : 'max-w-[90%]'}`}>
            {msg.role === 'ai' ? (
              <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-primary text-[18px]">smart_toy</span>
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                You
              </div>
            )}
            <div className={`rounded-2xl p-3 text-sm font-medium leading-relaxed whitespace-pre-wrap ${
              msg.role === 'ai'
                ? 'bg-surface-container border border-outline-variant/20 rounded-tl-none text-on-surface shadow-sm'
                : 'bg-primary text-white rounded-tr-none shadow-md'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}

        {/* Loading */}
        {loading && (
          <div className="flex gap-3 max-w-[85%]">
            <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-primary text-[18px]">smart_toy</span>
            </div>
            <div className="bg-surface-container border border-outline-variant/20 rounded-2xl rounded-tl-none p-3 shadow-sm flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-xs text-on-surface-variant font-medium">Analyzing with Gemini...</span>
            </div>
          </div>
        )}

        {/* Quick actions */}
        {messages.length === 1 && !loading && (
          <div className="flex flex-wrap gap-2 mt-2">
            {quickActions.map((action, i) => (
              <button
                key={i}
                onClick={() => setInput(action)}
                className="text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors"
              >
                {action}
              </button>
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-outline-variant/30 bg-white">
        <form onSubmit={sendMessage} className="relative">
          <input
            className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl py-3 pl-4 pr-12 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium"
            placeholder={loading ? "AI is thinking..." : "Ask your copilot..."}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-40"
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AICopilotChat;
