import React from 'react';

const CTA = () => {
  return (
    <section className="py-32 flex flex-col items-center justify-center text-center bg-surface-container-low rounded-3xl border-subtle mt-16 px-6">
      <h2 className="font-display text-5xl text-on-surface mb-6 font-extrabold tracking-tight">Build Smarter. Fund Faster.</h2>
      <p className="text-lg text-on-surface-variant mb-10 max-w-xl">Join the elite group of Indian startups leveraging autonomous AI to secure their financial future.</p>
      <button className="btn-primary px-10 py-5 rounded-xl text-lg font-semibold hover:opacity-90 shadow-lg shadow-primary/20">
        Get Started Now
      </button>
    </section>
  );
};

export default CTA;
