import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { registerSchema, registerBaseSchema } from "../../schemas/auth.schema.js";
import LoadingScreen from "../../components/common/LoadingScreen";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

const FieldError = ({ msg }) =>
  msg ? (
    <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1.5 animate-slide-up">
      <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
      {msg}
    </p>
  ) : null;

const Register = () => {
  const navigate = useNavigate();
  const { registerLoading, handleRegister } = useAuth();

  // Controlled state
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
        err = result.error.errors[0].message;
      } else if (value !== fields.password) {
        err = "Passwords do not match.";
      }
    } else {
      const fieldSchema = registerBaseSchema.shape[name];
      const result = fieldSchema.safeParse(value);
      err = result.success ? null : result.error.errors[0].message;
    }
    setFieldErrors((prev) => ({ ...prev, [name]: err }));
    return err;
  };

  const handleChange = (name) => (e) => {
    const value = e.target.value;
    setFields((prev) => ({ ...prev, [name]: value }));
    setError(null); // clear API error on re-type
    
    if (touched[name]) {
      if (name === "confirmPassword") {
        const err = value === fields.password ? null : "Passwords do not match.";
        setFieldErrors((prev) => ({ ...prev, confirmPassword: err }));
      } else {
        const fieldSchema = registerBaseSchema.shape[name];
        const result = fieldSchema.safeParse(value);
        const err = result.success ? null : result.error.errors[0].message;
        setFieldErrors((prev) => ({ ...prev, [name]: err }));
      }
    }
    
    // Re-validate confirmPassword live if password changes
    if (name === "password" && touched.confirmPassword) {
      const err = fields.confirmPassword === value ? null : "Passwords do not match.";
      setFieldErrors((prev) => ({ ...prev, confirmPassword: err }));
    }
  };

  const handleBlur = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, fields[name]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Touch all fields and validate
    const allTouched = { username: true, email: true, password: true, confirmPassword: true };
    setTouched(allTouched);

    const result = registerSchema.safeParse(fields);
    if (!result.success) {
      const errors = { username: null, email: null, password: null, confirmPassword: null };
      result.error.errors.forEach((err) => {
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

  if (registerLoading) {
    return (
      <LoadingScreen
        message="Setting up your account..."
        subtitle="Creating your professional profile and personalized workspace."
      />
    );
  }

  const inputClass = (hasError) =>
    `w-full pl-11 pr-4 py-3 bg-slate-900/40 border rounded-2xl text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/10 focus:border-cyan-500/50 transition-all duration-300 text-sm ${
      hasError ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/10' : 'border-white/[0.06] hover:border-white/[0.12]'
    }`;

  return (
    <div className="min-h-screen w-full bg-[#030712] flex items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Premium Multi-Layered Moving Gradient Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Sphere 1 */}
        <div 
          className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] rounded-full animate-pulse"
          style={{ 
            animationDuration: '9s',
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.09) 0%, transparent 70%)',
            willChange: 'opacity'
          }}
        />
        {/* Sphere 2 */}
        <div 
          className="absolute -bottom-[10%] -left-[10%] w-[60%] h-[60%] rounded-full animate-pulse"
          style={{ 
            animationDuration: '11s',
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.09) 0%, transparent 70%)',
            willChange: 'opacity'
          }}
        />
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[440px] animate-fade-in">
        {/* Card Container */}
        <div 
          className="w-full backdrop-blur-xl bg-slate-950/40 border border-white/[0.06] rounded-3xl p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group"
          style={{ willChange: 'backdrop-filter' }}
        >
          {/* Subtle top reflection border line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
          
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-6 group/logo">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-[0_0_20px_rgba(168,85,247,0.25)] group-hover/logo:scale-105 transition-transform duration-300">
                S
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent tracking-wide">
                SkillBridge AI
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-white tracking-tight mb-2">Create Account</h1>
            <p className="text-slate-400 text-sm">Start your AI-powered preparation journey</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Username Input */}
            <div className="space-y-1.5">
              <label htmlFor="username" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Username
              </label>
              <div className="relative group/input">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-cyan-400 transition-colors duration-200">
                  <FiUser className="w-4 h-4" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={fields.username}
                  onChange={handleChange("username")}
                  onBlur={() => handleBlur("username")}
                  placeholder="sameer"
                  autoComplete="username"
                  required
                  className={inputClass(touched.username && fieldErrors.username)}
                />
              </div>
              {touched.username && <FieldError msg={fieldErrors.username} />}
            </div>

            {/* Email Input */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative group/input">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-cyan-400 transition-colors duration-200">
                  <FiMail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={fields.email}
                  onChange={handleChange("email")}
                  onBlur={() => handleBlur("email")}
                  placeholder="name@example.com"
                  autoComplete="email"
                  required
                  className={inputClass(touched.email && fieldErrors.email)}
                />
              </div>
              {touched.email && <FieldError msg={fieldErrors.email} />}
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Password
              </label>
              <div className="relative group/input">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-cyan-400 transition-colors duration-200">
                  <FiLock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={fields.password}
                  onChange={handleChange("password")}
                  onBlur={() => handleBlur("password")}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                  className={`${inputClass(touched.password && fieldErrors.password)} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors focus:outline-none cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
              {touched.password && <FieldError msg={fieldErrors.password} />}
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Confirm Password
              </label>
              <div className="relative group/input">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-cyan-400 transition-colors duration-200">
                  <FiLock className="w-4 h-4" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  value={fields.confirmPassword}
                  onChange={handleChange("confirmPassword")}
                  onBlur={() => handleBlur("confirmPassword")}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                  className={`${inputClass(touched.confirmPassword && fieldErrors.confirmPassword)} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors focus:outline-none cursor-pointer"
                  aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirm ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
              {touched.confirmPassword && <FieldError msg={fieldErrors.confirmPassword} />}
            </div>

            {/* API-level Error Message */}
            {error && (
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-red-500/5 border border-red-500/10 text-red-400 text-xs leading-relaxed animate-slide-up">
                <span className="w-2 h-2 rounded-full bg-red-400 shrink-0 animate-pulse" />
                {error}
              </div>
            )}

            {/* Action Button */}
            <button
              type="submit"
              disabled={registerLoading}
              className="w-full py-3.5 mt-2 rounded-2xl font-bold text-white transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-sm cursor-pointer shadow-[0_8px_20px_rgba(168,85,247,0.15)] hover:shadow-[0_8px_25px_rgba(168,85,247,0.3)]"
              style={{ background: "linear-gradient(135deg, #a855f7 0%, #6366f1 50%, #06b6d4 100%)" }}
            >
              {registerLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-8">
            Already have an account?{" "}
            <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-medium hover:underline transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;