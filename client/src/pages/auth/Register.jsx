import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { registerSchema, registerBaseSchema } from "../../schemas/auth.schema.js";

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

const FieldError = ({ msg }) =>
  msg ? (
    <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
      <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      {msg}
    </p>
  ) : null;

const inputClass = (hasError) =>
  `w-full px-4 py-3 rounded-xl bg-slate-900/60 border text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 transition-all duration-200 text-sm ${
    hasError
      ? "border-red-500/60 focus:border-red-500/60 focus:ring-red-500/20"
      : "border-slate-700/60 focus:border-cyan-500/60 focus:ring-cyan-500/20"
  }`;

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
      <div className="min-h-screen flex items-center justify-center bg-[#030712]">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="w-12 h-12 rounded-full border-2 border-purple-500/30 border-t-purple-400 animate-spin" />
          <p className="text-purple-400 text-xl font-semibold">Creating your account...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#030712] px-4 py-12"
      style={{
        backgroundImage:
          "radial-gradient(ellipse 80% 50% at 80% 0%, rgba(168,85,247,0.07) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 20% 10%, rgba(6,182,212,0.07) 0%, transparent 70%)",
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
            <h1 className="text-3xl font-bold text-white mb-2">Create account</h1>
            <p className="text-slate-400">Start your AI-powered interview prep journey</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            {/* Username */}
            <div className="space-y-1.5">
              <label htmlFor="username" className="block text-sm font-medium text-slate-300">Username</label>
              <input
                value={fields.username}
                onChange={handleChange("username")}
                onBlur={() => handleBlur("username")}
                type="text" id="username" name="username"
                placeholder="johndoe"
                autoComplete="username"
                required
                className={inputClass(touched.username && fieldErrors.username)}
              />
              {touched.username && <FieldError msg={fieldErrors.username} />}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium text-slate-300">Email address</label>
              <input
                value={fields.email}
                onChange={handleChange("email")}
                onBlur={() => handleBlur("email")}
                type="email" id="email" name="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
                className={inputClass(touched.email && fieldErrors.email)}
              />
              {touched.email && <FieldError msg={fieldErrors.email} />}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-slate-300">Password</label>
              <div className="relative">
                <input
                  value={fields.password}
                  onChange={handleChange("password")}
                  onBlur={() => handleBlur("password")}
                  type={showPassword ? "text" : "password"}
                  id="password" name="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                  className={`${inputClass(touched.password && fieldErrors.password)} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors focus:outline-none cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
              {touched.password && <FieldError msg={fieldErrors.password} />}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300">Confirm password</label>
              <div className="relative">
                <input
                  value={fields.confirmPassword}
                  onChange={handleChange("confirmPassword")}
                  onBlur={() => handleBlur("confirmPassword")}
                  type={showConfirm ? "text" : "password"}
                  id="confirmPassword" name="confirmPassword"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                  className={`${inputClass(touched.confirmPassword && fieldErrors.confirmPassword)} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors focus:outline-none cursor-pointer"
                  aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                >
                  <EyeIcon open={showConfirm} />
                </button>
              </div>
              {touched.confirmPassword && <FieldError msg={fieldErrors.confirmPassword} />}
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

            <button
              type="submit"
              disabled={registerLoading}
              className="w-full py-3.5 rounded-xl font-semibold text-white transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] text-sm cursor-pointer"
              style={{ background: "linear-gradient(135deg,#06b6d4,#a855f7)", boxShadow: "0 8px 32px rgba(168,85,247,0.2)" }}
            >
              {registerLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;