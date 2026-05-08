import React, { useState, useRef, useEffect } from 'react';
import { aiAPI, startupsAPI } from '../../services/api';

const AICopilotChat = () => {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: "Hello! I'm your Funding AI Copilot. I can help you discover schemes, generate funding strategies, create pitch documents, and monitor your applications. What would you like to explore today?",
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [startupId, setStartupId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Try to get the first startup for the logged-in user
    const loadStartup = async () => {
      try {
        const startups = await startupsAPI.list();
        if (startups.length > 0) {
          setStartupId(startups[0].id);
        }
      } catch (err) {
        // Not logged in or no startups yet
      }
    };
    loadStartup();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    // Add user message
    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');
    setLoading(true);

    try {
      let responseText = '';

      if (!startupId) {
        responseText = "Please create a startup profile first so I can personalize my analysis for you. Go to Profile → My Startups to get started!";
      } else {
        // Call the AI orchestration API
        const result = await aiAPI.analyze(startupId, text);
        const data = result?.data || {};

        // Extract the most relevant part of the response based on intent
        const intent = data?.intent || 'full_analysis';
        if (data?.research_eligibility?.eligible_schemes) {
          const schemes = data.research_eligibility.eligible_schemes;
          responseText = `I found ${schemes.length} eligible schemes for your startup! ` +
            `Top match: **${schemes[0]?.scheme_name}** with ${schemes[0]?.eligibility_score || 'high'} eligibility. ` +
            `${schemes[0]?.reasoning || ''}`;
        } else if (data?.strategy?.funding_roadmap) {
          responseText = data.strategy.funding_roadmap.summary || JSON.stringify(data.strategy.funding_roadmap);
        } else if (data?.documents?.executive_summary) {
          responseText = `Here's your executive summary:\n\n${data.documents.executive_summary}`;
        } else {
          responseText = "I've analyzed your startup profile. Your funding readiness looks good! " +
            "Ask me to 'discover schemes', 'generate strategy', or 'create pitch documents' for detailed insights.";
        }
      }

      setMessages(prev => [...prev, { role: 'ai', text: responseText }]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: `I encountered an issue: ${err.message}. Please ensure you're logged in and have a startup profile set up.`
      }]);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    "Discover funding schemes",
    "Generate my pitch deck",
    "Check my eligibility",
    "Create funding strategy",
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
            {startupId && (
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                <span className="text-[11px] text-green-600 font-medium">Ready</span>
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
          <div
            key={i}
            className={`flex gap-3 ${msg.role === 'user' ? 'max-w-[85%] ml-auto flex-row-reverse' : 'max-w-[90%]'}`}
          >
            {msg.role === 'ai' ? (
              <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-primary text-[18px]">smart_toy</span>
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                You
              </div>
            )}
            <div
              className={`rounded-2xl p-3 text-sm font-medium leading-relaxed whitespace-pre-wrap ${
                msg.role === 'ai'
                  ? 'bg-surface-container border border-outline-variant/20 rounded-tl-none text-on-surface shadow-sm'
                  : 'bg-primary text-white rounded-tr-none shadow-md'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {loading && (
          <div className="flex gap-3 max-w-[85%]">
            <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-primary text-[18px]">smart_toy</span>
            </div>
            <div className="bg-surface-container border border-outline-variant/20 rounded-2xl rounded-tl-none p-3 shadow-sm flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <span className="text-xs text-on-surface-variant font-medium">Analyzing with Gemini...</span>
            </div>
          </div>
        )}

        {/* Quick actions — shown only on first load */}
        {messages.length === 1 && !loading && (
          <div className="flex flex-wrap gap-2 mt-2">
            {quickActions.map((action, i) => (
              <button
                key={i}
                onClick={() => { setInput(action); }}
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
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AICopilotChat;
