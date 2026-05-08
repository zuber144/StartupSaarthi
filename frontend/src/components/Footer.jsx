import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full py-20 bg-surface-container-lowest border-t border-outline-variant/20">
      <div className="max-w-[1200px] mx-auto px-12 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="font-display text-2xl text-on-surface font-bold">Startup Saarthi</div>
        <div className="flex flex-wrap justify-center gap-6">
          {['Manifesto', 'Privacy Policy', 'Terms of Service', 'Contact'].map((item) => (
            <a key={item} className="text-[13px] text-on-secondary-container hover:text-primary transition-colors hover:underline underline-offset-4 decoration-primary/30" href="#">{item}</a>
          ))}
        </div>
        <div className="text-[13px] text-on-secondary-container opacity-80">
          © 2024 Startup Saarthi Intelligence. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
