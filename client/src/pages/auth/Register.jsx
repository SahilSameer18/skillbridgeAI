import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { registerSchema, registerBaseSchema } from "../../schemas/auth.schema.js";
import LoadingScreen from "../../components/layout/LoadingScreen";
import GoogleButton from "../../components/auth/GoogleButton";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";

const FieldError = ({ msg }) =>
  msg ? (
    <p className="text-red-400 text-xs font-mono mt-1.5 flex items-center gap-1.5 animate-fade-in">
      <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
      {msg}
    </p>
  ) : null;

const Register = () => {
  const navigate = useNavigate();
  const { registerLoading, googleLoading, handleRegister, handleGoogleAuth } = useAuth();

  const [fields, setFields] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState(null);
  const [touched, setTouched] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});

  const validateField = (name, value) => {
    let err = null;
    if (name === "confirmPassword") {
      const result = registerBaseSchema.shape.confirmPassword.safeParse(value);
      if (!result.success) {
        err = result.error.issues?.[0]?.message || result.error.errors?.[0]?.message;
      } else if (value !== fields.password) {
        err = "Passwords do not match.";
      }
    } else {
      const fieldSchema = registerBaseSchema.shape[name];
      const result = fieldSchema.safeParse(value);
      err = result.success ? null : (result.error.issues?.[0]?.message || result.error.errors?.[0]?.message);
    }
    setFieldErrors((prev) => ({ ...prev, [name]: err }));
    return err;
  };

  const handleChange = (name) => (e) => {
    const value = e.target.value;
    setFields((prev) => ({ ...prev, [name]: value }));
    setError(null);

    if (touched[name]) {
      if (name === "confirmPassword") {
        const err = value === fields.password ? null : "Passwords do not match.";
        setFieldErrors((prev) => ({ ...prev, confirmPassword: err }));
      } else {
        const fieldSchema = registerBaseSchema.shape[name];
        const result = fieldSchema.safeParse(value);
        const err = result.success ? null : (result.error.issues?.[0]?.message || result.error.errors?.[0]?.message);
        setFieldErrors((prev) => ({ ...prev, [name]: err }));
      }
    }

    if (name === "password" && touched.confirmPassword) {
      const err = fields.confirmPassword === value ? null : "Passwords do not match.";
      setFieldErrors((prev) => ({ ...prev, confirmPassword: err }));
    }
  };

  const handleBlur = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, fields[name]);
  };

  const handleGoogleSuccess = async (tokenResponse) => {
    setError(null);
    try {
      await handleGoogleAuth({ accessToken: tokenResponse.access_token });
      navigate("/");
    } catch (err) {
      if (err?.response?.status === 409) {
        // Store the token and redirect to Login to complete the link flow
        sessionStorage.setItem("pendingGoogleToken", tokenResponse.access_token);
        navigate("/login", {
          state: { pendingGoogleLink: true },
        });
      } else {
        setError(err?.response?.data?.message || "Google registration failed.");
      }
    }
  };

  const handleGoogleError = (err) => {
    if (err?.cancelled) return; // User closed popup — no error needed
    setError("Google Sign-In failed. Please try again.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const allTouched = { username: true, email: true, password: true, confirmPassword: true };
    setTouched(allTouched);

    const result = registerSchema.safeParse(fields);
    if (!result.success) {
      const errors = { username: null, email: null, password: null, confirmPassword: null };
      const issues = result.error.issues || result.error.errors || [];
      issues.forEach((err) => {
        const path = err.path[0];
        if (!errors[path]) {
          errors[path] = err.message;
        }
      });
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({ username: null, email: null, password: null, confirmPassword: null });

    try {
      await handleRegister({ username: fields.username, email: fields.email, password: fields.password });
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  // Only show full-screen loader for credential registration (not Google — it has inline spinner)
  if (registerLoading) {
    return (
      <LoadingScreen
        message="Setting up your account..."
        subtitle="Creating your professional profile and personalized workspace."
      />
    );
  }

  const inputClass = (hasError) =>
    `w-full pl-11 pr-4 py-3 bg-[#040405] border rounded-xl text-white placeholder-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-accent/15 focus:border-accent/60 transition-all duration-200 ${
      hasError
        ? "border-red-500/50 bg-red-500/5"
        : "border-white/[0.08] hover:border-white/[0.15]"
    }`;

  return (
    <div className="min-h-screen w-full bg-[#08080A] flex flex-col lg:flex-row font-sans selection:bg-accent/30 selection:text-white">
      {/* Left Section - Executive Telemetry Showcase */}
      <div className="hidden lg:flex w-[48%] flex-col justify-between bg-[#0B0B0E] p-12 lg:p-16 relative overflow-hidden border-r border-white/[0.07]">
        {/* Subtle physical lighting vignette */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute -top-[15%] -left-[10%] w-[450px] h-[450px] rounded-full bg-[#FE9A00]/[0.06] blur-[100px]" />
          <div className="absolute bottom-[5%] right-[-10%] w-[380px] h-[380px] rounded-full bg-accent/[0.06] blur-[120px]" />
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

        {/* Studio Pipeline Showcase Widget */}
        <div className="relative z-10 my-auto py-8">
          <div className="studio-card p-6 rounded-2xl mb-8 max-w-md shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber shadow-[0_0_8px_rgba(254,154,0,0.8)]" />
                <span className="text-[11px] font-mono font-medium text-white/70 uppercase tracking-wider">
                  Analysis Pipeline
                </span>
              </div>
              <span className="text-[11px] font-mono text-amber bg-amber/10 px-2 py-0.5 rounded border border-amber/20">
                PRO VISION
              </span>
            </div>

            <div className="space-y-2.5">
              {[
                { step: "01", name: "Semantic Resume Parsing", status: "Indexed" },
                { step: "02", name: "Target Role Vectorization", status: "Calibrated" },
                { step: "03", name: "Technical Question Synthesis", status: "AI Ready" },
              ].map((item, idx) => (
                <div key={idx} className="studio-well px-3.5 py-2.5 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[11px] font-mono text-accent">{item.step}</span>
                    <span className="text-xs font-medium text-white/90">{item.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400">{item.status}</span>
                </div>
              ))}
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-[-0.035em] leading-[1.15] mb-4">
            Accelerate your career <br />
            with bespoke <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-[#fe9a00]">
              interview intelligence.
            </span>
          </h2>
          <p className="text-secondary/75 text-sm leading-relaxed max-w-sm">
            Personalized mock assessments, technical gap matrix, and execution roadmaps built for top-tier candidates.
          </p>
        </div>

        {/* Telemetry Footer */}
        <div className="relative z-10 flex items-center justify-between pt-6 border-t border-white/[0.06] text-[11px] font-mono text-white/40">
          <span>PIPELINE v2.4</span>
          <span>ENTERPRISE ISOLATED</span>
        </div>
      </div>

      {/* Right Section - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative overflow-y-auto">
        <div className="w-full max-w-[420px] py-8 lg:py-0">
          <div className="mb-6">
            <span className="studio-badge-coral mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              NEW ACCOUNT
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-[-0.035em] mb-2">
              Create an account
            </h1>
            <p className="text-secondary/70 text-sm">
              Start your journey to interview mastery today.
            </p>
          </div>

          {/* Custom Google Sign-Up Button */}
          <div className="mb-6">
            <GoogleButton
              text="signup_with"
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              isLoading={googleLoading}
            />
          </div>

          <div className="relative flex items-center justify-center my-6">
            <div className="border-t border-white/[0.06] w-full" />
            <span className="bg-[#08080A] px-3 text-[11px] text-white/40 uppercase tracking-widest font-mono shrink-0">
              Or register with email
            </span>
            <div className="border-t border-white/[0.06] w-full" />
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Username Input */}
            <div className="space-y-1.5">
              <label htmlFor="username" className="block text-xs font-mono uppercase tracking-wider text-white/60">
                Username
              </label>
              <div className="relative group/input">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within/input:text-accent transition-colors duration-200">
                  <FiUser className="w-4 h-4" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={fields.username}
                  onChange={handleChange("username")}
                  onBlur={() => handleBlur("username")}
                  placeholder="alex_architect"
                  autoComplete="username"
                  className={inputClass(touched.username && fieldErrors.username)}
                />
              </div>
              {touched.username && <FieldError msg={fieldErrors.username} />}
            </div>

            {/* Email Input */}
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
                  value={fields.email}
                  onChange={handleChange("email")}
                  onBlur={() => handleBlur("email")}
                  placeholder="name@company.com"
                  autoComplete="email"
                  className={inputClass(touched.email && fieldErrors.email)}
                />
              </div>
              {touched.email && <FieldError msg={fieldErrors.email} />}
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-xs font-mono uppercase tracking-wider text-white/60">
                Password
              </label>
              <div className="relative group/input">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within/input:text-accent transition-colors duration-200">
                  <FiLock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={fields.password}
                  onChange={handleChange("password")}
                  onBlur={() => handleBlur("password")}
                  placeholder="••••••••••••"
                  autoComplete="new-password"
                  className={`${inputClass(touched.password && fieldErrors.password)} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors focus:outline-none cursor-pointer"
                >
                  {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
              {touched.password && <FieldError msg={fieldErrors.password} />}
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="block text-xs font-mono uppercase tracking-wider text-white/60">
                Confirm Password
              </label>
              <div className="relative group/input">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within/input:text-accent transition-colors duration-200">
                  <FiLock className="w-4 h-4" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  value={fields.confirmPassword}
                  onChange={handleChange("confirmPassword")}
                  onBlur={() => handleBlur("confirmPassword")}
                  placeholder="••••••••••••"
                  autoComplete="new-password"
                  className={`${inputClass(touched.confirmPassword && fieldErrors.confirmPassword)} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors focus:outline-none cursor-pointer"
                >
                  {showConfirm ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
              {touched.confirmPassword && <FieldError msg={fieldErrors.confirmPassword} />}
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
              disabled={registerLoading}
              className="w-full py-3.5 mt-2 rounded-xl font-bold text-sm text-white studio-btn-primary flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {registerLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <FiArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-white/50 mt-8 text-xs font-mono">
            ALREADY HAVE AN ACCOUNT?{" "}
            <Link to="/login" className="text-accent font-semibold hover:text-[#FE9A00] transition-colors ml-1">
              SIGN IN
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
