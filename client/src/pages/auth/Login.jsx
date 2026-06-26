import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { loginSchema } from "../../schemas/auth.schema.js";

const EyeIcon = ({ open }) =>
  open ? (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ) : (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  );

const Login = () => {
  const { loginLoading, handleLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  // Per-field validation errors (shown after first blur or submit attempt)
  const [touched, setTouched] = useState({ email: false, password: false });
  const [fieldErrors, setFieldErrors] = useState({ email: null, password: null });

  const navigate = useNavigate();

  // Validate a single field and update state
  const validateField = (name, value) => {
    const fieldSchema = loginSchema.shape[name];
    const result = fieldSchema.safeParse(value);
    const err = result.success ? null : result.error.errors[0].message;
    setFieldErrors((prev) => ({ ...prev, [name]: err }));
    return err;
  };

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    setError(null); // clear API error on re-type
    if (touched.email) validateField("email", val);
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    setError(null); // clear API error on re-type
    if (touched.password) validateField("password", val);
  };

  const handleBlur = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, name === "email" ? email : password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // safely prevent default; button is type="submit" inside this form
    setError(null);

    // Mark all fields touched and validate
    setTouched({ email: true, password: true });
    
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const errors = { email: null, password: null };
      result.error.errors.forEach((err) => {
        const path = err.path[0];
        if (!errors[path]) {
          errors[path] = err.message;
        }
      });
      setFieldErrors(errors);
      return; // stop if client-side errors exist
    }

    setFieldErrors({ email: null, password: null });

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
    <div
      className="min-h-screen flex items-center justify-center bg-[#030712] px-4 py-12"
      style={{
        backgroundImage:
          "radial-gradient(ellipse 80% 50% at 20% 0%, rgba(6,182,212,0.07) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 10%, rgba(168,85,247,0.07) 0%, transparent 70%)",
      }}
    >
      <div className="relative z-10 w-full max-w-md animate-fade-in-up">
        <div
          className="rounded-3xl p-8 md:p-10 shadow-2xl shadow-black/40"
          style={{
            background: "rgba(15,23,42,0.7)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg"
              style={{ background: "linear-gradient(135deg,#06b6d4,#a855f7)" }}
            >
              S
            </div>
            <span className="text-xl font-bold text-gradient-cyan">SkillBridge AI</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-slate-400">Sign in to your account to continue</p>
          </div>

          {/* FIX: button type="submit" lives inside this form, so e.preventDefault() is safe */}
          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                Email address
              </label>
              <input
                value={email}                          // FIX: controlled input
                onChange={handleEmailChange}           // FIX: clears API error on re-type
                onBlur={() => handleBlur("email")}     // FIX: validate on blur
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
                className={`w-full px-4 py-3 rounded-xl bg-slate-900/60 border text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 transition-all duration-200 text-sm ${
                  fieldErrors.email && touched.email
                    ? "border-red-500/60 focus:border-red-500/60 focus:ring-red-500/20"
                    : "border-slate-700/60 focus:border-cyan-500/60 focus:ring-cyan-500/20"
                }`}
              />
              {/* FIX: inline validation feedback */}
              {touched.email && fieldErrors.email && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                Password
              </label>
              <div className="relative">
                <input
                  value={password}                        // FIX: controlled input
                  onChange={handlePasswordChange}         // FIX: clears API error on re-type
                  onBlur={() => handleBlur("password")}   // FIX: validate on blur
                  type={showPassword ? "text" : "password"} // FIX: visibility toggle
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className={`w-full px-4 py-3 pr-11 rounded-xl bg-slate-900/60 border text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 transition-all duration-200 text-sm ${
                    fieldErrors.password && touched.password
                      ? "border-red-500/60 focus:border-red-500/60 focus:ring-red-500/20"
                      : "border-slate-700/60 focus:border-cyan-500/60 focus:ring-cyan-500/20"
                  }`}
                />
                {/* FIX: password visibility toggle button */}
                <button
                  type="button"                           // FIX: type="button" prevents form submit
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors focus:outline-none cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
              {/* FIX: inline validation feedback */}
              {touched.password && fieldErrors.password && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {/* API-level error */}
            {error && (
              <div
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-red-400 text-sm animate-slide-up"
                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}
              >
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            {/* FIX: type="submit" is explicit and lives inside the form */}
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 rounded-xl font-semibold text-white transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] text-sm cursor-pointer"
              style={{
                background: "linear-gradient(135deg,#06b6d4,#a855f7)",
                boxShadow: "0 8px 32px rgba(168,85,247,0.2)",
              }}
            >
              {loginLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;