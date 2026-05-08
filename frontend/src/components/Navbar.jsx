import React from 'react';

const Navbar = ({ onNavigate, currentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'landing', label: 'Explore' },
    { id: 'funding_os', label: 'Funding OS' },
    { id: 'analyzer', label: 'Analyzer' },
    { id: 'discovery', label: 'Hub' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 glass-nav border-b border-outline-variant/30">
      <div className="flex justify-between items-center max-w-[1200px] mx-auto px-6 md:px-12 h-20">
        <div className="flex items-center gap-4 md:gap-8">
          <button 
            onClick={() => { onNavigate('landing'); setIsMenuOpen(false); }}
            className="font-display text-xl md:text-2xl tracking-tighter text-on-surface font-extrabold"
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
        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={() => onNavigate('auth')}
            className="hidden md:block btn-primary px-4 py-2 rounded-xl text-[13px] font-semibold"
          >
            Get Funded
          </button>
          <button 
            onClick={() => onNavigate('profile')}
            className="text-on-surface-variant hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-container-low/50"
          >
            <span className="material-symbols-outlined">account_circle</span>
          </button>
          <button 
            className="md:hidden p-2 text-on-surface-variant"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="material-symbols-outlined">{isMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-outline-variant/30 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col p-6 gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); setIsMenuOpen(false); }}
                className={`flex items-center justify-between w-full p-4 rounded-2xl text-left font-bold ${
                  currentPage === item.id ? 'bg-primary/5 text-primary' : 'text-on-surface-variant hover:bg-surface-container-low'
                }`}
              >
                {item.label}
                {currentPage === item.id && <span className="material-symbols-outlined text-[18px]">chevron_right</span>}
              </button>
            ))}
            <div className="h-px bg-outline-variant/10 my-2" />
            <button 
              onClick={() => { onNavigate('auth'); setIsMenuOpen(false); }}
              className="w-full btn-primary py-4 rounded-2xl font-bold mt-2"
            >
              Get Funded Now
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
