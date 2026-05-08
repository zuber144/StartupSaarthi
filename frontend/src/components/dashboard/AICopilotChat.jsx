import React from 'react';

const AICopilotChat = () => {
  return (
    <div className="bg-white border border-outline-variant/30 rounded-2xl shadow-soft flex flex-col h-[400px] overflow-hidden">
      <div className="border-b border-outline-variant/30 p-4 flex items-center justify-between bg-surface-container-low/50">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">smart_toy</span>
          <span className="text-base font-bold text-on-surface">Funding AI Copilot</span>
        </div>
        <button className="text-outline hover:text-on-surface transition-colors">
          <span className="material-symbols-outlined">more_horiz</span>
        </button>
      </div>
      
      <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-surface-bright">
        {/* AI Message */}
        <div className="flex gap-3 max-w-[85%]">
          <div className="w-8 h-8 rounded-full bg-primary-container text-white flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[18px]">smart_toy</span>
          </div>
          <div className="bg-surface-container border border-outline-variant/20 rounded-2xl rounded-tl-none p-3 shadow-sm">
            <p className="text-sm text-on-surface font-medium leading-relaxed">
              I reviewed your latest pitch deck. The problem statement is clear, but investors might want more details on your acquisition channels. Want me to draft a slide for that?
            </p>
          </div>
        </div>
        
        {/* User Message */}
        <div className="flex gap-3 max-w-[85%] ml-auto flex-row-reverse">
          <div className="w-8 h-8 rounded-full bg-surface-container-high overflow-hidden flex-shrink-0 border border-outline-variant/20">
            <img 
              alt="User" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAf76GVFeI6UqfvDADjlaVQ3VL1teOMHMVnFpDicvuF3cRtEPlqkgEYP8uxjckWzLZlkl9qHmqvViZoi3mYywhkNR9FCl_DNuQDfskHJXwGgYKIrS7TZVH0QH-A3DzM6Gr57bMqjM7bD3fvRp7hipBF7V_HLwEdzEYTXGysjXpHOah--B5I_Tmh-sjFYoZmABij3GAFj4s5ub0Vl9K8Ok9qqefEUXAf1u39RcWSCG4oeQq2XoW3EH7WUqB8sQ1_peaa0yKAfTPfXRw" 
            />
          </div>
          <div className="bg-primary text-white rounded-2xl rounded-tr-none p-3 shadow-md">
            <p className="text-sm font-medium leading-relaxed">Yes, please draft a slide focusing on our B2B partnership strategy.</p>
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t border-outline-variant/30 bg-white">
        <div className="relative">
          <input 
            className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl py-3 pl-4 pr-12 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium" 
            placeholder="Ask your copilot..." 
            type="text"
          />
          <button className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center hover:bg-primary/90 transition-colors shadow-sm">
            <span className="material-symbols-outlined text-[18px]">send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AICopilotChat;
