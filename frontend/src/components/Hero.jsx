import React from 'react';

const Hero = ({ onNavigate }) => {
  return (
    <section className="py-24 text-center flex flex-col items-center justify-center min-h-[80vh]">
      <h1 className="font-display text-6xl md:text-7xl text-on-surface mb-6 max-w-4xl tracking-tighter font-extrabold leading-tight">
        Autonomous Funding Copilot for Indian Startups
      </h1>
      <p className="text-lg md:text-xl text-on-surface-variant mb-10 max-w-2xl leading-relaxed">
        Streamline your path to capital with AI-driven workflows that identify, analyze, and secure funding from over 1,500+ active schemes and investors.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 mb-16">
        <button 
          onClick={() => onNavigate('analyzer')}
          className="btn-primary px-8 py-4 rounded-xl text-base font-semibold hover:opacity-90"
        >
          Check Funding Readiness
        </button>
        <button 
          onClick={() => onNavigate('discovery')}
          className="btn-secondary px-8 py-4 rounded-xl text-base font-medium hover:bg-surface-container-high"
        >
          Explore Schemes
        </button>
      </div>
      <div className="w-full max-w-5xl bg-white rounded-3xl soft-shadow border-subtle overflow-hidden relative aspect-[16/9]">
        <img 
          alt="Dashboard preview" 
          className="w-full h-full object-cover" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCl5caATh8WSFeHAzS9AA6bY6zd4OyOGfLSV2wDLFlrDrE2hm42zLCVu1UIzeRK0IPDfU5tXxsFtAuoBoDDnuw08O6R3ytVkhxYlkhTI4yCk52UQbf2QK7M3VtqtcvKa-e6bgv4MvKb0EIf-9xrn6qYa_ZcGKiC17mOEQtdTJSxAWwLIqGT8tobKlJVG-qp6AMEVF3mSp69Grjm8RzjczV-jL8-VMdfupIbXQ9YhWPLmg2ehMFFqSlC4cZIzT2Jn9J3tAcV6kSHSd0" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-50"></div>
      </div>
    </section>
  );
};

export default Hero;
