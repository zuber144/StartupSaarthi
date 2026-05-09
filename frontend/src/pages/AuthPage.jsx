import React, { useState } from 'react';
import { authAPI } from '../services/api';

const AuthPage = ({ onNavigate }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await authAPI.login(email, password);
        onNavigate('landing');
      } else {
        await authAPI.signup(fullName, email, password);
        // Auto-login after signup
        await authAPI.login(email, password);
        onNavigate('profile');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-surface-container-lowest font-body-md">
      {/* Left Side: Branding/Visual */}
      <div className="hidden lg:flex w-1/2 bg-primary relative overflow-hidden flex-col justify-between p-16">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute -right-20 -top-20 w-[500px] h-[500px] bg-white/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute -left-20 -bottom-20 w-[500px] h-[500px] bg-[#00ffff]/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        {/* Animated Waves */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] transform rotate-180 opacity-20">
          <svg className="relative block w-[calc(160%+1.3px)] h-[300px]" data-name="Layer 1" preserveAspectRatio="none" viewBox="0 0 1200 120" xmlns="http://www.w3.org/2000/svg">
            <path className="fill-white animate-wave" d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" style={{ animationDuration: '7s' }}></path>
            <path className="fill-white opacity-50 animate-wave" d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" style={{ animationDuration: '10s', animationDelay: '-2s' }}></path>
            <path className="fill-white opacity-30 animate-wave" d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" style={{ animationDuration: '13s', animationDelay: '-5s' }}></path>
          </svg>
        </div>
        
        <div className="z-10">
          <button 
            onClick={() => onNavigate('landing')}
            className="font-display text-4xl text-white font-extrabold tracking-tighter"
          >
            Startup Saarthi
          </button>
        </div>

        <div className="z-10 max-w-lg">
          <h1 className="font-display text-5xl text-white font-extrabold leading-tight mb-6 tracking-tight">
            The next generation of startup funding is here.
          </h1>
          <p className="text-xl text-on-primary-container font-medium opacity-90 leading-relaxed">
            Join 10,000+ founders using autonomous AI to navigate the complex world of grants, VCs, and debt funding.
          </p>
        </div>

        <div className="z-10 flex items-center gap-4 text-white/60 text-sm font-medium">
          <span>© 2024 Startup Saarthi Intelligence</span>
          <span className="w-1 h-1 bg-white/30 rounded-full"></span>
          <span>Privacy Policy</span>
          <span className="w-1 h-1 bg-white/30 rounded-full"></span>
          <span>Terms</span>
        </div>
      </div>

      {/* Right Side: Auth Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md">
          <div className="mb-10 lg:hidden text-center">
            <span className="font-display text-3xl text-primary font-extrabold tracking-tighter">Startup Saarthi</span>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-extrabold text-on-surface mb-2 tracking-tight">
              {isLogin ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="text-on-surface-variant font-medium">
              {isLogin ? 'Enter your details to access your Funding OS.' : 'Start your journey to securing capital today.'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label className="block text-[13px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Full Name</label>
                <input 
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium"
                  placeholder="John Doe"
                  required
                />
              </div>
            )}
            
            <div>
              <label className="block text-[13px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Email Address</label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium"
                placeholder="name@company.com"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[13px] font-bold text-on-surface-variant uppercase tracking-wider">Password</label>
                {isLogin && <a href="#" className="text-[13px] text-primary font-bold hover:underline">Forgot password?</a>}
              </div>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-4 rounded-xl font-bold text-base shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant/30"></div>
            </div>
            <div className="relative flex justify-center text-[13px] uppercase font-bold tracking-widest">
              <span className="bg-surface-container-lowest px-4 text-outline">Or continue with</span>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-3 bg-white border border-outline-variant/30 py-3 rounded-xl hover:bg-surface-container-low transition-all font-bold text-sm active:scale-[0.98]">
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
              Google
            </button>
            <button className="flex items-center justify-center gap-3 bg-white border border-outline-variant/30 py-3 rounded-xl hover:bg-surface-container-low transition-all font-bold text-sm active:scale-[0.98]">
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/linkedin.svg" className="w-5 h-5" alt="LinkedIn" />
              LinkedIn
            </button>
          </div>

          <p className="mt-10 text-center text-[13px] font-medium text-on-surface-variant">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-primary font-bold hover:underline"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
