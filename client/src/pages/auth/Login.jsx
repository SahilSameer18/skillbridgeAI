import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { loginSchema } from "../../schemas/auth.schema.js";
import LoadingScreen from "../../components/layout/LoadingScreen";
import GoogleButton from "../../components/auth/GoogleButton";
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiLink } from "react-icons/fi";

const Login = () => {
  const { loginLoading, googleLoading, handleLogin, handleGoogleAuth, handleLinkGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // State for handling 409 Account Linking (lazy-initialized to avoid effect setState)
  const [pendingGoogleToken, setPendingGoogleToken] = useState(() => {
    return location.state?.pendingGoogleLink ? sessionStorage.getItem("pendingGoogleToken") : null;
  });
  const [conflictNotice] = useState(() => {
    return location.state?.pendingGoogleLink && sessionStorage.getItem("pendingGoogleToken")
      ? "An account with this Google email already exists. Enter your password below to link Google to your account."
      : null;
  });

  const [touched, setTouched] = useState({ email: false, password: false });
  const [fieldErrors, setFieldErrors] = useState({ email: null, password: null });

  // Clean up session storage and router state after reading
  useEffect(() => {
    if (location.state?.pendingGoogleLink) {
      sessionStorage.removeItem("pendingGoogleToken");
      window.history.replaceState({}, "");
    }
  }, [location.state]);

  const validateField = (name, value) => {
    const fieldSchema = loginSchema.shape[name];
    const result = fieldSchema.safeParse(value);
    const err = result.success ? null : (result.error.issues?.[0]?.message || result.error.errors?.[0]?.message);
    setFieldErrors((prev) => ({ ...prev, [name]: err }));
    return err;
  };

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    setError(null);
    if (touched.email) validateField("email", val);
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    setError(null);
    if (touched.password) validateField("password", val);
  };

  const handleBlur = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, name === "email" ? email : password);
  };

  const handleGoogleSuccess = async (tokenResponse) => {
    setError(null);
    try {
      await handleGoogleAuth({ accessToken: tokenResponse.access_token });
      navigate("/");
    } catch (err) {
      if (err?.response?.status === 409) {
        setPendingGoogleToken(tokenResponse.access_token);
        setError(
          err?.response?.data?.message ||
            "An account with this email already exists. Enter your password below to link Google."
        );
      } else {
        setError(err?.response?.data?.message || "Google authentication failed.");
      }
    }
  };

  const handleGoogleError = (err) => {
    if (err?.cancelled) return; // User closed the popup — no error to show
    setError("Google Sign-In failed. Please try again.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    setTouched({ email: true, password: true });

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const errors = { email: null, password: null };
      const issues = result.error.issues || result.error.errors || [];
      issues.forEach((err) => {
        const path = err.path[0];
        if (!errors[path]) errors[path] = err.message;
      });
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({ email: null, password: null });

    try {
      // Step 1: Log in with credentials
      await handleLogin({ email, password });

      // Step 2: If there was a pending Google account link request, execute link
      if (pendingGoogleToken) {
        try {
          await handleLinkGoogle({ accessToken: pendingGoogleToken });
        } catch (linkErr) {
          console.error("Failed linking Google account after login:", linkErr);
        }
      }

      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed. Please try again.");
    }
  };

  // Only show full-screen loader for credential form submit (not Google — it has inline spinner)
  if (loginLoading) {
    return (
      <LoadingScreen
        message="Authenticating your profile..."
        subtitle="Verifying credentials and establishing a secure session."
      />
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#08080A] flex flex-col lg:flex-row font-sans selection:bg-accent/30 selection:text-white">
      {/* Left Section - Executive Telemetry Showcase */}
      <div className="hidden lg:flex w-[48%] flex-col justify-between bg-[#0B0B0E] p-12 lg:p-16 relative overflow-hidden border-r border-white/[0.07]">
        {/* Subtle physical lighting vignette - no generic pulsing balls */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute -top-[20%] -left-[15%] w-[450px] h-[450px] rounded-full bg-accent/[0.07] blur-[100px] orb-isolated" />
          <div className="absolute bottom-[5%] right-[-10%] w-[380px] h-[380px] rounded-full bg-[#FE9A00]/[0.05] blur-[120px] orb-isolated" />
        </div>

        {/* Brand Monogram */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-surface border-t border-white/[0.16] border-x border-b border-white/[0.06] flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.6)] group-hover:border-accent/40 transition-colors">
              <svg className="w-5 h-5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold text-white tracking-[-0.035em]">
                Skill<span className="text-accent">Bridge</span> <span className="text-white/40 text-sm font-mono font-medium">AI</span>
              </span>
              <span className="text-[10px] font-mono tracking-wider text-white/40 uppercase">Intelligence Platform</span>
            </div>
          </Link>
        </div>

        {/* Studio Telemetry Showcase Widget */}
        <div className="relative z-10 my-auto py-8">
          <div className="studio-card p-6 rounded-2xl mb-8 max-w-md shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                <span className="text-[11px] font-mono font-medium text-white/70 uppercase tracking-wider">
                  Candidate Synthesis
                </span>
              </div>
              <span className="text-[11px] font-mono text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
                ACTIVE
              </span>
            </div>

            <div className="space-y-3">
              <div className="studio-well p-3.5 rounded-xl">
                <div className="text-[11px] font-mono text-white/40 uppercase mb-1">Target Position</div>
                <div className="text-sm font-semibold text-white tracking-tight">Staff Systems Architect</div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="studio-well p-3 rounded-xl">
                  <div className="text-[10px] font-mono text-white/40 uppercase mb-1">Calibration Match</div>
                  <div className="text-base font-bold text-accent font-mono">94.8%</div>
                </div>
                <div className="studio-well p-3 rounded-xl">
                  <div className="text-[10px] font-mono text-white/40 uppercase mb-1">Questions Prepared</div>
                  <div className="text-base font-bold text-white font-mono">18 Vectors</div>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-[-0.035em] leading-[1.15] mb-4">
            Master high-stakes <br />
            interviews with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-[#fe9a00]">
              engineered precision.
            </span>
          </h2>
          <p className="text-secondary/75 text-sm leading-relaxed max-w-sm">
            Access your personalized interview intelligence dossiers, diagnostic feedback, and technical roadmaps.
          </p>
        </div>

        {/* Telemetry Footer */}
        <div className="relative z-10 flex items-center justify-between pt-6 border-t border-white/[0.06] text-[11px] font-mono text-white/40">
          <span>LATENCY &lt; 20ms</span>
          <span>SECURITY SHA-256</span>
        </div>
      </div>

      {/* Right Section - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-[420px]">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-[-0.035em] mb-2">
              Welcome back
            </h1>
            <p className="text-secondary/70 text-sm">
              Enter your credentials to access your account.
            </p>
          </div>

          {/* Custom Google Sign-In Button */}
          <div className="mb-6">
            <GoogleButton
              text="continue_with"
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              isLoading={googleLoading}
            />
          </div>

          <div className="relative flex items-center justify-center my-6">
            <div className="border-t border-white/[0.06] w-full" />
            <span className="bg-[#08080A] px-3 text-[11px] text-white/40 uppercase tracking-widest font-mono shrink-0">
              Or credentials
            </span>
            <div className="border-t border-white/[0.06] w-full" />
          </div>

          {/* Account Conflict Banner */}
          {conflictNotice && (
            <div className="mb-5 p-4 rounded-xl bg-amber/10 border border-amber/25 text-amber text-xs animate-fade-in flex items-start gap-3">
              <FiLink className="w-4 h-4 shrink-0 mt-0.5 text-amber" />
              <div className="leading-relaxed">
                <span className="font-semibold block mb-0.5 text-amber">Account Linking Required</span>
                {conflictNotice}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-mono uppercase tracking-wider text-white/60">
                Work Email
              </label>
              <div className="relative group/input">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within/input:text-accent transition-colors duration-200">
                  <FiMail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={() => handleBlur("email")}
                  placeholder="name@company.com"
                  autoComplete="email"
                  className={`w-full pl-11 pr-4 py-3 bg-[#040405] border rounded-xl text-white placeholder-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-accent/15 focus:border-accent/60 transition-all duration-200 ${
                    fieldErrors.email && touched.email
                      ? "border-red-500/50 bg-red-500/5"
                      : "border-white/[0.08] hover:border-white/[0.15]"
                  }`}
                />
              </div>
              {touched.email && fieldErrors.email && (
                <p className="text-red-400 text-xs mt-1.5 font-mono flex items-center gap-1.5 animate-fade-in">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-xs font-mono uppercase tracking-wider text-white/60">
                  Password
                </label>
                <Link to="#" className="text-xs font-mono text-accent hover:text-[#FE9A00] transition-colors">
                  Forgot?
                </Link>
              </div>
              <div className="relative group/input">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within/input:text-accent transition-colors duration-200">
                  <FiLock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={() => handleBlur("password")}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  className={`w-full pl-11 pr-11 py-3 bg-[#040405] border rounded-xl text-white placeholder-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-accent/15 focus:border-accent/60 transition-all duration-200 ${
                    fieldErrors.password && touched.password
                      ? "border-red-500/50 bg-red-500/5"
                      : "border-white/[0.08] hover:border-white/[0.15]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors focus:outline-none cursor-pointer"
                >
                  {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
              {touched.password && fieldErrors.password && (
                <p className="text-red-400 text-xs mt-1.5 font-mono flex items-center gap-1.5 animate-fade-in">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-mono animate-fade-in flex items-start gap-2.5">
                <svg className="w-4 h-4 shrink-0 mt-0.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 mt-2 rounded-xl font-bold text-sm text-white studio-btn-primary flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loginLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Console</span>
                  <FiArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-white/50 mt-8 text-xs font-mono">
            DON'T HAVE AN ACCOUNT?{" "}
            <Link to="/register" className="text-accent font-semibold hover:text-[#FE9A00] transition-colors ml-1">
              CREATE ONE
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

