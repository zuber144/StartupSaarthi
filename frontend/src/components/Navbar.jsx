import React from 'react';

const Navbar = ({ onNavigate, currentPage }) => {
  const navItems = [
    { id: 'landing', label: 'Explore' },
    { id: 'funding_os', label: 'Funding OS' },
    { id: 'analyzer', label: 'Analyzer' },
    { id: 'discovery', label: 'Hub' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 glass-nav border-b border-outline-variant/30">
      <div className="flex justify-between items-center max-w-[1200px] mx-auto px-12 h-20">
        <div className="flex items-center gap-8">
          <button 
            onClick={() => onNavigate('landing')}
            className="font-display text-2xl tracking-tighter text-on-surface font-extrabold"
          >
            Startup Saarthi
          </button>
          <div className="hidden md:flex gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-4 py-2 rounded-lg text-[13px] font-bold transition-all duration-300 ${
                  currentPage === item.id 
                    ? 'text-primary bg-surface-container-low' 
                    : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low/50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate('auth')}
            className="hidden md:block btn-primary px-4 py-2 rounded-xl text-[13px] font-semibold"
          >
            Get Funded
          </button>
          <button 
            onClick={() => onNavigate('auth')}
            className="text-on-surface-variant hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-container-low/50"
          >
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
