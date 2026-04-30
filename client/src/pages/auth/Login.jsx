import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../../hooks/useAuth";

const Login = () => {
  const { loginLoading, handleLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await handleLogin({ email, password });
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed. Please try again.");
    }
  };

  if (loginLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712]">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="w-12 h-12 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin" />
          <p className="text-cyan-400 text-xl font-semibold">Authenticating...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030712] px-4 py-12" style={{backgroundImage: 'radial-gradient(ellipse 80% 50% at 20% 0%, rgba(6,182,212,0.07) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 10%, rgba(168,85,247,0.07) 0%, transparent 70%)'}}>
      <div className="relative z-10 w-full max-w-md animate-fade-in-up">
        <div className="rounded-3xl p-8 md:p-10 shadow-2xl shadow-black/40" style={{background:'rgba(15,23,42,0.7)', backdropFilter:'blur(16px)', border:'1px solid rgba(255,255,255,0.07)'}}>
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg" style={{background:'linear-gradient(135deg,#06b6d4,#a855f7)'}}>S</div>
            <span className="text-xl font-bold text-gradient-cyan">SkillBridge AI</span>
          </Link>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-slate-400">Sign in to your account to continue</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium text-slate-300">Email address</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="email" id="email" name="email" placeholder="you@example.com" required
                className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700/60 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-slate-300">Password</label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                type="password" id="password" name="password" placeholder="••••••••" required
                className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700/60 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200 text-sm"
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-red-400 text-sm animate-slide-up" style={{background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)'}}>
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                {error}
              </div>
            )}
            <button type="submit" disabled={loginLoading}
              className="w-full py-3.5 rounded-xl font-semibold text-white transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] text-sm"
              style={{background:'linear-gradient(135deg,#06b6d4,#a855f7)', boxShadow:'0 8px 32px rgba(168,85,247,0.2)'}}>
              {loginLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : "Sign In"}
            </button>
          </form>
          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
